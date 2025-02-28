import { PrismaClient, Personaje } from "@prisma/client";
const prisma = new PrismaClient();

// Crear personaje
export const createPersonajeSrv = async ({ nombre, foto }: Omit<Personaje, "id" | "flag" | "createdAt" | "updateAt">) => {
    if (!nombre) {
        throw new Error("El nombre es requerido");
    }
    const response = await prisma.personaje.create({
        data: {
            nombre,
            foto
        }
    });
    return response;
};

export const getListaPersonajeSrv = async () => {
    return await prisma.personaje.findMany({
        where: { flag: true }
    });
};

export const getPersonajeSrv = async (id: number) => {
    return await prisma.personaje.findFirst({
        where: { id, flag: true }
    });
};

// Soft delete: cambia flag a false en lugar de eliminar
export const deletePersonajeSrv = async (id: number) => {
    const personaje = await prisma.personaje.findFirst({
        where: { id }
    });

    if (!personaje) {
        return null;
    }

    return await prisma.personaje.update({
        where: { id },
        data: { flag: false }
    });
};

// Actualizar personaje
export const updatePersonajeSrv = async ({ id, nombre, foto }: Personaje) => {
    if (!nombre) {
        throw new Error("El nombre es requerido");
    }

    return await prisma.personaje.update({
        where: { id },
        data: { nombre, foto }
    });
};
