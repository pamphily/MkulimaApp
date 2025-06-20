import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = new PrismaClient({
    log: [ 'info', 'warn', 'error']
}).$extends(withAccelerate());

