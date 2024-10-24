import React, { memo } from 'react';
import { Award, CheckCircle, Circle, Scroll } from 'lucide-react';
import { ChallengeWithProgress } from '../types';
import { formatXP, getChapterColor } from '../utils';

interface ChallengeCardProps {
  challenge: ChallengeWithProgress;
  onToggleCompletion: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = memo(({ challenge, onToggleCompletion }) => {
  const formattedDate = challenge.completedAt 
    ? new Date(challenge.completedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const isStoryQuest = challenge.questType === 'ストーリークエスト';

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ${
        challenge.completed ? 'bg-green-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className={`text-lg font-semibold ${
          challenge.completed ? 'text-green-600' : 'text-blue-600'
        } flex-1`}>
          {challenge.name}
        </h2>
        <span className="inline-flex items-center bg-green-100 px-2 py-0.5 rounded-full text-sm font-medium text-green-800">
          <Award className="w-4 h-4 mr-1" />
          {formatXP(challenge.xp)} XP
        </span>
      </div>
      <p className="text-gray-600 mb-3">
        {challenge.description}
      </p>
      {isStoryQuest && challenge.storyContext && (
        <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-start">
            <Scroll className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-800 text-sm italic">
              {challenge.storyContext}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {challenge.questType}
          </span>
          {challenge.chapter && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getChapterColor(challenge.chapter)}`}>
              チャプター {challenge.chapter}
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleCompletion(challenge.id)}
          className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium transition-colors duration-300 ${
            challenge.completed
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {challenge.completed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>完了</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span>未完了</span>
            </>
          )}
        </button>
      </div>
      {challenge.completed && formattedDate && (
        <div className="mt-2 text-xs text-gray-500">
          完了日時: {formattedDate}
        </div>
      )}
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;