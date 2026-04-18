import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  image?: any | null;
}

interface AppState {
  topicId: string | null;
  history: Message[];
  setTopicId: (id: string) => void;
  addMessage: (message: Message) => void;
  clearState: () => void;
}

export const useStore = create<AppState>((set) => ({
  topicId: null,
  history: [],
  setTopicId: (id) => set({ topicId: id }),
  addMessage: (message) => set((state) => ({ history: [...state.history, message] })),
  clearState: () => set({ topicId: null, history: [] }),
}));
