import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
      name: string;
    }

    interface Request {
      user?: UserPayload | null;
      admin?: JwtPayload;
    }
  }
}

export {};
