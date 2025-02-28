import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPersonaje = async (req: Request, res: Response) => {
  try {
    const validKeys = ["nombre", "foto"];
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.some((key) => !validKeys.includes(key))) {
      res.status(400).json({ error: "Campos extra no permitidos" });
      return;
    }
    const { nombre, foto } = req.body as { nombre: string; foto: string };
    const user = (req as any).user;

    const fields = [nombre, foto];
    const invalid = fields.find((f) => typeof f !== "string" || !f.trim());
    if (invalid !== undefined) {
      res.status(400).json({ error: "Datos inválidos para personaje" });
      return;
    }

    const personaje = await prisma.personaje.create({
      data: {
        nombre,
        foto,
        usuarioId: user.id,
      },
    });

    res.status(201).json({ message: "Personaje creado", personaje });
    return;
  } catch (error) {
    console.error("Error createPersonaje:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const getMyPersonajes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const personajes = await prisma.personaje.findMany({
      where: {
        usuarioId: user.id,
        flag: true,
      },
    });
    res.json(personajes);
    return;
  } catch (error) {
    console.error("Error getMyPersonajes:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const updatePersonaje = async (req: Request, res: Response) => {
  try {
    const validKeys = ["nombre", "foto"];
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.some((key) => !validKeys.includes(key))) {
      res.status(400).json({ error: "Campos extra no permitidos" });
      return;
    }
    const { id } = req.params;
    const { nombre, foto } = req.body as { nombre?: string; foto?: string };
    const user = (req as any).user;

    const personaje = await prisma.personaje.findUnique({
      where: { id: Number(id) },
    });
    if (!personaje || personaje.usuarioId !== user.id) {
      res
        .status(403)
        .json({ error: "No tienes permiso para editar este personaje" });
      return;
    }

    const dataToUpdate: any = {};
    if (typeof nombre === "string" && nombre.trim())
      dataToUpdate.nombre = nombre;
    if (typeof foto === "string" && foto.trim()) dataToUpdate.foto = foto;

    const updated = await prisma.personaje.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json({ message: "Personaje actualizado", updated });
    return;
  } catch (error) {
    console.error("Error updatePersonaje:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};

export const deletePersonaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const personaje = await prisma.personaje.findUnique({
      where: { id: Number(id) },
    });
    if (!personaje || personaje.usuarioId !== user.id) {
      res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este personaje" });
      return;
    }

    const deleted = await prisma.personaje.update({
      where: { id: Number(id) },
      data: { flag: false },
    });

    res.json({ message: "Personaje marcado con flag=false", deleted });
    return;
  } catch (error) {
    console.error("Error deletePersonaje:", error);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};
