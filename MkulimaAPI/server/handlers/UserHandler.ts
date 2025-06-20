import Elysia, { t } from "elysia";
import { v4 as uuidv4 } from "uuid";
import { userService } from "../services/UserService";
import { generateToken } from "../utils/jwt";

export const usersHandler = {
  getUser: async (): Promise<{ status: string; data: { users: any[] } }> => {
    const users = await userService.getUser();

    return {
      status: "success",
      data: {
        users,
      },
    };
  },

  getUserById: async ({ set, params }: { set: any; params: { id: string } }): Promise<{ status: string; data: { user: any } }> => {

      console.log("what is it aboutnjdskjsdfsdjfksdj knoww")

      const user = await userService.getUserById(params.id);

      set.status = 200

      return {
          status: 'success',
          data: {
              user,
          }
      };
  },

  createUser: async ({
    body,
    set,
  }: {
    body: any;
    set: any;
  }): Promise<{ status: string; message: string }> => {
    await userService.verifyEmailIsAvailable(body.email);

    const id = uuidv4();
    const passwordHash = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 4,
    });


    await userService.createUser({
      id: `users-${id}`,
      email: body.email,
      full_name: body.full_name,
      phone: body.phone,
      role: "ADMIN",
      password: passwordHash,
    });
    
    set.status = 201;
    return {
      status: "success",
      message: `Ok`,
    };
  },

  deleteUser: async ({
    set,
    params,
  }): Promise<{ status: string; message: string }> => {
    await userService.deleteUser(params.id);
    set.status = 204;

    return {
      status: "success",
      message: `Ok`,
    };
  },

  loginUser: async ({ body, set, jwt }): Promise<any> => {
    const hashedPassword = await userService.getPasswordByEmail(body.email);
    const isMatch = await Bun.password.verify(body.password, hashedPassword);

    if (!isMatch) {
      set.status = 401; // Unauthorized
      return {
        status: "error",
        message: "Invalid email or password",
      };
    }

    // const data = await getSignature(body.email, body.password);

    const login = await userService.login({
      email: body.email,
      password: hashedPassword,
    });

    // Update meters if the list has changed

    // await userService.updateMeterInArray(login.id, data.meters);

    const token = generateToken(
      { id: login.id, phone: login.phone },
      "1h"
    );

    set.headers["Authorization"] = `Bearer ${token}`;

    set.headers["Set-Cookie"] = `auth=${token}; httpOnly; Max-Age=${
      60 * 60 * 24 * 7
    }; sameSite`;

    set.status = 200; // Ok

    return {
      status: "success",
      message: "Login successful",
      token: token,
      login: login,
    };
  },

  validateCreateUser: t.Object({
    email: t.String(),
    password: t.String(),
    full_name: t.String(),
  }),
};
