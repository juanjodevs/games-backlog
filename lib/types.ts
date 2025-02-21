export interface User {
  id: number
  name: string
  email: string
  picture: string
}

export interface Game {
  id?: number
  hltbId: number
  title: string
  cover: string
  platform: string
  timeToComplete: number
  status: "Playing" | "Completed" | "Backlog"
}

export interface HLTBSearchResult {
  hltbId: number
  title: string
  cover: string
  platforms: string[]
  timeMain: number
  timePlusExtras: number
  timeCompletionist: number
  status: "Playing" | "Completed" | "Backlog"
}

