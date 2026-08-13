import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import prisma from "../prisma";
const SECRET_KEY = "12345";

export async function registerUser(username: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("username exists cannot register");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    throw new Error(`Failed: ${String(error)}`);
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("user not found");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("invalid");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      token,
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    throw new Error(`failed : ${String(error)}`);
  }
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("invalid");
  }
}