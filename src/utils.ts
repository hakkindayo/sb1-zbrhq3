export const getQuestType = (name: string): string => {
  if (name.includes('ストーリー')) return 'ストーリークエスト';
  if (name.includes('週間')) return '週間クエスト';
  if (name.includes('デイリー')) return 'デイリークエスト';
  if (name.includes('マイルストーン')) return 'マイルストーンクエスト';
  return 'その他のクエスト';
};

export const formatXP = (xp: number): string => {
  return new Intl.NumberFormat('ja-JP').format(xp);
};

export const getChapterColor = (chapter?: string): string => {
  const colors: Record<string, string> = {
    '5': 'bg-purple-100 text-purple-800',
    '4': 'bg-indigo-100 text-indigo-800',
    '3': 'bg-blue-100 text-blue-800',
    '2': 'bg-green-100 text-green-800',
    '1': 'bg-yellow-100 text-yellow-800',
  };
  return colors[chapter || ''] || 'bg-gray-100 text-gray-800';
};