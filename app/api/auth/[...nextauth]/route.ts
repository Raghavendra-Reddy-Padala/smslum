import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailPassword, signInWithPhoneNumber } from "@/lib/auth-service"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phoneNumber: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          let user

          if (credentials.loginType === "email") {
            if (!credentials.email || !credentials.password) {
              throw new Error("Email and password are required")
            }

            user = await signInWithEmailPassword(credentials.email, credentials.password)
          } else if (credentials.loginType === "phone") {
            if (!credentials.phoneNumber || !credentials.otp) {
              throw new Error("Phone number and OTP are required")
            }

            user = await signInWithPhoneNumber(credentials.phoneNumber, credentials.otp)
          } else {
            throw new Error("Invalid login type")
          }

          if (!user) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            department: user.department,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.phone = token.phone as string
        session.user.department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

