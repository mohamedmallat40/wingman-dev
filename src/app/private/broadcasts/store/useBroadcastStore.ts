import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type BroadcastPost } from '../types';

// ===== TYPES =====
interface FilterState {
  category: string | null;
  topicId: string | null;
  searchQuery: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  } | null;
  postTypes: string[];
  authors: string[];
  tags: string[];
}

interface UIState {
  sidebarOpen: boolean;
  contentCreatorOpen: boolean;
  notificationCenterOpen: boolean;
  selectedPost: string | null;
  viewMode: 'feed' | 'grid' | 'compact';
  theme: 'light' | 'dark' | 'auto';
}

interface DraftState {
  currentDraft: Partial<BroadcastPost> | null;
  savedDrafts: Array<Partial<BroadcastPost>>;
  autoSaveEnabled: boolean;
}

interface AnalyticsState {
  userMetrics: {
    totalPosts: number;
    totalLikes: number;
    totalShares: number;
    totalViews: number;
    engagement: number;
    followers: number;
  };
  postMetrics: Record<
    string,
    {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      engagement: number;
    }
  >;
}

interface RealtimeState {
  isConnected: boolean;
  activeUsers: number;
  notifications: Array<{
    id: string;
    type: 'like' | 'comment' | 'share' | 'follow' | 'mention';
    message: string;
    timestamp: Date;
    read: boolean;
    postId?: string;
    userId?: string;
  }>;
}

interface BroadcastStore {
  // Filter State
  filters: FilterState;
  setCategory: (category: string | null) => void;
  setTopic: (topicId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: FilterState['dateRange']) => void;
  setPostTypes: (types: string[]) => void;
  addAuthorFilter: (authorId: string) => void;
  removeAuthorFilter: (authorId: string) => void;
  addTagFilter: (tag: string) => void;
  removeTagFilter: (tag: string) => void;
  clearFilters: () => void;

  // UI State
  ui: UIState;
  toggleSidebar: () => void;
  openContentCreator: () => void;
  closeContentCreator: () => void;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  setSelectedPost: (postId: string | null) => void;
  setViewMode: (mode: UIState['viewMode']) => void;
  setTheme: (theme: UIState['theme']) => void;

  // Draft State
  drafts: DraftState;
  setCurrentDraft: (draft: Partial<BroadcastPost> | null) => void;
  saveDraft: (draft: Partial<BroadcastPost>) => void;
  deleteDraft: (draftId: string) => void;
  toggleAutoSave: () => void;

  // Analytics State
  analytics: AnalyticsState;
  updateUserMetrics: (metrics: Partial<AnalyticsState['userMetrics']>) => void;
  updatePostMetrics: (postId: string, metrics: AnalyticsState['postMetrics'][string]) => void;

  // Realtime State
  realtime: RealtimeState;
  setConnectionStatus: (connected: boolean) => void;
  setActiveUsers: (count: number) => void;
  addNotification: (
    notification: Omit<RealtimeState['notifications'][0], 'id' | 'timestamp'>
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;

  // Preferences
  preferences: {
    autoplayVideos: boolean;
    showNSFWContent: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    defaultPrivacy: 'public' | 'private' | 'followers';
  };
  updatePreferences: (prefs: Partial<BroadcastStore['preferences']>) => void;
}

// ===== INITIAL STATES =====
const initialFilterState: FilterState = {
  category: null,
  topicId: null,
  searchQuery: '',
  dateRange: null,
  postTypes: [],
  authors: [],
  tags: []
};

const initialUIState: UIState = {
  sidebarOpen: true,
  contentCreatorOpen: false,
  notificationCenterOpen: false,
  selectedPost: null,
  viewMode: 'feed',
  theme: 'auto'
};

const initialDraftState: DraftState = {
  currentDraft: null,
  savedDrafts: [],
  autoSaveEnabled: true
};

const initialAnalyticsState: AnalyticsState = {
  userMetrics: {
    totalPosts: 0,
    totalLikes: 0,
    totalShares: 0,
    totalViews: 0,
    engagement: 0,
    followers: 0
  },
  postMetrics: {}
};

const initialRealtimeState: RealtimeState = {
  isConnected: false,
  activeUsers: 0,
  notifications: []
};

// ===== STORE =====
export const useBroadcastStore = create<BroadcastStore>()(
  devtools(
    (set, get) => ({
      // Filter State & Actions
      filters: initialFilterState,

      setCategory: (category) =>
        set(
          (state) => ({
            filters: { ...state.filters, category }
          }),
          false,
          'setCategory'
        ),

      setTopic: (topicId) =>
        set(
          (state) => ({
            filters: { ...state.filters, topicId }
          }),
          false,
          'setTopic'
        ),

      setSearchQuery: (searchQuery) =>
        set(
          (state) => ({
            filters: { ...state.filters, searchQuery }
          }),
          false,
          'setSearchQuery'
        ),

      setDateRange: (dateRange) =>
        set(
          (state) => ({
            filters: { ...state.filters, dateRange }
          }),
          false,
          'setDateRange'
        ),

      setPostTypes: (postTypes) =>
        set(
          (state) => ({
            filters: { ...state.filters, postTypes }
          }),
          false,
          'setPostTypes'
        ),

      addAuthorFilter: (authorId) =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              authors: [...state.filters.authors.filter((id) => id !== authorId), authorId]
            }
          }),
          false,
          'addAuthorFilter'
        ),

      removeAuthorFilter: (authorId) =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              authors: state.filters.authors.filter((id) => id !== authorId)
            }
          }),
          false,
          'removeAuthorFilter'
        ),

      addTagFilter: (tag) =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              tags: [...state.filters.tags.filter((t) => t !== tag), tag]
            }
          }),
          false,
          'addTagFilter'
        ),

      removeTagFilter: (tag) =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              tags: state.filters.tags.filter((t) => t !== tag)
            }
          }),
          false,
          'removeTagFilter'
        ),

      clearFilters: () =>
        set(
          () => ({
            filters: initialFilterState
          }),
          false,
          'clearFilters'
        ),

      // UI State & Actions
      ui: initialUIState,

      toggleSidebar: () =>
        set(
          (state) => ({
            ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
          }),
          false,
          'toggleSidebar'
        ),

      openContentCreator: () =>
        set(
          (state) => ({
            ui: { ...state.ui, contentCreatorOpen: true }
          }),
          false,
          'openContentCreator'
        ),

      closeContentCreator: () =>
        set(
          (state) => ({
            ui: { ...state.ui, contentCreatorOpen: false }
          }),
          false,
          'closeContentCreator'
        ),

      openNotificationCenter: () =>
        set(
          (state) => ({
            ui: { ...state.ui, notificationCenterOpen: true }
          }),
          false,
          'openNotificationCenter'
        ),

      closeNotificationCenter: () =>
        set(
          (state) => ({
            ui: { ...state.ui, notificationCenterOpen: false }
          }),
          false,
          'closeNotificationCenter'
        ),

      setSelectedPost: (selectedPost) =>
        set(
          (state) => ({
            ui: { ...state.ui, selectedPost }
          }),
          false,
          'setSelectedPost'
        ),

      setViewMode: (viewMode) =>
        set(
          (state) => ({
            ui: { ...state.ui, viewMode }
          }),
          false,
          'setViewMode'
        ),

      setTheme: (theme) =>
        set(
          (state) => ({
            ui: { ...state.ui, theme }
          }),
          false,
          'setTheme'
        ),

      // Draft State & Actions
      drafts: initialDraftState,

      setCurrentDraft: (currentDraft) =>
        set(
          (state) => ({
            drafts: { ...state.drafts, currentDraft }
          }),
          false,
          'setCurrentDraft'
        ),

      saveDraft: (draft) =>
        set(
          (state) => {
            const existingIndex = state.drafts.savedDrafts.findIndex((d) => d.id === draft.id);
            const savedDrafts =
              existingIndex >= 0
                ? state.drafts.savedDrafts.map((d, i) => (i === existingIndex ? draft : d))
                : [...state.drafts.savedDrafts, { ...draft, id: Date.now().toString() }];

            return {
              drafts: { ...state.drafts, savedDrafts }
            };
          },
          false,
          'saveDraft'
        ),

      deleteDraft: (draftId) =>
        set(
          (state) => ({
            drafts: {
              ...state.drafts,
              savedDrafts: state.drafts.savedDrafts.filter((d) => d.id !== draftId)
            }
          }),
          false,
          'deleteDraft'
        ),

      toggleAutoSave: () =>
        set(
          (state) => ({
            drafts: { ...state.drafts, autoSaveEnabled: !state.drafts.autoSaveEnabled }
          }),
          false,
          'toggleAutoSave'
        ),

      // Analytics State & Actions
      analytics: initialAnalyticsState,

      updateUserMetrics: (metrics) =>
        set(
          (state) => ({
            analytics: {
              ...state.analytics,
              userMetrics: { ...state.analytics.userMetrics, ...metrics }
            }
          }),
          false,
          'updateUserMetrics'
        ),

      updatePostMetrics: (postId, metrics) =>
        set(
          (state) => ({
            analytics: {
              ...state.analytics,
              postMetrics: { ...state.analytics.postMetrics, [postId]: metrics }
            }
          }),
          false,
          'updatePostMetrics'
        ),

      // Realtime State & Actions
      realtime: initialRealtimeState,

      setConnectionStatus: (isConnected) =>
        set(
          (state) => ({
            realtime: { ...state.realtime, isConnected }
          }),
          false,
          'setConnectionStatus'
        ),

      setActiveUsers: (activeUsers) =>
        set(
          (state) => ({
            realtime: { ...state.realtime, activeUsers }
          }),
          false,
          'setActiveUsers'
        ),

      addNotification: (notification) =>
        set(
          (state) => ({
            realtime: {
              ...state.realtime,
              notifications: [
                {
                  ...notification,
                  id: Date.now().toString(),
                  timestamp: new Date(),
                  read: false
                },
                ...state.realtime.notifications
              ]
            }
          }),
          false,
          'addNotification'
        ),

      markNotificationRead: (notificationId) =>
        set(
          (state) => ({
            realtime: {
              ...state.realtime,
              notifications: state.realtime.notifications.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
              )
            }
          }),
          false,
          'markNotificationRead'
        ),

      clearNotifications: () =>
        set(
          (state) => ({
            realtime: { ...state.realtime, notifications: [] }
          }),
          false,
          'clearNotifications'
        ),

      // Preferences
      preferences: {
        autoplayVideos: true,
        showNSFWContent: false,
        emailNotifications: true,
        pushNotifications: true,
        defaultPrivacy: 'public'
      },

      updatePreferences: (prefs) =>
        set(
          (state) => ({
            preferences: { ...state.preferences, ...prefs }
          }),
          false,
          'updatePreferences'
        )
    }),
    {
      name: 'broadcast-store',
      partialize: (state: BroadcastStore) => ({
        filters: state.filters,
        ui: {
          sidebarOpen: state.ui.sidebarOpen,
          viewMode: state.ui.viewMode,
          theme: state.ui.theme
        },
        drafts: {
          savedDrafts: state.drafts.savedDrafts,
          autoSaveEnabled: state.drafts.autoSaveEnabled
        },
        preferences: state.preferences
      })
    }
  )
);

// ===== SELECTORS =====
export const useBroadcastFilters = () => useBroadcastStore((state) => state.filters);

// Helper selector to get active filters count
export const useActiveFiltersCount = () => {
  return useBroadcastStore((state) => {
    const filters = state.filters;
    let count = 0;

    if (filters.category) count++;
    if (filters.topicId) count++;
    if (filters.searchQuery) count++;
    if (filters.dateRange) count++;
    if (filters.postTypes.length > 0) count++;
    if (filters.authors.length > 0) count++;
    if (filters.tags.length > 0) count++;

    return count;
  });
};

// Helper selector for unread notifications count
export const useUnreadNotificationsCount = () => {
  return useBroadcastStore((state) => state.realtime.notifications.filter((n) => !n.read).length);
};
