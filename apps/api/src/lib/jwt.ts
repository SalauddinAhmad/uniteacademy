import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!SECRET) {
  throw new Error("JWT_SECRET is not set in environment");
}

export type JwtPayload = {
  sub: string;   // user id
  role: "student" | "teacher" | "admin";
  email: string;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET as string, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET as string) as JwtPayload;
}
