import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Define a custom JwtPayloadWithUsername extending JwtPayload
interface JwtPayloadWithUsername extends JwtPayload {
  preferredUserId?: string;
  preferredUserName?: string;
}

// Set up the JWKS client
const client = jwksClient({
  jwksUri:
    "https://login.microsoftonline.com/0ef3ca2b-0b6f-4543-b1f3-eb1e7ec2069f/discovery/keys?appid=17f23c8a-5462-44a8-9878-5d6a140b0d84",
});

// Function to get the signing key
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key?.getPublicKey();

      callback(null, signingKey);
    }
  });
}

// Middleware to verify the token and extract preferred_username
export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1]; // Extract the token from the Bearer scheme

  if (!token) {
    console.error("Token not present in authorization header");
    return res.status(401).json({ msg: "Token format is invalid" });
  }

  // Verify the token
  jwt.verify(
    token,
    getKey,
    { algorithms: ["RS256"], complete: true },
    (err, decoded: JwtPayloadWithUsername | undefined) => {
      if (err || !decoded) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ msg: "Token is not valid" });
      }

      // Extract preferred_username from the decoded token
      const preferredUserId: string =
        decoded?.payload?.preferred_username || "";
      const preferredUserName: string = decoded?.payload?.name || "";

      // Attach the extracted preferred_username to the request object
      (req as any).preferredUserId = preferredUserId;
      (req as any).preferredUserName = preferredUserName;
      next();
    }
  );
};
