import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient } from '../lib/apiClient';
import { TodoResponse, TodosResponse } from '../types/todo';
import { CreateTodoFormData, UpdateTodoFormData } from '../lib/todoSchemas';

// Get all todos
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await apiClient.get<TodosResponse>('/todos');
      return response.data;
    },
  });
};

// Create todo mutation
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTodoFormData) => {
      const response = await apiClient.post<TodoResponse>('/todos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to create todo';
      toast.error(errorMessage);
    },
  });
};

// Update todo mutation
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTodoFormData }) => {
      const response = await apiClient.put<TodoResponse>(`/todos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to update todo';
      toast.error(errorMessage);
    },
  });
};

// Delete todo mutation
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to delete todo';
      toast.error(errorMessage);
    },
  });
};

// Toggle todo completion mutation
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<TodoResponse>(`/todos/${id}/toggle`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(data.message || 'Todo status updated!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to toggle todo';
      toast.error(errorMessage);
    },
  });
};

