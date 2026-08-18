import * as Service from '../services/service.js';
import { createTaskSchema } from '../lib/schemas/task.js';

export async function listTasks(req:any,res:any){
    try{
        const tasks=await Service.getTasks();
        res.json(tasks);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}
export async function createTask(req: any, res: any) {
  try {
    // Validate incoming data
    const result = createTaskSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        errors: result.error.flatten().fieldErrors 
      });
    }

    // result.data is now type-safe
    const task = await Service.createTask({
      ...result.data,
      userId: req.userId, // from JWT middleware
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: String(error) });
  }
}
export async function getTask(req:any,res:any){
    try{
        const task=await Service.getTaskbyId(Number(req.params.id));
        res.json(task);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}
export async function updateTask(req:any,res:any){
    try{
        const task=await Service.updateTask(Number(req.params.id),req.body);
        res.json(task);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}
export async function deleteTask(req:any,res:any){
    try{
        const result = await Service.deleteTask(Number(req.params.id));
        res.json(result);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}
export async function getTasksByUser(req:any,res:any){
    try{
        const userId=Number(req.params.userId);
        const tasks=await Service.getTasksByUser(userId);
        res.json(tasks);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}
export async function assignTasktoUser(req:any,res:any){
    try{
        const task=await Service.assignTask(Number(req.params.id),Number(req.body.userId));
        res.json(task);
    }catch(error){
        res.status(500).json({message:String(error)});
    }
}