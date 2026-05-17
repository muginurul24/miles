import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { newsletterRepo } from '#/server/repositories/newsletter.repo'

vi.mock('#/server/repositories/newsletter.repo', () => ({
  newsletterRepo: {
    subscribe: vi.fn(),
  },
}))

const mockedNewsletterRepo = vi.mocked(newsletterRepo)

describe('newsletter router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should subscribe an email when input is valid', async () => {
    mockedNewsletterRepo.subscribe.mockResolvedValue({
      id: 'subscriber-id',
      email: 'rafi@example.com',
      status: 'subscribed',
    })
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.newsletter.subscribe({
        email: ' rafi@example.com ',
      }),
    ).resolves.toEqual({
      id: 'subscriber-id',
      email: 'rafi@example.com',
      status: 'subscribed',
    })
    expect(mockedNewsletterRepo.subscribe).toHaveBeenCalledWith({
      email: 'rafi@example.com',
    })
  })

  it('should reject subscribe when email is invalid', async () => {
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.newsletter.subscribe({
        email: 'not-an-email',
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
    expect(mockedNewsletterRepo.subscribe).not.toHaveBeenCalled()
  })
})
