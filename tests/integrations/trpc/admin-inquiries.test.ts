import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { adminInquiriesRepo } from '#/server/repositories/admin-inquiries.repo'

import type { TRPCContext } from '#/integrations/trpc/init'
import type { AdminInquiryRow } from '#/server/repositories/admin-inquiries.repo'

vi.mock('#/server/repositories/admin.repo', () => ({
  adminRepo: {},
}))

vi.mock('#/server/repositories/admin-inquiries.repo', () => ({
  adminInquiriesRepo: {
    exists: vi.fn(),
    list: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

const mockedInquiriesRepo = vi.mocked(adminInquiriesRepo)

function createContext(role: 'admin' | 'user' = 'admin'): TRPCContext {
  return {
    session: {
      session: {
        id: 'session-id',
        token: 'session-token',
        userId: 'user-id',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        image: null,
        membershipTier: 'free',
        role,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
  }
}

const inquiryRow: AdminInquiryRow = {
  id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  name: 'Rafi',
  email: 'rafi@example.com',
  phone: '+6281234567890',
  currentCards: 'BCA KrisFlyer',
  needs: 'Butuh audit kartu untuk trip Jepang.',
  status: 'new',
  createdAt: new Date('2026-05-17T09:00:00.000Z'),
  package: {
    id: 'audit',
    name: 'Card Audit',
    priceLabel: 'Rp499k',
  },
}

describe('admin inquiries router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should list inquiries when user is admin', async () => {
    mockedInquiriesRepo.list.mockResolvedValue([inquiryRow])
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.inquiries()).resolves.toEqual([inquiryRow])
    expect(mockedInquiriesRepo.list).toHaveBeenCalledWith(undefined)
  })

  it('should filter inquiries by status when requested', async () => {
    mockedInquiriesRepo.list.mockResolvedValue([inquiryRow])
    const caller = trpcRouter.createCaller(createContext('admin'))

    await caller.admin.inquiries({ status: 'new' })

    expect(mockedInquiriesRepo.list).toHaveBeenCalledWith('new')
  })

  it('should update inquiry status when inquiry exists', async () => {
    mockedInquiriesRepo.exists.mockResolvedValue(true)
    mockedInquiriesRepo.updateStatus.mockResolvedValue({
      ...inquiryRow,
      status: 'contacted',
    })
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(
      caller.admin.updateInquiryStatus({
        id: inquiryRow.id,
        status: 'contacted',
      }),
    ).resolves.toMatchObject({ status: 'contacted' })
    expect(mockedInquiriesRepo.updateStatus).toHaveBeenCalledWith(
      inquiryRow.id,
      'contacted',
    )
  })

  it('should reject status update when inquiry is missing', async () => {
    mockedInquiriesRepo.exists.mockResolvedValue(false)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(
      caller.admin.updateInquiryStatus({
        id: inquiryRow.id,
        status: 'resolved',
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Inquiry tidak ditemukan.',
    })
    expect(mockedInquiriesRepo.updateStatus).not.toHaveBeenCalled()
  })

  it('should reject inquiry procedures when user is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.inquiries()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    expect(mockedInquiriesRepo.list).not.toHaveBeenCalled()
  })
})
