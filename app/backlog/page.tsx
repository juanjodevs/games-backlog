"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddGameDialog } from "@/components/add-game-dialog"
import type { Game, HLTBSearchResult } from "@/lib/types"
import { GameCard } from "@/components/game-card"
import { getGames, addGame, updateGameStatus, deleteGame } from "../actions/games"

export default function BacklogPage() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddGame = async (game: HLTBSearchResult, platform: string, completionTime: string, status: Game['status']) => {
    const newGame: Game = {
      hltbId: game.hltbId,
      title: game.title,
      cover: game.cover,
      platform,
      timeToComplete: parseInt(completionTime),
      status: status,
    }
    const newId = await addGame(newGame)
    if (newId) {
      const newGames: Game[] = [...games, { ...newGame, id: newId }]
      setGames(newGames)
    }
  }

  const handleUpdateGameStatus = (gameId: number, status: Game['status']) => {
    updateGameStatus(gameId, status)
    const newGames: Game[] = games.map((game) => {
      if (game.id === gameId) {
        return { ...game, status: status }
      }
      return game
    })
    setGames(newGames)
  }

  const handleDeleteGame = (gameId: number) => {
    deleteGame(gameId)
    const newGames: Game[] = games.filter((game) => game.id !== gameId)
    setGames(newGames)
  }

  const showGames = async () => {
    const games: Game[] = await getGames()
    setGames(games)
    setIsLoading(false)
  }

  useEffect(() => {
    showGames()
  }, [])

  const filteredGames = games.filter((game: Game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container max-w-7xl space-y-6 p-6 mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Your Collection</h1>
          <AddGameDialog onAddGame={handleAddGame} />
        </div>
        <div className="relative w-full sm:w-96">
          <Input
            className="pl-10"
            placeholder="Search your games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {
        isLoading ?
          <div className="pt-20 text-white text-center text-4xl">Loading...</div>
          :
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="all">All Games ({filteredGames.length})</TabsTrigger>
              <TabsTrigger value="playing">Playing ({filteredGames.filter((g) => g.status === 'Playing').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredGames.filter((g) => g.status === 'Completed').length})</TabsTrigger>
              <TabsTrigger value="backlog">Backlog ({filteredGames.filter((g) => g.status === 'Backlog').length})</TabsTrigger>
            </TabsList>

            {["all", "playing", "completed", "backlog"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredGames
                    .filter((g) => g.status.toLowerCase() === status || status === "all")
                    .sort((a, b) => a.title < b.title ? -1 : 1)
                    .map((game) => (
                      <GameCard key={game.id} game={game} updateGameStatus={handleUpdateGameStatus} deleteGame={handleDeleteGame} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
      }
    </div>
  )
}

