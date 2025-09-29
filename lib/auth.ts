import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_random_secret_here";

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function extractUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export function getUserIdFromRequest(request: Request): string | null {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    
    const token = authHeader.substring(7);
    return extractUserIdFromToken(token);
  } catch (error) {
    console.error("Error extracting user ID:", error);
    return null;
  }
}