import { creditCardsBatchA } from './credit-cards/batch-a'
import { creditCardsBatchB } from './credit-cards/batch-b'
import { creditCardsBatchC } from './credit-cards/batch-c'

import type { CreditCardSeed } from './types'

export const creditCards = [
  ...creditCardsBatchA,
  ...creditCardsBatchB,
  ...creditCardsBatchC,
] satisfies CreditCardSeed[]
