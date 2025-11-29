import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLogout } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LogOut, Plus, CheckCircle2, Circle, User, UserCircle, ChevronDown, Sparkles, FileText } from 'lucide-react';

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data } = useTodos();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const todos = data?.todos || [];
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-gray-900/95 border-b-2 border-blue-600/30 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-2xl bg-blue-600/10 border border-blue-600/20">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Todo App
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {user?.name}
                </p>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="User menu"
                aria-expanded={showDropdown}
              >
                <UserCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-gray-800 border border-gray-700/50 shadow-xl overflow-hidden z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-red-600/20 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-red-600/20"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20">
                <Circle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-green-600/10 border border-green-600/20">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-500">{completedCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gray-700/50 border border-gray-600/50">
                <Circle className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-2xl font-bold text-white">{activeCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Todo Button */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 flex justify-end"
          >
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 w-full md:w-auto overflow-hidden"
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
              
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <FileText className="w-5 h-5" />
                  </motion.div>
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                <span className="text-base font-medium">Create New Todo</span>
              </div>
            </motion.button>
          </motion.div>
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
