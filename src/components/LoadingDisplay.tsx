import React from 'react';
import { Loader } from 'lucide-react';

const LoadingDisplay: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Loader className="animate-spin h-10 w-10 text-blue-500 mb-4" />
      <p className="text-gray-600">クエストを読み込み中...</p>
    </div>
  );
};

export default LoadingDisplay;