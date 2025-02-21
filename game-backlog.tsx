"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddGameDialog } from "./components/add-game-dialog"
import type { Game, HLTBSearchResult } from "./lib/types"

const initialGames: Game[] = [
  {
    id: 1,
    title: "The Legend of Zelda: Breath of the Wild",
    cover: "/placeholder.svg?height=400&width=300",
    platform: "Nintendo Switch",
    timeToComplete: "50h",
    status: "Playing",
  },
  {
    id: 2,
    title: "Red Dead Redemption 2",
    cover: "/placeholder.svg?height=400&width=300",
    platform: "PS5",
    timeToComplete: "45h",
    status: "Backlog",
  },
  {
    id: 3,
    title: "Elden Ring",
    cover: "/placeholder.svg?height=400&width=300",
    platform: "PC",
    timeToComplete: "60h",
    status: "Completed",
  },
]

export default function GameBacklog() {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddGame = (game: HLTBSearchResult, platform: string, completionTime: string) => {
    const newGame: Game = {
      id: games.length + 1,
      title: game.title,
      cover: game.cover,
      platform,
      timeToComplete: completionTime,
      status: "Backlog",
    }
    setGames([...games, newGame])
  }

  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const GameCard = ({ game }: { game: Game }) => (
    <Card className="overflow-hidden bg-slate-800 text-white">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover || "/placeholder.svg"}
          alt={`${game.title} cover`}
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${game.status === "Playing" ? "bg-blue-500/20 text-blue-400" : ""}
            ${game.status === "Completed" ? "bg-green-500/20 text-green-400" : ""}
            ${game.status === "Backlog" ? "bg-orange-500/20 text-orange-400" : ""}
          `}
          >
            {game.status}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-semibold">{game.title}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {game.platform} • {game.timeToComplete}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white">Game Backlog</h1>
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="playing">Playing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="backlog">Backlog</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>

          {["playing", "completed", "backlog"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredGames
                  .filter((g) => g.status.toLowerCase() === status)
                  .map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

