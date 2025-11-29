import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles } from 'lucide-react';
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
    <Card variant="glass" className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Create New Todo</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-2xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
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
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={!isPending ? { scale: 1.02 } : {}}
            whileTap={!isPending ? { scale: 0.98 } : {}}
            className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              initial={false}
            />
            
            <div className="relative z-10 flex items-center gap-2">
              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                  <span>Create Todo</span>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </div>
          </motion.button>
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
