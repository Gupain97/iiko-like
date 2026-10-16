import jwt from "jsonwebtoken";


export interface JwtPlayload {
    userId: string;
}

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return secret;
}

export function generateAccessToken(userId: string): string {
    const secret = getSecret();
    
    return jwt.sign(
        { userId },
        secret,
        { expiresIn: '20m'}
    );
    
}

export function verifyAccessToken(token:string): JwtPlayload {
    const secret = getSecret();
    const playload = jwt.verify(token, secret );
    if (typeof playload === "string" || typeof playload.userId != 'string') {
        throw new Error('invalid token playload');
    }

    return {userId: playload.userId};
}

