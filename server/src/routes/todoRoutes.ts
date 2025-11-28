import express from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from '../controller/todoController';
import { userMiddleware } from '../middleware/userMiddleware';

const todoRouter = express.Router();

// All routes require authentication
todoRouter.use(userMiddleware);

todoRouter.post('/', createTodo);
todoRouter.get('/', getAllTodos);
todoRouter.get('/:id', getTodoById);
todoRouter.put('/:id', updateTodo);
todoRouter.patch('/:id/toggle', toggleTodo);
todoRouter.delete('/:id', deleteTodo);

export default todoRouter;

