import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from '../exceptions/AuthenticationError';

const JWT_SECRET = process.env.JWT_SECRET || '217495cd4ca086e0dda5912e9bb48219964ea69f78e35bf17589d490234ec3980e22ecceadadf11aeefae8ff024bba04a8160ec9aa1bf7dcb895bef71cdba6b2';

export const generateToken = (payload: object, expiresIn: string ): string => {
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload & { id: string } => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded === 'object' && 'id' in decoded) {
            return decoded as JwtPayload & { id: string };
        } else {
            throw new AuthenticationError('Invalid token payload');
        }
    } catch (error) {
        console.error('Token verification error:', error);
        throw new AuthenticationError(`${error.message}`);
    }
};