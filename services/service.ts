import prisma from "../prisma";

export async function getTasks() {
  try {
    return await prisma.task.findMany({
      include: { user: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${String(error)}`);
  }
}

export async function createTask(task: {
  title: string;
  description?: string;
  userId?: number;
}) {
  try {
    return await prisma.task.create({
      data: {
        title: task.title,
        description: task.description ?? null,
        userId: task.userId ?? null,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create task: ${String(error)}`);
  }
}

export async function getTaskbyId(id: number) {
  try {
    return await prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch task with id ${id}: ${String(error)}`);
  }
}

export async function updateTask(
  id: number,
  task: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) {
  try {
    return await prisma.task.update({
      where: { id },
      data: task,
    });
  } catch (error) {
    throw new Error(`Failed to update task with id ${id}: ${String(error)}`);
  }
}

export async function deleteTask(id: number) {
  try {
    await prisma.task.delete({
      where: { id },
    });
    return { message: "Task deleted successfully" };
  } catch (error) {
    throw new Error(`couldnt delete: ${String(error)}`);
  }
}

export async function getUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error(`Failed to fetch users: ${String(error)}`);
  }
}

export async function getTasksByUser(userId: number) {
  try {
    return await prisma.task.findMany({
      where: { userId },
      include: { user: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch tasks for user: ${String(error)}`);
  }
}

export async function assignTask(id: number, userid: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
    });

    if (!user) {
      throw new Error(`User with id ${userid} does not exist`);
    }

    return await prisma.task.update({
      where: { id },
      data: { userId: userid },
    });
  } catch (error) {
    throw new Error(`Failed to assign task: ${String(error)}`);
  }
}