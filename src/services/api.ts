import axios from 'axios';
import { Challenge, ApiResponse } from '../types';
import { getQuestType } from '../utils';

// テスト用のモックデータ
const MOCK_CHALLENGES = [
  {
    id: '1',
    name: 'ストーリークエスト: オメガの謎を追え',
    description: 'オメガの隠された基地を見つけ出し、古代の謎を解き明かせ',
    xp: 30000,
    questType: 'ストーリークエスト',
    storyContext: '時空の歪みによって現れた古代文明の痕跡。オメガの真の目的とは？',
    chapter: '5',
    season: '1'
  },
  {
    id: '2',
    name: 'ストーリークエスト: 失われた地図の断片',
    description: '島の各地に散らばった地図の断片を5つ集める',
    xp: 25000,
    questType: 'ストーリークエスト',
    storyContext: '古代の地図が示す場所には、何が待ち受けているのか...',
    chapter: '5',
    season: '1'
  },
  {
    id: '3',
    name: '週間クエスト: 敵プレイヤーにダメージを与える',
    description: '敵プレイヤーに合計1000のダメージを与える',
    xp: 15000,
    questType: '週間クエスト'
  }
] as Challenge[];

const api = axios.create({
  baseURL: 'https://fortniteapi.io/v3/challenges?season=current&lang=ja',
  timeout: 10000
});

export const fetchChallenges = async (): Promise<Challenge[]> => {
  // 開発環境ではモックデータを返す
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CHALLENGES), 1000);
    });
  }

  try {
    const response = await api.get<ApiResponse>('/challenges', {
      params: { 
        season: 'current', 
        lang: 'ja' 
      },
      headers: {
        'Authorization': import.meta.env.VITE_FORTNITE_API_KEY:'f9c32db5-5ba10df7-e6e80051-74403299'
      }
    });

    if (!response.data?.challenges) {
      throw new Error('クエストデータが見つかりませんでした');
    }

    return response.data.challenges
      .filter(challenge => challenge.name && challenge.description)
      .map(challenge => ({
        id: challenge.id || Math.random().toString(36).substr(2, 9),
        name: challenge.name,
        description: challenge.description,
        xp: challenge.xp || 0,
        questType: getQuestType(challenge.name),
        storyContext: challenge.storyContext,
        chapter: challenge.chapter,
        season: challenge.season
      }));
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('APIキーが無効または期限切れです。システム管理者に連絡してください。');
    }
    if (error.response?.status === 429) {
      throw new Error('APIリクエスト制限に達しました。しばらく待ってから再試行してください。');
    }
    if (!navigator.onLine) {
      throw new Error('インターネット接続がありません。接続を確認してから再試行してください。');
    }
    throw new Error('クエストの取得に失敗しました。しばらくしてから再試行してください。');
  }
};