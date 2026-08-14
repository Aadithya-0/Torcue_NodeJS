import bcryptjs from "bcryptjs";
import prisma from "./prisma";
import { registerUser } from "./services/authService";

jest.mock("./prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

describe("auth service", () => {
  const mockedPrisma = prisma as any;
  const mockedBcrypt = bcryptjs as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers a new user with valid credentials", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue("hashed-password");
    mockedPrisma.user.create.mockResolvedValue({
      id: 1,
      username: "alice",
      password: "hashed-password",
    });

    const result = await registerUser("alice", "123456");

    expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(result).toMatchObject({
      username: "alice",
      password: "hashed-password",
    });
  });

  it("rejects a duplicate username", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      username: "alice",
      password: "hashed-password",
    });

    await expect(registerUser("alice", "123456")).rejects.toThrow(
      /username exists cannot register/i
    );
  });
});