export interface Game {
  id: number
  title: string
  cover: string
  platform: string
  timeToComplete: number
  status: "Playing" | "Completed" | "Backlog"
}

export interface HLTBSearchResult {
  id: number
  title: string
  cover: string
  platforms: string[]
  timeMain: number
  timePlusExtras: number
  timeCompletionist: number
  status: "Playing" | "Completed" | "Backlog"
}

