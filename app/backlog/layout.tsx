import type React from "react"
import { UserNav } from "@/components/user-nav"

export default function BacklogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
        <div className="container flex h-14 max-w-7xl items-center mx-auto">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2 text-white" href="/backlog">
              <span className="hidden font-bold sm:inline-block text-4xl">What To Play Next?</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <UserNav />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

