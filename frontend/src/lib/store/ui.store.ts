// ===========================
// UI State Store with Persistence
// ©AngelaMos | 2025
// ===========================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  linkedin: string;
}

export interface SearchState {
  projects: {
    query: string;
    language: string | null;
    projectType: string | null;
  };
  blogs: {
    query: string;
    tag: string | null;
  };
}

export interface NavigationState {
  activeTab: string | null;
  activeProjectsFilter: 'all' | 'featured' | 'active';
  activeBlogsFilter: 'all' | 'published' | 'drafts';
}

export interface ProjectsUIState {
  expandedProjects: string[];
}

export interface TerminalHistoryEntry {
  command: string;
  output: string;
  timestamp: number;
}

export interface TerminalState {
  history: TerminalHistoryEntry[];
}

export interface AnimationState {
  playedAnimations: Set<string>;
}

interface UIStore {
  contactForm: ContactFormData;
  search: SearchState;
  navigation: NavigationState;
  projectsUI: ProjectsUIState;
  terminal: TerminalState;
  animations: AnimationState;

  setContactFormField: (field: keyof ContactFormData, value: string) => void;
  setContactForm: (data: Partial<ContactFormData>) => void;
  clearContactForm: () => void;

  setProjectsSearch: (search: Partial<SearchState['projects']>) => void;
  clearProjectsSearch: () => void;

  setBlogsSearch: (search: Partial<SearchState['blogs']>) => void;
  clearBlogsSearch: () => void;

  setActiveTab: (tab: string | null) => void;
  setProjectsFilter: (
    filter: NavigationState['activeProjectsFilter'],
  ) => void;
  setBlogsFilter: (filter: NavigationState['activeBlogsFilter']) => void;

  toggleProjectExpanded: (projectId: string) => void;
  setExpandedProjects: (projectIds: string[]) => void;

  addTerminalHistory: (entry: TerminalHistoryEntry) => void;
  clearTerminalHistory: () => void;

  markAnimationPlayed: (animationId: string) => void;
  hasAnimationPlayed: (animationId: string) => boolean;

  clearAllUIState: () => void;
}

const initialContactForm: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  body: '',
  linkedin: '',
};

const initialSearch: SearchState = {
  projects: {
    query: '',
    language: null,
    projectType: null,
  },
  blogs: {
    query: '',
    tag: null,
  },
};

const initialNavigation: NavigationState = {
  activeTab: null,
  activeProjectsFilter: 'all',
  activeBlogsFilter: 'published',
};

const initialProjectsUI: ProjectsUIState = {
  expandedProjects: [],
};

const initialTerminal: TerminalState = {
  history: [],
};

const initialAnimations: AnimationState = {
  playedAnimations: new Set(),
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      contactForm: initialContactForm,
      search: initialSearch,
      navigation: initialNavigation,
      projectsUI: initialProjectsUI,
      terminal: initialTerminal,
      animations: initialAnimations,

      setContactFormField: (field, value) =>
        set((state) => ({
          contactForm: {
            ...state.contactForm,
            [field]: value,
          },
        })),

      setContactForm: (data) =>
        set((state) => ({
          contactForm: {
            ...state.contactForm,
            ...data,
          },
        })),

      clearContactForm: () =>
        set(() => ({
          contactForm: initialContactForm,
        })),

      setProjectsSearch: (search) =>
        set((state) => ({
          search: {
            ...state.search,
            projects: {
              ...state.search.projects,
              ...search,
            },
          },
        })),

      clearProjectsSearch: () =>
        set((state) => ({
          search: {
            ...state.search,
            projects: initialSearch.projects,
          },
        })),

      setBlogsSearch: (search) =>
        set((state) => ({
          search: {
            ...state.search,
            blogs: {
              ...state.search.blogs,
              ...search,
            },
          },
        })),

      clearBlogsSearch: () =>
        set((state) => ({
          search: {
            ...state.search,
            blogs: initialSearch.blogs,
          },
        })),

      setActiveTab: (tab) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            activeTab: tab,
          },
        })),

      setProjectsFilter: (filter) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            activeProjectsFilter: filter,
          },
        })),

      setBlogsFilter: (filter) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            activeBlogsFilter: filter,
          },
        })),

      toggleProjectExpanded: (projectId) =>
        set((state) => ({
          projectsUI: {
            ...state.projectsUI,
            expandedProjects: state.projectsUI.expandedProjects.includes(
              projectId,
            )
              ? state.projectsUI.expandedProjects.filter(
                  (id) => id !== projectId,
                )
              : [...state.projectsUI.expandedProjects, projectId],
          },
        })),

      setExpandedProjects: (projectIds) =>
        set((state) => ({
          projectsUI: {
            ...state.projectsUI,
            expandedProjects: projectIds,
          },
        })),

      addTerminalHistory: (entry) =>
        set((state) => ({
          terminal: {
            ...state.terminal,
            history: [...state.terminal.history, entry],
          },
        })),

      clearTerminalHistory: () =>
        set((state) => ({
          terminal: {
            ...state.terminal,
            history: [],
          },
        })),

      markAnimationPlayed: (animationId) =>
        set((state) => ({
          animations: {
            ...state.animations,
            playedAnimations: new Set([
              ...state.animations.playedAnimations,
              animationId,
            ]),
          },
        })),

      hasAnimationPlayed: (animationId) => {
        return get().animations.playedAnimations.has(animationId);
      },

      clearAllUIState: () =>
        set(() => ({
          contactForm: initialContactForm,
          search: initialSearch,
          navigation: initialNavigation,
          projectsUI: initialProjectsUI,
          terminal: initialTerminal,
          animations: initialAnimations,
        })),
    }),
    {
      name: STORAGE_KEYS.UI ?? 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        contactForm: state.contactForm,
        search: state.search,
        navigation: state.navigation,
        projectsUI: state.projectsUI,
        terminal: state.terminal,
        animations: {
          playedAnimations: Array.from(state.animations.playedAnimations),
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<UIStore>;
        const persistedAnimations =
          (
            persisted.animations as unknown as
              | { playedAnimations: string[] }
              | undefined
          )?.playedAnimations ?? [];
        return {
          ...currentState,
          ...persisted,
          animations: {
            playedAnimations: new Set(persistedAnimations),
          },
        };
      },
    },
  ),
);
