import express from 'express';
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  assignTasktoUser,
  getTasksByUser
} from '../controller/controller.ts';
const router=express.Router();
router.get('/tasks',listTasks);
router.post('/tasks',createTask);
router.get('/tasks/user/:userId',getTasksByUser);
router.get('/tasks/:id',getTask);
router.put('/tasks/:id',updateTask);
router.delete('/tasks/:id',deleteTask);
router.patch('/tasks/:id/assign',assignTasktoUser);
export default router;