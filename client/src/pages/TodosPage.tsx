import { useState } from 'react';
import { useLogout } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LogOut, Plus, CheckCircle2, Circle, User } from 'lucide-react';

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data } = useTodos();

  const todos = data?.todos || [];
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Todo App
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {user?.name}
                </p>
              </div>
            </div>
            <Button variant="danger" onClick={() => logout()} disabled={isLoggingOut} size="sm">
              <LogOut className="w-4 h-4 mr-1.5" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Circle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-400">{completedCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Circle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-2xl font-bold text-purple-400">{activeCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Todo Button */}
        {!showForm && (
          <div className="mb-6">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Todo
            </Button>
          </div>
        )}

        {/* Todo Form */}
        {showForm && <TodoForm onClose={() => setShowForm(false)} />}

        {/* Todo List */}
        <TodoList />
      </div>
    </div>
  );
};

export default TodosPage;
