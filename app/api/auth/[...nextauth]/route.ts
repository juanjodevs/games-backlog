import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { drizzle } from 'drizzle-orm/libsql'
import { usersTable } from '@/db/schema'

const db = drizzle(process.env.DB_FILE_NAME!)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // TODO: Check email verified TS show an exception that email_verified does not exists
      if (!user.name || !user.email || !user.image) {
        return false
      }
      const newUser = {
        name: user.name,
        email: user.email,
        picture: user.image
      }
      try {
        await db.insert(usersTable).values(newUser).onConflictDoNothing({ target: usersTable.email })
      } catch (err) {
        console.log(err)
      }
      return true
    }
  }
})

export { handler as GET, handler as POST }

