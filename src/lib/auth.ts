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

function addOrigin(origins: Set<string>, value: string | undefined): void {
  if (!value) {
    return
  }

  try {
    origins.add(new URL(value).origin)
  } catch {
    origins.add(value)
  }
}

function getTrustedOrigins(): string[] {
  const origins = new Set<string>()
  const configuredOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',')

  addOrigin(origins, process.env.BETTER_AUTH_URL)
  addOrigin(origins, process.env.SERVER_URL)

  configuredOrigins?.forEach((origin) => {
    addOrigin(origins, origin.trim())
  })

  if (process.env.NODE_ENV !== 'production') {
    const devOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3010',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3010',
    ]

    devOrigins.forEach((origin) => origins.add(origin))
  }

  return [...origins]
}

export const auth = betterAuth({
  appName: 'JustMiles',
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.SERVER_URL,
  trustedOrigins: getTrustedOrigins(),
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
