import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { createTodoSchema, CreateTodoFormData } from '../lib/todoSchemas';
import { useCreateTodo } from '../hooks/useTodos';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

interface TodoFormProps {
  onClose?: () => void;
}

const TodoForm = ({ onClose }: TodoFormProps) => {
  const { mutate: createTodo, isPending } = useCreateTodo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: CreateTodoFormData) => {
    createTodo(data, {
      onSuccess: () => {
        reset();
        if (onClose) onClose();
      },
    });
  };

  return (
    <Card variant="glass" className="p-6 mb-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Create New Todo</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Title"
          placeholder="Enter todo title..."
          error={errors.title?.message}
          disabled={isPending}
        />
        <Textarea
          {...register('description')}
          label="Description (Optional)"
          placeholder="Add a description..."
          rows={3}
          error={errors.description?.message}
          disabled={isPending}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            {isPending ? 'Creating...' : 'Create Todo'}
          </Button>
          {onClose && (
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default TodoForm;
