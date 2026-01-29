import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginBody {
  email: string;
  password: string;
}
interface RegisterBody {
  name: string;
  email: string;
  password: string;
}


export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<Response> => {
  try {

    if (!req.body) {
      return res.status(400).json({
        message: "Request body is required",
      });
    }
    
    const { name, email, password } = req.body!;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

      await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER',
        is_blocked INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      isBlocked: false,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error : any) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const loginUser = async (
    req: Request<{}, {}, LoginBody>,
    res: Response
): Promise<Response> => {
    try {
      const JWT_SECRET = process.env.JWT_SECRET!;

      if(!req.body) {
        return res.status(400).json({ message: "Body is required" });
      }
    const { email, password } = req.body;

    console.log("body", req.body)

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [user] = await db
      .select({ id: users.id, password: users.password, name: users.name, role: users.role, isBlocked: users.isBlocked })
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } 
    );

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, role: user.role, token, },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req : Request, res : Response) => {
    try {
        const user = await db.select({ id: users.id, email: users.email, password: users.password, name: users.name, role: users.role, isBlocked: users.isBlocked, createdAt: users.createdAt }).from(users).where(eq(users.id, req.user.id));

        return res.status(200).json({ message: "User retrieved successfully", user : user[0] });

    } catch (error : any) {
        console.error("Login error:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req: Request, res: Response) => {
 try {
     const { id } = req.user;
     const { name, email, password } = req.body;
 
     const userId = Number(id);
     if (isNaN(userId)) {
       return res.status(400).json({ message: "Invalid user id" });
     }
 
     const updateData: any = {};
 
     if (name) updateData.name = name;
     if (email) updateData.email = email;
     if (password) updateData.password = await bcrypt.hash(password, 10);
 
     if (Object.keys(updateData).length === 0) {
       return res.status(400).json({ message: "No fields to update" });
     }
 
     await db
       .update(users)
       .set(updateData)
       .where(eq(users.id, userId)); 
 
     return res.status(200).json({ message: "User updated successfully" });
   } catch (error: any) {
     console.error("Update error:", error);
     return res.status(500).json({ message: error.message });
   } 
}

