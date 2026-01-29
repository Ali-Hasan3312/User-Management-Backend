import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";



export const getAllUsers = async (req : Request, res : Response) => {
    try {
        return res.status(200).json({ message: "Users retrieved successfully", users: await db.select().from(users) });
    } catch (error : any) {
        console.error("Login error:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateAdmin = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { name, email, password } = req.body;

    const admiId = Number(id);

    if (isNaN(admiId)) {
      return res.status(400).json({ message: "Invalid admin id" });
    }

    const updateData: any = {};
    console.log("req.body", req.body)
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
   

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, admiId)); 

    return res.status(200).json({ message: "Admin updated successfully" });
  } catch (error: any) {
    console.error("Update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (role !== "ADMIN" && role !== "USER") {
      return res.status(400).json({ message: "Role must be ADMIN or USER" });
    }

    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId)); 

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error: any) {
    console.error("Update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    console.log("userId", userId)

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const [user] = await db
      .select({ isBlocked: users.isBlocked })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBlocked = !user.isBlocked;

    await db
      .update(users)
      .set({ isBlocked })
      .where(eq(users.id, userId)); 

    return res.status(200).json({ success: true, message: isBlocked ? "User blocked successfully" : "User unblocked successfully" });
  } catch (error: any) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};  