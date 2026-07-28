import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user.model";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  organizationId: string | null;
}

export const generateAccessToken = (user: IUser): string => {
  const payload: TokenPayload = {
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  organizationId: user.organizationId
    ? user.organizationId.toString()
    : null,
};

  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn:"15m",
    }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const payload: TokenPayload = {
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  organizationId: user.organizationId
    ? user.organizationId.toString()
    : null,
};

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload | TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as JwtPayload | TokenPayload;
};

export const verifyRefreshToken = (
  token: string
): JwtPayload | TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as JwtPayload | TokenPayload;
};