export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-600">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-base font-medium">Loading...</p>
    </div>
  );
}