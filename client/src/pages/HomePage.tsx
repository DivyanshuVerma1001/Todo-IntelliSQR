import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';

const HomePage = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome! 🎉</h1>
            {user && (
              <div className="mb-6">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
              </div>
            )}
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

