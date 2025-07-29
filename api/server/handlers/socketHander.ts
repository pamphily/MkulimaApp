import type { ElysiaWS } from "elysia/dist/ws";
import { socketService } from "../services/socketService";
import { verifyToken } from "../utils/jwt";
import { userService } from "../services/UserService";

const activeUsers = new Map<string, ElysiaWS<any>>();

export const socketHandler = {
  async handleMessage(ws: ElysiaWS<any>, data: string) {
    // console.log("🟢 We");

    // console.log(ws.data)

    try {
      let payload: any;

      if (typeof data === "string") {
        payload = JSON.parse(data);
      } else if (typeof data === "object") {
        payload = data;
      } else {
        console.warn("❗ Unknown data format from client:", data);
        return;
      }

      switch (payload.type) {
        case "AUTH":
          const { token } = payload;
          console.log("je tumepata null: ", token);
          if (token && token !== null) {
            const decoded = verifyToken(token);
            const userId = decoded.id as any;
            (ws.data as any).userId = userId;
            if (userId) {
              activeUsers.set(userId, ws);

              // ✅ Update DB
              userService.updateOnlineStatus(userId, true);

              console.log(`User connected via WebSocket`);
            }
          }

          // console.error("❌ Token verification error");

          break;

        case "MESSAGE":
          const { to, content } = payload;
          const from = "a";
          if (!from) return;

          // Save to DB
          await socketService.saveMessage({ from, to, content });

          // Deliver if recipient is online
          const recipientSocket = activeUsers.get(to);
          if (recipientSocket) {
            recipientSocket.send(
              JSON.stringify({
                type: "MESSAGE",
                from,
                content,
              })
            );
          }
          break;

        default:
          console.log("Unknown message type");
      }
    } catch (err) {
      console.error("Socket message error:", err);
    }
  },
  handleClose(ws: ElysiaWS<any>) {
    const userId = (ws.data as any).userId;
    if (userId) {
      console.log("log out: ", userId);
      activeUsers.delete(userId);
      userService.updateOnlineStatus(userId, false, new Date());

      console.log(`User ${userId} disconnected`);
    }
  },
};
