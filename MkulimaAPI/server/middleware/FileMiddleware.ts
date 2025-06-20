import { InvariantError } from "../exceptions/InvariantError"

export const fileMiddleware = async ({ body: { image } }) => {
    if (image.size < 5000) throw new InvariantError("File too small!")
    if (image.size > 500000) throw new InvariantError("File too large!")
}