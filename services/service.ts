import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL='http://localhost:3001'
const DB_FILE=path.resolve(process.cwd(),'db.json');
export async function getTasks(){
    try{
        const res=await fetch(`${BASE_URL}/tasks`);
        if (!res.ok) throw new Error(`Failed to fetch tasks`);
        return await res.json();
    } catch (error) {
        throw new Error(`Failed to fetch tasks: ${error}`);
    }
}
export async function createTask(task:any){
    try{
        const dbText=await readFile(DB_FILE,'utf-8');
        const database=JSON.parse(dbText);
        const tasks=Array.isArray(database.tasks)?database.tasks:[];
        const nextId=tasks.reduce((max:number,current:any)=>{
            const currentId=Number(current?.id);
            return Number.isFinite(currentId) && currentId>max ? currentId : max;
        },0)+1;
        const taskWithId={...task,id:nextId};
        await writeFile(DB_FILE,JSON.stringify({
            ...database,
            tasks:[...tasks,taskWithId]
        },null,2));
        return taskWithId;
    } catch (error) {
        throw new Error(`Failed to create task: ${String(error)}`);
    }
}
export async function getTaskbyId(id:number){
    try{
        const res=await fetch(`${BASE_URL}/tasks/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch task with id ${id}`);
        return await res.json();
    }catch(error){
        throw new Error(`Failed to fetch task with id ${id}:${String(error)}`);
    }

}
export async function updateTask(id:number,task:any){
    try{
        const res=await fetch(`${BASE_URL}/tasks/${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(task)
        });
        if (!res.ok) throw new Error(`Failed to update task`);
        return await res.json();
    }catch(error){
        throw new Error(`Failed to update task with id ${id}:${String(error)}`);
    }
}
export async function deleteTask(id:number){
    try{
        const res=await fetch(`${BASE_URL}/tasks/${id}`,{
            method:'DELETE'
        });
        if(!res.ok) throw new Error('Failed to delete task');
        return await res.json();
    }catch(error){
        throw new Error(`couldnt delete`);
    }
}
export async function getUsers(){
    try{
        const res=await fetch(`${BASE_URL}/users`);
        if(!res.ok) throw new Error('Failed to fetch users');
        return await res.json();
    }catch(error){
        throw new Error(`Failed to fetch users: ${String(error)}`);
    }
}
export async function getTasksByUser(userId:number){
    try{
        const res=await fetch(`${BASE_URL}/tasks?userId=${userId}`);
        if (!res.ok) throw new Error(`Failed to fetch tasks`);
        return await res.json();
    }catch(error){
        throw new Error(`Failed to fetch tasks for user: ${String(error)}`);
    }
}
export async function assignTask(id:number,userid:number){
    try{
        const users=await getUsers();
        const userExists=users.some((user:any)=>Number(user?.id)===userid);
        if(!userExists) throw new Error(`User with id ${userid} does not exist`);
        const res=await fetch(`${BASE_URL}/tasks/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({userId:userid})
        });
        if(!res.ok) throw new Error(`Failed to assign task`);
        return await res.json();
    }catch(error){
        throw new Error(`Failed to assign task`);
    }
}