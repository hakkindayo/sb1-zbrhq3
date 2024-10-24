import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center mt-8 p-6 bg-white rounded-lg shadow">
      <p className="text-gray-500 text-lg">該当するクエストが見つかりません。</p>
      <p className="text-gray-400 mt-2">検索条件を変更してお試しください。</p>
    </div>
  );
};

export default EmptyState;