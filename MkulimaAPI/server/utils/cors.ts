import { InvariantError } from "../exceptions/InvariantError";

const whiteList = [
    "localhost:3000",
    "https://p02--api--knwysv7mfc4y.code.run",
    "https://p01--api--knwysv7mfc4y.code.run"
]

export const corsOptions = {
    origin: (origin: string) => {
        if (whiteList.includes(origin) || !origin) {
          return true
        }
        return false
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }