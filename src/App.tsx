import React, { Suspense } from 'react';
import { Loader } from 'lucide-react';
import SearchBar from './components/SearchBar';
import LoadingDisplay from './components/LoadingDisplay';
import { useChallenges } from './hooks/useChallenges';

// コンポーネントの遅延ロード
const ErrorDisplay = React.lazy(() => import('./components/ErrorDisplay'));
const ChallengeCard = React.lazy(() => import('./components/ChallengeCard'));
const EmptyState = React.lazy(() => import('./components/EmptyState'));

function App() {
  const {
    challenges,
    loading,
    error,
    handleRetry,
    toggleChallengeCompletion,
    searchTerm,
    setSearchTerm,
    filteredChallenges
  } = useChallenges();

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return (
      <Suspense fallback={<LoadingDisplay />}>
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600">
          フォートナイトクエスト
        </h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Suspense 
            fallback={
              <div className="flex justify-center items-center">
                <Loader className="animate-spin h-6 w-6 text-blue-500" />
              </div>
            }
          >
            {filteredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onToggleCompletion={toggleChallengeCompletion}
              />
            ))}
          </Suspense>
        </div>
        {filteredChallenges.length === 0 && (
          <Suspense fallback={<LoadingDisplay />}>
            <EmptyState />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;