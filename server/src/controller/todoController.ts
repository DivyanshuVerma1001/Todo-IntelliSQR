import { Request, Response } from 'express';
import { Todo, ITodo } from '../model/todo';
import { AuthRequest } from '../middleware/userMiddleware';

interface CreateTodoBody {
  title: string;
  description?: string;
}

interface UpdateTodoBody {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Create a new todo
export const createTodo = async (
  req: AuthRequest<{}, {}, CreateTodoBody>,
  res: Response
): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim(),
      userId: req.result._id,
      completed: false,
    });

    res.status(201).json({
      success: true,
      todo,
      message: 'Todo created successfully',
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to create todo',
    });
  }
};

// Get all todos for the authenticated user
export const getAllTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const todos = await Todo.find({ userId: req.result._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      todos,
      count: todos.length,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to fetch todos',
    });
  }
};

// Get a single todo by ID
export const getTodoById = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.result._id,
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to fetch todo',
    });
  }
};

// Update a todo
export const updateTodo = async (
  req: AuthRequest<{ id: string }, {}, UpdateTodoBody>,
  res: Response
): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, completed } = req.body;

    const updateData: Partial<ITodo> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.result._id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json({
      success: true,
      todo,
      message: 'Todo updated successfully',
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to update todo',
    });
  }
};

// Delete a todo
export const deleteTodo = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.result._id,
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to delete todo',
    });
  }
};

// Toggle todo completion status
export const toggleTodo = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    if (!req.result) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.result._id,
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      todo,
      message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: err.message || 'Failed to toggle todo',
    });
  }
};

