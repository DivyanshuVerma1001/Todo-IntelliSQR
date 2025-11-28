import { useState } from 'react';
import { Check, Trash2, Edit2, Save, X, Clock } from 'lucide-react';
import { Todo } from '../types/todo';
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from '../hooks/useTodos';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTodoSchema } from '../lib/todoSchemas';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Modal from './ui/Modal';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const { mutate: toggleTodo, isPending: isToggling } = useToggleTodo();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
    },
  });

  const handleToggle = () => {
    toggleTodo(todo._id);
  };

  const handleDelete = () => {
    deleteTodo(todo._id);
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = (data: { title: string; description?: string }) => {
    updateTodo(
      {
        id: todo._id,
        data: {
          title: data.title,
          description: data.description || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card
        variant="glass"
        className={`p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          todo.completed ? 'opacity-75' : ''
        }`}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('title')}
              error={errors.title?.message as string}
              disabled={isUpdating}
              autoFocus
            />
            <Textarea
              {...register('description')}
              rows={3}
              error={errors.description?.message as string}
              disabled={isUpdating}
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={isUpdating} size="sm">
                <Save className="w-4 h-4 mr-1.5" />
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} size="sm">
                <X className="w-4 h-4 mr-1.5" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-4">
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`mt-1 flex-shrink-0 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                todo.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 shadow-lg shadow-green-500/30 scale-110'
                  : 'border-gray-600 hover:border-green-500 hover:scale-110'
              } disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed && (
                <Check className="w-4 h-4 text-white animate-scaleIn" strokeWidth={3} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-semibold text-white mb-1 transition-all duration-200 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm text-gray-400 mb-3 transition-all duration-200 ${
                    todo.completed ? 'line-through' : ''
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(todo.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                title="Edit todo"
                aria-label="Edit todo"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                title="Delete todo"
                aria-label="Delete todo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Todo"
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      >
        <p className="text-gray-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{todo.title}"</span>? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default TodoItem;
