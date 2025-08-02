import React from 'react';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { ThemeSettings, SoundSettings, GameSettings, ColorBlindMode } from '@/types';

interface SettingsStore {
  theme: ThemeSettings;
  sound: SoundSettings;
  game: GameSettings;
  
  // Theme actions
  toggleDarkMode: () => void;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setGlassOpacity: (opacity: number) => void;
  setParticleIntensity: (intensity: number) => void;
  
  // Sound actions
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  toggleHaptics: () => void;
  setSoundpack: (pack: string) => void;
  
  // Game actions
  toggleHints: () => void;
  toggleAutoAdvance: () => void;
  setAnimationSpeed: (speed: number) => void;
  toggleParticleEffects: () => void;
  
  // Accessibility actions
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleScreenReader: () => void;
  setFontSize: (size: number) => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  
  // Bulk updates
  resetTheme: () => void;
  resetSound: () => void;
  resetGame: () => void;
}

const defaultTheme: ThemeSettings = {
  isDarkMode: true,
  primaryColor: '#6366f1',
  accentColor: '#f59e0b',
  backgroundGradient: ['#1a1a2e', '#16213e', '#0f0f1a'],
  glassOpacity: 0.15,
  particleIntensity: 0.7
};

const defaultSound: SoundSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.7,
  musicVolume: 0.5,
  enableHaptics: true,
  soundpack: 'modern'
};

const defaultGame: GameSettings = {
  showHints: true,
  autoAdvance: false,
  animationSpeed: 1.0,
  particleEffects: true,
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    fontSize: 16,
    colorBlindMode: ColorBlindMode.NONE
  }
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        theme: defaultTheme,
        sound: defaultSound,
        game: defaultGame,

        // Theme actions
        toggleDarkMode: () => {
          set((state) => ({
            theme: { ...state.theme, isDarkMode: !state.theme.isDarkMode }
          }));
        },

        setPrimaryColor: (color: string) => {
          set((state) => ({
            theme: { ...state.theme, primaryColor: color }
          }));
        },

        setAccentColor: (color: string) => {
          set((state) => ({
            theme: { ...state.theme, accentColor: color }
          }));
        },

        setGlassOpacity: (opacity: number) => {
          set((state) => ({
            theme: { ...state.theme, glassOpacity: Math.max(0, Math.min(1, opacity)) }
          }));
        },

        setParticleIntensity: (intensity: number) => {
          set((state) => ({
            theme: { ...state.theme, particleIntensity: Math.max(0, Math.min(1, intensity)) }
          }));
        },

        // Sound actions
        setMasterVolume: (volume: number) => {
          set((state) => ({
            sound: { ...state.sound, masterVolume: Math.max(0, Math.min(1, volume)) }
          }));
        },

        setSfxVolume: (volume: number) => {
          set((state) => ({
            sound: { ...state.sound, sfxVolume: Math.max(0, Math.min(1, volume)) }
          }));
        },

        setMusicVolume: (volume: number) => {
          set((state) => ({
            sound: { ...state.sound, musicVolume: Math.max(0, Math.min(1, volume)) }
          }));
        },

        toggleHaptics: () => {
          set((state) => ({
            sound: { ...state.sound, enableHaptics: !state.sound.enableHaptics }
          }));
        },

        setSoundpack: (pack: string) => {
          set((state) => ({
            sound: { ...state.sound, soundpack: pack }
          }));
        },

        // Game actions
        toggleHints: () => {
          set((state) => ({
            game: { ...state.game, showHints: !state.game.showHints }
          }));
        },

        toggleAutoAdvance: () => {
          set((state) => ({
            game: { ...state.game, autoAdvance: !state.game.autoAdvance }
          }));
        },

        setAnimationSpeed: (speed: number) => {
          set((state) => ({
            game: { ...state.game, animationSpeed: Math.max(0.1, Math.min(3, speed)) }
          }));
        },

        toggleParticleEffects: () => {
          set((state) => ({
            game: { ...state.game, particleEffects: !state.game.particleEffects }
          }));
        },

        // Accessibility actions
        toggleHighContrast: () => {
          set((state) => ({
            game: {
              ...state.game,
              accessibility: {
                ...state.game.accessibility,
                highContrast: !state.game.accessibility.highContrast
              }
            }
          }));
        },

        toggleReduceMotion: () => {
          set((state) => ({
            game: {
              ...state.game,
              accessibility: {
                ...state.game.accessibility,
                reduceMotion: !state.game.accessibility.reduceMotion
              }
            }
          }));
        },

        toggleScreenReader: () => {
          set((state) => ({
            game: {
              ...state.game,
              accessibility: {
                ...state.game.accessibility,
                screenReader: !state.game.accessibility.screenReader
              }
            }
          }));
        },

        setFontSize: (size: number) => {
          set((state) => ({
            game: {
              ...state.game,
              accessibility: {
                ...state.game.accessibility,
                fontSize: Math.max(12, Math.min(24, size))
              }
            }
          }));
        },

        setColorBlindMode: (mode: ColorBlindMode) => {
          set((state) => ({
            game: {
              ...state.game,
              accessibility: {
                ...state.game.accessibility,
                colorBlindMode: mode
              }
            }
          }));
        },

        // Bulk resets
        resetTheme: () => {
          set({ theme: defaultTheme });
        },

        resetSound: () => {
          set({ sound: defaultSound });
        },

        resetGame: () => {
          set({ game: defaultGame });
        }
      }),
      {
        name: 'berlin-clock-settings',
        partialize: (state) => ({
          theme: state.theme,
          sound: state.sound,
          game: state.game
        })
      }
    ),
    { name: 'berlin-clock-settings' }
  )
);

// Store provider component for React context
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};