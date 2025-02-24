"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Game, HLTBSearchResult } from "@/lib/types"
import { searchGames } from '@/app/actions/games'
import { formatTime } from "@/lib/utils"

interface AddGameDialogProps {
  onAddGame: (game: HLTBSearchResult, platform: string, completionTime: string, status: Game['status']) => void
}

export function AddGameDialog({ onAddGame }: AddGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HLTBSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<HLTBSearchResult | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<Game['status']>("Backlog")
  const statuses: Game["status"][] = ["Playing", "Completed", "Backlog"]

  const handleSearch = async (key: string) => {
    if (key === 'Enter') {
      if (query.length < 4) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchGames(query)
        setResults(searchResults)
      } catch (error) {
        console.error("Failed to search games:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGameSelect = (game: HLTBSearchResult) => {
    setSelectedGame(game)
    setSelectedPlatform("")
    setSelectedTime("")
  }

  const handleAddGame = () => {
    if (selectedGame && selectedPlatform && selectedTime && selectedStatus) {
      onAddGame(selectedGame, selectedPlatform, selectedTime, selectedStatus)
      setOpen(false)
      // Reset form
      setQuery("")
      setResults([])
      setSelectedGame(null)
      setSelectedPlatform("")
      setSelectedTime("")
      setSelectedStatus("Backlog")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Game to Backlog</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              placeholder="Search for a game..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => handleSearch(e.key)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>

          {loading && <div className="text-center text-sm text-muted-foreground">Searching...</div>}

          {!loading && results.length > 0 && !selectedGame && (
            <div className="max-h-[200px] space-y-2 overflow-auto">
              {results.map((game) => (
                <button
                  key={game.hltbId}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent"
                  onClick={() => handleGameSelect(game)}
                >
                  <img
                    src={game.cover || "/placeholder.svg"}
                    alt={game.title}
                    className="h-12 w-8 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{game.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Main: {formatTime(game.timeMain)} • Completionist: {formatTime(game.timeCompletionist)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedGame && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedGame.cover || "/placeholder.svg"}
                  alt={selectedGame.title}
                  className="h-16 w-12 rounded object-cover"
                />
                <div>
                  <div className="font-medium">{selectedGame.title}</div>
                  <button onClick={() => setSelectedGame(null)} className="text-sm text-blue-500 hover:underline">
                    Change game
                  </button>
                </div>
              </div>

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGame.platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select completion time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedGame.timeMain.toString()}>Main Story ({formatTime(selectedGame.timeMain)})</SelectItem>
                  <SelectItem value={selectedGame.timePlusExtras.toString()}>
                    Main + Extras ({formatTime(selectedGame.timePlusExtras)})
                  </SelectItem>
                  <SelectItem value={selectedGame.timeCompletionist.toString()}>
                    Completionist ({formatTime(selectedGame.timeCompletionist)})
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {
                    statuses.map((status) => (
                      <SelectItem value={status}>{status}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <Button className="w-full" disabled={!selectedPlatform || !selectedTime || !selectedStatus} onClick={handleAddGame}>
                Add to Backlog
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

