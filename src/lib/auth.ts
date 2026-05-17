import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '#/db'
import { authSecondaryStorage } from '#/lib/auth-secondary-storage'

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
  secondaryStorage: authSecondaryStorage,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 12,
    storeSessionInDatabase: false,
  },
  rateLimit: {
    enabled: true,
    storage: 'secondary-storage',
    customRules: {
      '/sign-in/email': {
        window: 60 * 15,
        max: 10,
      },
      '/sign-up/email': {
        window: 60 * 60,
        max: 3,
      },
    },
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
      membershipExpiresAt: {
        type: 'date',
        required: false,
        input: false,
        fieldName: 'membershipExpiresAt',
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
