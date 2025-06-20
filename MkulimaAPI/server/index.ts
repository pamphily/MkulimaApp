import { Elysia } from 'elysia';
import { jwt } from "@elysiajs/jwt";
import { ElysiaWS } from "elysia/dist/ws";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";
import { logger } from '@grotto/logysia';

import { AuthenticationError } from "./exceptions/AuthenticationError";
import { AuthorizationError } from "./exceptions/AuthorizationError";
import { InvariantError } from "./exceptions/InvariantError";
import swagger from '@elysiajs/swagger';

import { configureUserRoutes } from './routes/UserRoute';

export const app = new Elysia({
    prefix: process.env.NODE_ENV === 'production' ? '/api' : '',
    serve: {
        hostname: process.env.HOST,
        port: process.env.PORT
    }
}).error('AUTHENTICATION_ERROR', AuthenticationError)
    .error('AUTHORIZATION_ERROR', AuthorizationError)
    .error('INVARIANT_ERROR', InvariantError)
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'AUTHENTICATION_ERROR':
                set.status = 401;
                return {
                    status: "error",
                    message: error.toString()
                };
            case 'AUTHORIZATION_ERROR':
                set.status = 403;
                return {
                    status: "error",
                    message: error.toString()
                };
            case 'INVARIANT_ERROR':
                set.status = 400;
                return {
                    status: "error",
                    message: error.toString()
                };
            case 'NOT_FOUND':
                set.status = 404;
                return {
                    status: "error",
                    message: error.toString()
                };
            case 'INTERNAL_SERVER_ERROR':
                set.status = 500;
                return {
                    status: "error",
                    message: "Something went wrong!"
                };
            
        }
    })
    .use(jwt({
        name: "jwt",
        secret: 'SmztGudLFrG0yf2vGwsL/tz54lVbIIyVALZw6vQHxyHsN7eOZ2fRp2rCpBF8H0rmWcCPOJxg9suW92J6ee7Tgw==',
        exp: '1d'
    }))
    .use(jwt({
        name: "refreshToken",
        secret: "skCrLtDYnAGjbbHaDf9H6FLFJlsZ7YTNifjEp7rnxPaVqjRWORI7ljiXNF8fI8Lf9ChVj/WsYtqYiJGlsHMjvg==",
    }))
    .use(cookie())
    .use(cors())
    .use(logger())
    .ws("/ws", {
        console.log("🟢 WebSocket connection established");
    })
    .use(swagger({
        path: "/swagger"
    })) 

    .get("/", () => "server")
    .group("/user", configureUserRoutes)
   

    app.get("/*", "welcome")

app.listen(5000);

console.log(`🦊 API is running at ${app.server?.hostname}:${app.server?.port}`);
