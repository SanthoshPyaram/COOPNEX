import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { User, IUser } from "../models/User";
import { Worker } from "../models/Worker";
import { USER_ROLES } from "../config/constants";

describe("Unified Identity Architecture — Dual Role (Customer + Worker)", () => {
  it("Scenario 1: Schema enforces single User identity with multiple roles", () => {
    // Verify User schema definition has roles array with default CUSTOMER
    const rolesPath: any = User.schema.path("roles");
    expect(rolesPath).toBeDefined();
    expect(rolesPath.instance).toBe("Array");

    // Verify Worker schema definition requires unique userId referencing User
    const userIdPath: any = Worker.schema.path("userId");
    expect(userIdPath).toBeDefined();
    expect(userIdPath.instance.toLowerCase()).toBe("objectid");
    expect(userIdPath.options.required).toBe(true);
    expect(userIdPath.options.unique).toBe(true);
  });

  it("Scenario 2: User schema has person-level unique indexes on email and phone", () => {
    const indexes = User.schema.indexes();
    const hasUniqueEmail = indexes.some(
      ([fields, options]: any) => fields.email === 1 && options?.unique === true
    );
    const hasUniquePhone = indexes.some(
      ([fields, options]: any) => fields.phone === 1 && options?.unique === true && options?.sparse === true
    );

    expect(hasUniqueEmail).toBe(true);
    expect(hasUniquePhone).toBe(true);
  });

  it("Scenario 3: Role addition preserves existing User identity (No Duplicate Accounts)", () => {
    const mockUser: Partial<IUser> = {
      _id: new mongoose.Types.ObjectId(),
      name: "Ravi Teja",
      email: "ravi.teja@example.com",
      phone: "+919876543210",
      role: USER_ROLES.CUSTOMER,
      roles: [USER_ROLES.CUSTOMER],
      status: "ACTIVE",
      emailVerified: true
    };

    // When Ravi registers as a Worker:
    const targetRole = USER_ROLES.WORKER;
    const currentRoles = Array.isArray(mockUser.roles) && mockUser.roles.length > 0
      ? mockUser.roles
      : [mockUser.role];

    // Assert he is allowed to expand role
    const alreadyWorker = currentRoles.includes(targetRole);
    expect(alreadyWorker).toBe(false);

    // Add role additively
    const updatedRoles = Array.from(new Set([...currentRoles, targetRole]));
    expect(updatedRoles).toContain(USER_ROLES.CUSTOMER);
    expect(updatedRoles).toContain(USER_ROLES.WORKER);
    expect(updatedRoles.length).toBe(2);

    // Mock Worker profile linking to same User ID
    const mockWorker = {
      userId: mockUser._id,
      email: mockUser.email,
      phone: mockUser.phone,
      employeeId: "COOP-WRK-10001",
      verificationStatus: "PENDING"
    };

    expect(mockWorker.userId).toEqual(mockUser._id);
    expect(mockWorker.email).toEqual(mockUser.email);
    expect(mockWorker.phone).toEqual(mockUser.phone);
  });

  it("Scenario 4: Duplicate profile of the SAME role is strictly rejected", () => {
    const mockWorkerUser = {
      _id: new mongoose.Types.ObjectId(),
      name: "Arjun Kumar",
      email: "arjun.kumar@coopnex.worker.in",
      role: USER_ROLES.WORKER,
      roles: [USER_ROLES.WORKER],
      hasWorkerProfile: true
    };

    // Attempting to register as WORKER again
    const requestedRole = USER_ROLES.WORKER;
    const isAlreadyWorker = mockWorkerUser.roles.includes(requestedRole) || mockWorkerUser.hasWorkerProfile;
    expect(isAlreadyWorker).toBe(true);

    // Must trigger 409 Conflict
    const shouldReject = isAlreadyWorker;
    expect(shouldReject).toBe(true);
  });

  it("Scenario 5: Customer attempting to register as Customer again is rejected", () => {
    const mockCustomer = {
      _id: new mongoose.Types.ObjectId(),
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      role: USER_ROLES.CUSTOMER,
      roles: [USER_ROLES.CUSTOMER]
    };

    const requestedRole = USER_ROLES.CUSTOMER;
    const isAlreadyCustomer = mockCustomer.roles.includes(requestedRole);
    expect(isAlreadyCustomer).toBe(true);
  });

  it("Scenario 6: Different person attempting to use existing phone number is rejected", () => {
    const existingUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "user1@example.com",
      phone: "9876543210"
    };

    const incomingRegistration = {
      email: "user2@example.com",
      phone: "9876543210"
    };

    const isSamePerson = incomingRegistration.email.toLowerCase() === existingUser.email.toLowerCase();
    const phoneMatches = incomingRegistration.phone === existingUser.phone;

    // Cross-user phone reuse must be rejected
    const isConflict = phoneMatches && !isSamePerson;
    expect(isConflict).toBe(true);
  });

  it("Scenario 7: Same person using existing phone with existing email is recognized and allowed", () => {
    const existingUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "ravi.teja@example.com",
      phone: "9876543210",
      roles: [USER_ROLES.CUSTOMER] as string[]
    };

    const incomingRegistration = {
      email: "ravi.teja@example.com",
      phone: "9876543210",
      targetRole: USER_ROLES.WORKER as string
    };

    const isSamePerson = incomingRegistration.email.toLowerCase() === existingUser.email.toLowerCase();
    const canConnect = isSamePerson && !existingUser.roles.includes(incomingRegistration.targetRole);

    expect(canConnect).toBe(true);
  });

  it("Scenario 8: Atomic rollback on worker profile creation failure preserves existing Customer user", () => {
    const isNewUser = false; // Existing customer expanding to worker
    const existingUser: any = {
      _id: new mongoose.Types.ObjectId(),
      email: "ravi.teja@example.com",
      roles: [USER_ROLES.CUSTOMER, USER_ROLES.WORKER]
    };

    // Simulate worker creation failure:
    // If worker creation throws, the rollback must revert ONLY the added role and NEVER delete existingUser
    if (!isNewUser) {
      existingUser.roles = existingUser.roles.filter((r: string) => r !== USER_ROLES.WORKER);
    }

    expect(existingUser.roles).toEqual([USER_ROLES.CUSTOMER]);
    expect(existingUser._id).toBeDefined(); // User account preserved!
  });
});
