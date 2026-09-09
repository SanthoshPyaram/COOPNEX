import React from "react";
import { HumanVisual } from "../HumanVisual";
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  Download,
  Building2
} from "lucide-react";

export const WorkerEarningsTab: React.FC = () => {
  const earningsLedger = [
    {
      id: "e-1",
      bookingId: "BK-VJA-2026-801",
      customer: "Smt. Priya Sharma",
      service: "Emergency MCB Main Line Tripping",
      date: "Today, 14:30",
      grossPaid: 800,
      coopDeduction: 80, // 10% statutory welfare & admin
      platformCut: 0, // 0% middleman cut
      netEarning: 720,
      status: "CREDITED_VIA_DBT"
    },
    {
      id: "e-2",
      bookingId: "BK-VJA-2026-794",
      customer: "Sri K. Venkat Rao",
      service: "Inverter Backfeed Circuit Installation",
      date: "08 Sep 2026",
      grossPaid: 750,
      coopDeduction: 75,
      platformCut: 0,
      netEarning: 675,
      status: "CREDITED_VIA_DBT"
    },
    {
      id: "e-3",
      bookingId: "BK-VJA-2026-778",
      customer: "Sri T. Nageswara Rao",
      service: "Heavy Appliance Earthing Spike Check",
      date: "06 Sep 2026",
      grossPaid: 600,
      coopDeduction: 60,
      platformCut: 0,
      netEarning: 540,
      status: "CREDITED_VIA_DBT"
    },
    {
      id: "e-4",
      bookingId: "BK-VJA-2026-742",
      customer: "Smt. L. Madhavi",
      service: "Distribution Box Health Inspection",
      date: "04 Sep 2026",
      grossPaid: 500,
      coopDeduction: 50,
      platformCut: 0,
      netEarning: 450,
      status: "CREDITED_VIA_DBT"
    }
  ];

  const weeklyDays = [
    { day: "Mon", amount: 650, height: "45%" },
    { day: "Tue", amount: 900, height: "65%" },
    { day: "Wed", amount: 550, height: "38%" },
    { day: "Thu", amount: 1200, height: "85%" },
    { day: "Fri", amount: 750, height: "52%" },
    { day: "Sat", amount: 1400, height: "100%", isPeak: true },
    { day: "Sun", amount: 650, height: "45%" }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Banner with Human Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Fair Wage & Earnings Ledger</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown: 90% direct to artisan DBT, 10% cooperative welfare fund, 0% platform profit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Commission Cooperative Guarantee</span>
          </span>
          <HumanVisual role="electrician" size="xs" animation="subtle" background="none" />
        </div>
      </div>

      {/* 4 TOP EARNINGS METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Today's Earnings</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹650</div>
          <span className="text-[10px] text-emerald-600 font-bold">1 job completed today</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">This Week</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹4,200</div>
          <span className="text-[10px] text-emerald-600 font-bold">↑ 8% vs last week</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">This Month (September)</span>
          <div className="text-2xl font-black text-[#2563EB] mt-1">₹24,800</div>
          <span className="text-[10px] text-blue-600 font-bold">36 jobs completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Lifetime Escrow DBT</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹68,400</div>
          <span className="text-[10px] text-slate-400">184 total platform jobs</span>
        </div>
      </div>

      {/* WEEKLY REVENUE CHART */}
      <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Weekly Earnings Distribution
          </h4>
          <span className="text-xs font-bold text-slate-500">Weekly Total: ₹6,100</span>
        </div>

        <div className="grid grid-cols-7 gap-2 h-44 items-end pt-4">
          {weeklyDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-mono font-bold text-slate-700">₹{d.amount}</span>
              <div
                style={{ height: d.height }}
                className={`w-full max-w-[42px] rounded-t-xl transition-all ${
                  d.isPeak ? "bg-blue-600 shadow-sm" : "bg-blue-200 hover:bg-blue-300"
                }`}
              />
              <span className="text-xs font-bold text-slate-600">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED EARNINGS LEDGER TABLE */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-900">Recent Service Payout Ledger</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer & Service</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Customer Paid</th>
                <th className="py-3 px-3 text-right">Co-op Fund (10%)</th>
                <th className="py-3 px-3 text-right">Net Worker Pay</th>
                <th className="py-3 px-3 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {earningsLedger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                    {item.bookingId}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{item.customer}</span>
                    <span className="text-[10px] text-slate-500">{item.service}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-slate-900">
                    ₹{item.grossPaid}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-amber-700">
                    -₹{item.coopDeduction}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-emerald-600 text-sm">
                    ₹{item.netEarning}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Direct DBT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

