import { Check, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Game } from "@/lib/types"
import { formatTime } from "@/lib/utils"

export function GameCard({ game, updateGameStatus, deleteGame }: { game: Game, updateGameStatus: any, deleteGame: any }) {
  const statuses: Game["status"][] = ["Playing", "Completed", "Backlog"]

  return (
    <Card className="group relative overflow-hidden bg-slate-800 text-white">
      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 bg-black/50 p-0 opacity-0 hover:bg-black/70 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => updateGameStatus(game.id, status)}
                className="flex items-center justify-between"
              >
                <span
                  className={
                    status === "Playing"
                      ? "text-blue-400"
                      : status === "Completed"
                        ? "text-green-400"
                        : "text-orange-400"
                  }
                >
                  {status}
                </span>
                {game.status === status && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteGame(game.id)}
              className="flex items-center justify-between"
            >
              <span
                className="text-red-400">
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover || "/placeholder.svg"}
          alt={`${game.title} cover`}
          className="object-cover w-full transition-transform hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border-white 
            ${game.status === "Playing" ? "bg-blue-500/20 text-blue-200" : ""}
            ${game.status === "Completed" ? "bg-green-500/20 text-green-200" : ""}
            ${game.status === "Backlog" ? "bg-orange-500/20 text-orange-200" : ""}
          `}
          >
            {game.status}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{game.title}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {game.platform}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {formatTime(game.timeToComplete)}
        </p>
      </CardContent>
    </Card>
  )
}

