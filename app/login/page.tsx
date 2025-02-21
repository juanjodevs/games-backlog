"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/backlog")
    }
  }, [session, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome to Game Backlog</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your Google account to manage your game collection
          </p>
        </div>
        <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/backlog" })} className="w-full">
          Continue with Google
        </Button>
      </div>
    </div>
  )
}

