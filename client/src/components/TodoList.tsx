import { useTodos } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import Loader from './Loader';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import Card from './ui/Card';

const TodoList = () => {
  const { data, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-400">Loading your todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="glass" className="p-8 text-center">
        <div className="text-red-400 mb-2">
          <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        </div>
        <p className="text-lg font-semibold text-white mb-1">Failed to load todos</p>
        <p className="text-gray-400">Please try again later</p>
      </Card>
    );
  }

  const todos = data?.todos || [];
  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  if (todos.length === 0) {
    return (
      <Card variant="glass" className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-6">
          <Sparkles className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No todos yet</h3>
        <p className="text-gray-400 text-lg">Create your first todo to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {incompleteTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-2xl bg-blue-600/10 border border-blue-600/20">
              <Circle className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Active Tasks <span className="text-gray-400 font-normal">({incompleteTodos.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {incompleteTodos.map((todo) => (
              <div key={todo._id} className="group">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-2xl bg-green-600/10 border border-green-600/20">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Completed <span className="text-gray-400 font-normal">({completedTodos.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div key={todo._id} className="group">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
