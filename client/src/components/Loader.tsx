const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-400 text-sm">Loading...</p>
    </div>
  );
};

export default Loader;
