import { NotFoundError } from "elysia";
import { db } from "../../prisma/PrismaClient";
import { createUserPayload, LoginPayload } from "../types/UserTypes";
import { AuthenticationError } from "../exceptions/AuthenticationError";

export const userService = {
  getUser: async () => {
    const users = await db.user.findMany({
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        isVerified: true,
        phone: true,
        isOnline: true,
        lastSeen: true,
        role: true,
      },
    });
    return users;
  },

  createUser: async (payload: createUserPayload) => {
    const user = await db.user.create({
      data: {
        id: payload.id,
        email: payload.email,
        full_name: payload.full_name,
        phone: payload.phone,
        role: payload.role,
        password: payload.password,
        isVerified: false,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });

    // const token = generateToken(user.id);
    // await sendVerificationEmail(user.email, token);

    return user;
  },

  getUserById: async (id: string) => {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },
  verifyEmailIsAvailable: async (email: string) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) throw new Error("Email already in use");
    return true;
  },


  getPasswordByEmail: async (email: string) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user.password;
  },
  getUserByEmail: async (email: string) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  getUserEmailPassword: async (id: string) => {
    const user = await db.user.findFirst({
      where: {
        id: id,
      },
      select: {
        email: true,
        password: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  login: async (payload: LoginPayload) => {
    const user = await db.user.findFirst({
      where: {
        email: payload.email,
        password: payload.password,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        isVerified: true,
        phone: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    console.log(user);
    return user;
  },
  updateUser: async (id: string, payload: createUserPayload) => {
    const user = await db.user.update({
      where: {
        id: id,
      },
      data: {
        email: payload.email,
        full_name: payload.full_name,
        password: payload.password,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },
  
  deleteUser: async (id: string) => {
    const user = await db.user.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  verifyUserEmail: async (userId: string) => {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  },

  resendVerificationEmail: async (email: string) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;

    // const token = generateToken(user.id);
    // await sendVerificationEmail(user.email, token);
  },

  updateOnlineStatus: async (
    userId: string,
    online: boolean,
    lastSeen?: any
  ) => {
    console.log("wewe: ", userId);
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        isOnline: online,
        lastSeen: lastSeen,
      },
    });
  },

  enrollUser: async (id: string) => {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
  }
};
