import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '#/db'

function getAuthSecret(): string | undefined {
  const secret = process.env.BETTER_AUTH_SECRET

  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('BETTER_AUTH_SECRET is required in production.')
  }

  return secret
}

export const auth = betterAuth({
  appName: 'JustMiles',
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.SERVER_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    transaction: true,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  secret: getAuthSecret(),
  user: {
    additionalFields: {
      membershipTier: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'free',
        fieldName: 'membershipTier',
      },
      role: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'user',
      },
    },
  },
  plugins: [tanstackStartCookies()],
})
