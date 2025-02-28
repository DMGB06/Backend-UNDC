import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Si quieres ocultar los borrados, filtra con { where: { flag: true } }
    const users = await prisma.usuario.findMany({ where: { flag: true } });
    res.json(users);
    return;
  } catch (error) {
    console.error("Error getAllUsers:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });
    if (!user || !user.flag) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return; 
    }
    res.json(user);
    return; 
  } catch (error) {
    console.error("Error getUserById:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const validKeys = ["nombre", "email"];
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.some((key) => !validKeys.includes(key))) {
      res.status(400).json({ error: "Campos extra no permitidos, la contraseña no se puede cambiar (por ahora)" });
      return;
    }

    const { id } = req.params;
    const { nombre, email, role } = req.body as {
      nombre?: string;
      email?: string;
      role?: string;
    };

    const dataToUpdate: any = {};
    if (typeof nombre === "string" && nombre.trim())
      dataToUpdate.nombre = nombre;
    if (typeof email === "string" && email.trim()) dataToUpdate.email = email;
    if (role === "ADMIN" || role === "REGULAR") dataToUpdate.role = role;

    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json({ message: "Usuario actualizado", user });
    return;
  } catch (error) {
    console.error("Error updateUser:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft-delete: ponemos flag=false
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { flag: false },
    });

    res.json({ message: "Usuario marcado con flag=false (soft delete)", user });
    return;
  } catch (error) {
    console.error("Error softDeleteUser:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};
