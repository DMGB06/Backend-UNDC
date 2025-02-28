import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface RegisterBody {
  nombre: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const validKeys = ["nombre", "email", "password", "role"];
    const bodyKeys = Object.keys(req.body);

    const hasInvalidKey = bodyKeys.some((key) => !validKeys.includes(key));
    if (hasInvalidKey) {
      res.status(400).json({
        error: "Campos extra no permitidos",
      });
    }

    const { nombre, email, password, role } = req.body as RegisterBody;

    const fields = [nombre, email, password];
    const invalid = fields.find((f) => typeof f !== "string" || !f.trim());
    if (invalid !== undefined) {
      res.status(400).json({
        error: "Datos inválidos. Se requiere nombre, email y password",
      });
      return;
    }
    const finalRole = role === "ADMIN" ? "ADMIN" : "REGULAR";

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el usuario
    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });

    res.status(200).json({ message: "Usuario creado con éxito", user });
    return;
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validKeys = ["email", "password"];
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.some((key) => !validKeys.includes(key))) {
      res.status(400).json({ error: "Campos extra no permitidos" });
      return;
    }

    const { email, password } = req.body as LoginBody;

    const fields = [email, password];
    const invalid = fields.find((f) => typeof f !== "string" || !f.trim());
    if (invalid !== undefined) {
      res
        .status(400)
        .json({ error: "Datos inválidos. Se requiere email y password" });
      return;
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.flag) {
      res.status(400).json({ error: "Credenciales inválidas" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" }
    );

    res.json({ message: "Login exitoso", token });

    return;
  } catch (error) {
    console.error("Error en login:", error);

    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};
