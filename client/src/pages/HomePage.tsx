import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to todos page
    navigate('/todos', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400">Redirecting to todos...</p>
      </div>
    </div>
  );
};

export default HomePage;

