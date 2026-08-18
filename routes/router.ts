import express from 'express';
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  assignTasktoUser,
  getTasksByUser
} from '../controller/controller.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router=express.Router();

// Protect all task routes with JWT verification
router.get('/tasks', verifyAuth, listTasks);
router.post('/tasks', verifyAuth, createTask);
router.get('/tasks/user/:userId', verifyAuth, getTasksByUser);
router.get('/tasks/:id', verifyAuth, getTask);
router.put('/tasks/:id', verifyAuth, updateTask);
router.delete('/tasks/:id', verifyAuth, deleteTask);
router.patch('/tasks/:id/assign', verifyAuth, assignTasktoUser);

export default router;