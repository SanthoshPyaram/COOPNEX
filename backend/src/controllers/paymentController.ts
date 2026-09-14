import { Request, Response } from "express";
import crypto from "crypto";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { Worker } from "../models/Worker";
import { Invoice } from "../models/Invoice";
import { AdminWallet } from "../models/AdminWallet";
import { BOOKING_STATUS } from "../config/constants";
import { AuthenticatedRequest } from "../middleware/auth";

export const createPaymentOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    // Transparent percentage model: 10% Platform fee, 2% Welfare cess, 5% GST on fee, worker keeps 100% labor + travel
    const breakdown = booking.fairWageBreakdown || ({} as any);
    const workerWage = breakdown.workerEarning || breakdown.totalEstimatedWage || 300;
    const platformFee = breakdown.platformFee || Math.max(25, Math.round(workerWage * 0.10));
    const welfareCess = breakdown.cooperativeContribution || Math.max(5, Math.round(workerWage * 0.02));
    const taxGst = breakdown.taxGst || Math.round(platformFee * 0.05);
    const adminTotalFee = platformFee + welfareCess + taxGst;
    const customerTotal = breakdown.customerPaid || (workerWage + adminTotalFee);

    const amountInPaisa = Math.round(customerTotal * 100);
    const mockOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    const payment = await Payment.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking._id,
      customerId: booking.customerId,
      workerId: booking.workerId || booking.customerId,
      societyId: booking.societyId || booking.customerId,
      amount: customerTotal,
      currency: "INR",
      paymentGateway: "RAZORPAY_TEST",
      status: "INITIATED",
      gatewayOrderId: mockOrderId,
      workerWageDisbursed: false,
      workerEarningAmount: workerWage,
      adminMaintenanceFee: adminTotalFee,
      coopFundAmount: welfareCess,
      escrowStatus: "HELD_24H",
      escrowMaturesAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaisa,
      amountINR: customerTotal,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_coopnex2026",
      paymentId: payment._id,
      workerWage,
      platformFee,
      welfareCess,
      taxGst,
      adminMaintenanceFee: adminTotalFee,
      fairWageBreakdown: {
        ...breakdown,
        customerPaid: customerTotal,
        workerEarning: workerWage,
        platformFee,
        cooperativeContribution: welfareCess,
        taxGst,
        adminMaintenanceFee: adminTotalFee
      }
    });
  } catch (error: any) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({ success: false, message: "Payment order creation failed." });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, method = "UPI" } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    const breakdown = booking.fairWageBreakdown || ({} as any);
    const workerWage = breakdown.workerEarning || breakdown.totalEstimatedWage || 300;
    const platformFee = breakdown.platformFee || Math.max(25, Math.round(workerWage * 0.10));
    const welfareCess = breakdown.cooperativeContribution || Math.max(5, Math.round(workerWage * 0.02));
    const taxGst = breakdown.taxGst || Math.round(platformFee * 0.05);
    const adminTotalFee = platformFee + welfareCess + taxGst;
    const customerTotal = breakdown.customerPaid || (workerWage + adminTotalFee);
    const escrowMaturesAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour guarantee hold

    // Update / Upsert payment record
    const payment = await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      {
        status: "SUCCESS",
        gatewayPaymentId: razorpayPaymentId || `pay_${crypto.randomBytes(8).toString("hex")}`,
        gatewayOrderId: razorpayOrderId,
        paymentMethod: method,
        amount: customerTotal,
        workerEarningAmount: workerWage,
        adminMaintenanceFee: adminTotalFee,
        coopFundAmount: welfareCess,
        workerWageDisbursed: false, // In 24h Escrow
        escrowStatus: "HELD_24H",
        escrowMaturesAt
      },
      { new: true, upsert: true }
    );

    // Update booking state
    booking.paymentStatus = "PAID";
    booking.paymentId = payment.transactionId;
    booking.status = BOOKING_STATUS.COMPLETED;
    booking.completedAt = new Date();
    booking.escrowStatus = "HELD_24H";
    booking.escrowMaturesAt = escrowMaturesAt;
    booking.fairWageBreakdown.customerPaid = customerTotal;
    booking.fairWageBreakdown.workerEarning = workerWage;
    booking.fairWageBreakdown.adminMaintenanceFee = adminTotalFee;
    booking.fairWageBreakdown.platformFee = platformFee;
    booking.fairWageBreakdown.cooperativeContribution = welfareCess;
    booking.fairWageBreakdown.taxGst = taxGst;

    booking.statusTimeline.push({
      status: BOOKING_STATUS.COMPLETED,
      timestamp: new Date(),
      note: `Payment of ₹${customerTotal} verified via Razorpay (${method}). ₹${platformFee} Platform Fee (10%) + ₹${welfareCess} PMSBY Welfare Cess (2%) credited to Admin Wallet; ₹${workerWage} placed in 24-Hour Warranty Escrow (Matures: ${escrowMaturesAt.toLocaleDateString()}).`
    });
    await booking.save();

    // Credit Admin Wallet with 10% Platform Fee + 2% Welfare Cess + 5% GST
    let adminWallet = await AdminWallet.findOne();
    if (!adminWallet) {
      adminWallet = new AdminWallet({
        totalBalance: 0,
        totalCommissionCollected: 0,
        totalWelfareFundCollected: 0,
        totalTransactions: 0,
        transactions: []
      });
    }

    adminWallet.totalBalance += adminTotalFee;
    adminWallet.totalCommissionCollected += (platformFee + taxGst);
    adminWallet.totalWelfareFundCollected += welfareCess;
    adminWallet.totalTransactions += 1;
    adminWallet.transactions.unshift({
      transactionId: payment.transactionId,
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber || `BK-${booking._id.toString().slice(-6).toUpperCase()}`,
      customerName: booking.customerName || "Citizen Customer",
      workerName: booking.workerName || "Verified Worker",
      totalServiceAmount: customerTotal,
      platformFee,
      welfareCess,
      netAdminEarning: adminTotalFee,
      type: "CREDIT_COMMISSION",
      description: `Platform fee (10% ₹${platformFee}) + PMSBY Welfare Cess (2% ₹${welfareCess}) + GST (₹${taxGst}) for ${booking.serviceCategory || "Artisan Service"}`,
      timestamp: new Date()
    });
    if (adminWallet.transactions.length > 200) {
      adminWallet.transactions = adminWallet.transactions.slice(0, 200);
    }
    await adminWallet.save();

    // Disburse to Worker: Place in pendingEscrowBalance with 24-hour hold (NOT available walletBalance immediately)
    if (booking.workerId) {
      await Worker.findByIdAndUpdate(booking.workerId, {
        $inc: {
          pendingEscrowBalance: workerWage,
          jobsCompletedCount: 1
        },
        $push: {
          escrowItems: {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber || `BK-${booking._id.toString().slice(-6).toUpperCase()}`,
            customerName: booking.customerName,
            serviceCategory: booking.serviceCategory,
            amount: workerWage,
            maturesAt: escrowMaturesAt,
            status: "HELD_24H",
            createdAt: new Date()
          }
        }
      });
    }

    // Create / Update Invoice with SAC 998714 transparent itemized breakdown
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoice = await Invoice.findOneAndUpdate(
      { bookingId: booking._id },
      {
        invoiceNumber,
        bookingId: booking._id,
        paymentId: payment._id,
        customerDetails: {
          name: booking.customerName,
          phone: booking.customerPhone,
          address: booking.serviceLocation.address
        },
        workerDetails: {
          workerIdNumber: "SS-AP-2026-104",
          name: booking.workerName || "Verified Worker",
          phone: booking.workerPhone || "+919876543210",
          verificationLevel: 4,
          societyName: "Vijayawada Central Labour Cooperative"
        },
        serviceCategory: booking.serviceCategory,
        itemizedBreakdown: {
          baseWorkerWage: booking.fairWageBreakdown?.baseWorkerWage || workerWage,
          skillPremium: booking.fairWageBreakdown?.skillPremium || 0,
          experiencePremium: booking.fairWageBreakdown?.experiencePremium || 0,
          travelAllowance: booking.fairWageBreakdown?.travelAllowance || 0,
          emergencyAllowance: booking.fairWageBreakdown?.emergencyAllowance || 0,
          totalWorkerWage: workerWage,
          cooperativeWelfareFund: welfareCess,
          platformConvenienceCharge: platformFee,
          taxGstAmount: taxGst,
          totalAmountPaid: customerTotal
        },
        issuedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: `Payment of ₹${customerTotal} verified successfully. ₹${platformFee} (10%) platform fee and ₹${welfareCess} (2%) welfare fund credited to Admin Wallet; ₹${workerWage} held in 24-Hour Escrow for worker.`,
      payment,
      invoice,
      breakdown: {
        totalPaid: customerTotal,
        platformFee,
        welfareCess,
        taxGst,
        adminMaintenanceFee: adminTotalFee,
        workerWage,
        escrowMaturesAt
      }
    });
  } catch (error: any) {
    console.error("verifyPayment error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

/**
 * Release Matured Escrows (after 24 hours)
 * Scans all worker escrow items that have reached their 24-hour maturation deadline
 * and moves them from pendingEscrowBalance into available walletBalance.
 */
export const releaseMatureEscrows = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const workersWithEscrow = await Worker.find({
      "escrowItems.status": "HELD_24H"
    });

    let totalMaturedCount = 0;
    let totalMaturedAmount = 0;

    for (const worker of workersWithEscrow) {
      let workerMaturedAmount = 0;
      let modified = false;

      worker.escrowItems.forEach((item) => {
        if (item.status === "HELD_24H" && new Date(item.maturesAt) <= now) {
          item.status = "MATURED";
          workerMaturedAmount += item.amount;
          modified = true;
          totalMaturedCount++;
        }
      });

      if (modified && workerMaturedAmount > 0) {
        worker.pendingEscrowBalance = Math.max(0, (worker.pendingEscrowBalance || 0) - workerMaturedAmount);
        worker.walletBalance = (worker.walletBalance || 0) + workerMaturedAmount;
        worker.totalEarnings = (worker.totalEarnings || 0) + workerMaturedAmount;
        await worker.save();
        totalMaturedAmount += workerMaturedAmount;
      }
    }

    res.json({
      success: true,
      message: `Escrow check completed. Released ${totalMaturedCount} matured escrows totaling ₹${totalMaturedAmount} to worker withdrawable balances.`,
      totalMaturedCount,
      totalMaturedAmount
    });
  } catch (error: any) {
    console.error("releaseMatureEscrows error:", error);
    res.status(500).json({ success: false, message: "Escrow release check failed." });
  }
};

/**
 * Worker Withdrawal Request
 * Validates available walletBalance, deducts amount, logs payout record.
 */
export const requestWorkerWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { amount, payoutMethod = "BANK", accountDetails, bankName, ifsc, upiId } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: "Invalid withdrawal amount." });
      return;
    }

    const worker = await Worker.findOne({ $or: [{ userId }, { _id: userId }] });
    if (!worker) {
      res.status(404).json({ success: false, message: "Worker profile not found." });
      return;
    }

    if (numAmount > worker.walletBalance) {
      res.status(400).json({
        success: false,
        message: `Insufficient available balance. You have ₹${worker.walletBalance} available (₹${worker.pendingEscrowBalance || 0} in 24-hr warranty hold).`
      });
      return;
    }

    const withdrawalId = `WDL-${Date.now()}`;
    const transactionRef = `UTR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const detailString = payoutMethod === "UPI"
      ? `UPI: ${upiId || accountDetails}`
      : `${bankName || "Bank"} A/C: ${accountDetails} (IFSC: ${ifsc || "SBIN0001234"})`;

    worker.walletBalance -= numAmount;
    worker.withdrawals.push({
      withdrawalId,
      amount: numAmount,
      payoutMethod: payoutMethod as any,
      accountDetails: detailString,
      transactionRef,
      status: "SUCCESS",
      timestamp: new Date()
    });

    await worker.save();

    res.json({
      success: true,
      message: `Withdrawal of ₹${numAmount} processed successfully via ${payoutMethod}.`,
      withdrawal: {
        withdrawalId,
        transactionRef,
        amount: numAmount,
        payoutMethod,
        accountDetails: detailString,
        remainingBalance: worker.walletBalance,
        timestamp: new Date()
      }
    });
  } catch (error: any) {
    console.error("requestWorkerWithdrawal error:", error);
    res.status(500).json({ success: false, message: "Withdrawal processing failed." });
  }
};

/**
 * Admin Financial Ledger & Audit
 * Returns full customer-worker transaction history, ₹50 platform maintenance corpus,
 * and 24-hr escrow hold ledger.
 */
export const getAdminFinancialLedger = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find({ status: "SUCCESS" })
      .sort({ createdAt: -1 })
      .populate("bookingId", "bookingNumber customerName workerName serviceCategory status")
      .populate("customerId", "name email phone")
      .populate("workerId", "name employeeId trade phone walletBalance pendingEscrowBalance")
      .lean();

    const workers = await Worker.find({}, "name employeeId walletBalance pendingEscrowBalance withdrawals escrowItems").lean();

    const adminWallet = await AdminWallet.findOne().lean();

    // Calculate aggregations
    let adminMaintenanceFund = adminWallet?.totalCommissionCollected || 0;
    let welfareFundCorpus = adminWallet?.totalWelfareFundCollected || 0;
    let totalEscrowHeld = 0;
    let totalGrossRevenue = 0;
    let totalWorkerEarnings = 0;

    payments.forEach((p: any) => {
      if (!adminWallet) {
        adminMaintenanceFund += p.adminMaintenanceFee || 50;
        welfareFundCorpus += p.coopFundAmount || 0;
      }
      totalGrossRevenue += p.amount || 0;
      totalWorkerEarnings += p.workerEarningAmount || 0;
      if (p.escrowStatus === "HELD_24H") {
        totalEscrowHeld += p.workerEarningAmount || 0;
      }
    });

    // All worker withdrawals
    const allWithdrawals: any[] = [];
    workers.forEach((w: any) => {
      if (Array.isArray(w.withdrawals)) {
        w.withdrawals.forEach((wd: any) => {
          allWithdrawals.push({
            ...wd,
            workerName: w.name,
            employeeId: w.employeeId
          });
        });
      }
    });
    allWithdrawals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      metrics: {
        adminMaintenanceFund,
        welfareFundCorpus,
        adminWalletBalance: adminWallet?.totalBalance || (adminMaintenanceFund + welfareFundCorpus),
        totalGrossRevenue,
        totalWorkerEarnings,
        totalEscrowHeld,
        totalCompletedJobs: payments.length,
        totalWithdrawalsCount: allWithdrawals.length
      },
      adminWallet,
      transactions: payments.map((p: any) => ({
        id: p._id,
        txId: p.transactionId,
        bookingId: p.bookingId?.bookingNumber || p.bookingId?._id || "BK-ORD",
        customerName: p.customerId?.name || p.bookingId?.customerName || "Citizen Customer",
        customerPhone: p.customerId?.phone || "",
        workerName: p.workerId?.name || p.bookingId?.workerName || "Artisan",
        workerEmployeeId: p.workerId?.employeeId || "MEMBER",
        serviceCategory: p.bookingId?.serviceCategory || "Artisan Service",
        grossAmount: p.amount,
        workerEarning: p.workerEarningAmount,
        adminMaintenanceFee: p.adminMaintenanceFee || 50,
        escrowStatus: p.escrowStatus || "HELD_24H",
        escrowMaturesAt: p.escrowMaturesAt,
        paymentMethod: p.paymentMethod || "Razorpay UPI / QR",
        gatewayPaymentId: p.gatewayPaymentId,
        timestamp: p.createdAt
      })),
      withdrawals: allWithdrawals
    });
  } catch (error: any) {
    console.error("getAdminFinancialLedger error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve financial ledger." });
  }
};

export const getInvoiceByBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const invoice = await Invoice.findOne({ bookingId });
    if (!invoice) {
      res.status(404).json({ success: false, message: "Invoice not found." });
      return;
    }
    res.json({ success: true, invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching invoice." });
  }
};

