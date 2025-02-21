'use server'

import { getServerSession } from "next-auth"
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm';
import { gamesTable } from '@/db/schema'

import type { HLTBSearchResult, Game } from "@/lib/types"
import { revalidatePath } from "next/cache";

const baseUrl = 'https://howlongtobeat.com'

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Origin': baseUrl,
  'Referer': `${baseUrl}/`,
  'Content-Type': 'application/json'
}

const db = drizzle(process.env.DB_FILE_NAME!);

const getAppScriptUrl = async () => {
  const response = await fetch(baseUrl, { headers: headers })
  if (response.status !== 200) {
    throw new Error('Could not fetch base URL')
  }
  const html = await response.text()
  const regex = /_next\/static\/chunks\/pages\/_app-([A-Za-z0-9]+).js/gm
  const url = html.match(regex)
  if (!url) {
    throw new Error('Could not find AppScript URL ')
  }
  return url[0]
}

const getAPIhash = async () => {
  const response = await fetch(`${baseUrl}/${await getAppScriptUrl()}`, { headers: headers })
  if (response.status !== 200) {
    throw new Error('Could not fetch AppScript')
  }
  const html = await response.text()
  let regex = /(?<=fetch\("\/api\/ouch\/").*?(?=,\{method)/g
  const concats = html.match(regex)
  if (!concats || concats.length === 0) {
    throw new Error('Could not find hash from AppScript HTML')
  }
  regex = /\".*?\"/gi
  const hashes = concats[0].match(regex)
  return hashes?.join('').replaceAll('"', '')
}

const searchGame = async (gameName: string) => {
  const hash = await getAPIhash()
  const payload = {
    'searchType': 'games',
    'searchTerms': gameName.split(' '),
    'searchPage': 1,
    'size': 20,
    'searchOptions': {
      'games': {
        'userId': 0,
        'platform': '',
        'sortCategory': 'popular',
        'rangeCategory': 'main',
        'rangeTime': {
          'min': null,
          'max': null
        },
        'gameplay': {
          'perspective': '',
          'flow': '',
          'genre': '',
          'difficulty': ''
        },
        'rangeYear': {
          'min': '',
          'max': ''
        },
        'modifier': ''
      },
      'users': {
        'sortCategory': 'postcount'
      },
      'lists': {
        'sortCategory': 'follows'
      },
      'filter': '',
      'sort': 0,
      'randomizer': 0
    },
    'useCache': true
  }

  const response = await fetch(`${baseUrl}/api/ouch/${hash}`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(payload)
  })

  if (response.status !== 200) {
    console.log(response)
    throw new Error('Could not fetch API Search')
  }

  const data = await response.json()

  const games = data.data.map((g: any): (HLTBSearchResult | boolean) => {
    if (g.comp_main > 0 && g.review_score > 0) {
      return {
        hltbId: g.game_id,
        title: g.game_name,
        cover: `https://howlongtobeat.com/games/${g.game_image}?width=200`,
        platforms: g.profile_platform.split(', '),
        timeMain: g.comp_main,
        timePlusExtras: g.comp_plus,
        timeCompletionist: g.comp_100,
        status: 'Backlog'
      }
    }
    return false
  })

  return games
}

export const searchGames = async (query: string) => {
  if (!query || query.length < 3) return []

  const normalizedQuery = query.toLowerCase()
  return searchGame(normalizedQuery)
}

export const addGame = async (game: Game) => {
  const session = await getServerSession()
  if (session?.user) {
    const newGame: typeof gamesTable.$inferInsert = {
      ...game,
      ownerEmail: session.user.email
    }
    await db.insert(gamesTable).values(newGame)
  }
}

export const getGames = async () => {
  const session = await getServerSession()
  if (session?.user?.email) {
    const games: Game[] = await db.select().from(gamesTable).where(eq(gamesTable.ownerEmail, session.user.email))
    return games
  }
  return []
}

export const updateGameStatus = async (gameId: number, status: Game['status']) => {
  const session = await getServerSession()
  if (session?.user?.email) {
    await db
      .update(gamesTable)
      .set({
        status: status,
      })
      .where(eq(gamesTable.id, gameId));
  }
  revalidatePath('/backlog')
}
