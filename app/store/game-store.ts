//import { create } from 'zustand'
//import { Game } from '@/lib/types'
//
//export const gameStore = create((set) => ({
//  games: [],
//  addGame: (game: Game) => set((state) => ({ games: [...state.games, game] }))
//}))
//

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Game } from '@/lib/types'

type GameStore = {
  games: Game[]
  addGame: (game: Game) => void
  updateStatus: (gameId: number, status: Game['status']) => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      games: [],
      addGame: (game: Game) => set({ games: [...get().games, game] }),
      updateStatus: (gameId: number, status: Game['status']) => {
        set({
          games: get().games.map((game) => {
            if (gameId !== game.id) {
              return game
            }
            return {
              ...game,
              status: status
            }
          })
        })
      }
    }),
    {
      name: 'game-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
