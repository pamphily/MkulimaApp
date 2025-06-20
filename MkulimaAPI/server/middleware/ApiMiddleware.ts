import { verifyToken } from "../utils/jwt";

export const apiMiddleware = async ({ headers, set, cookie, jwt }): Promise<any> => {
    const bearer = headers.authorization.split(' ')[1]

    if (!bearer && !cookie.auth?.value) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }

    const profile = verifyToken(bearer || cookie.auth.value);
    if (!profile) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }
}