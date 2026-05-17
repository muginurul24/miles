import { describe, expect, it } from 'vitest'

import { articles } from './articles'

function countByCategory(): Map<string, number> {
  return articles.reduce((counts, article) => {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1)
    return counts
  }, new Map<string, number>())
}

describe('article seed data', () => {
  it('should include 20 articles when seeding the starter catalog', () => {
    expect(articles).toHaveLength(20)
  })

  it('should include four articles per content category when grouped for listings', () => {
    const categoryCounts = countByCategory()

    expect(categoryCounts.get('News')).toBe(4)
    expect(categoryCounts.get('Credit Card')).toBe(4)
    expect(categoryCounts.get('Guide')).toBe(4)
    expect(categoryCounts.get('Review')).toBe(4)
    expect(categoryCounts.get('Deal')).toBe(4)
  })

  it('should mark premium articles correctly when matching the editorial plan', () => {
    const premiumByCategory = articles.reduce((counts, article) => {
      if (!article.premium) {
        return counts
      }

      counts.set(article.category, (counts.get(article.category) ?? 0) + 1)
      return counts
    }, new Map<string, number>())

    expect(premiumByCategory.get('News')).toBe(1)
    expect(premiumByCategory.get('Credit Card')).toBe(2)
    expect(premiumByCategory.get('Guide')).toBe(1)
    expect(premiumByCategory.get('Review')).toBe(1)
    expect(premiumByCategory.has('Deal')).toBe(false)
  })

  it('should include deal tags when articles are deal entries', () => {
    const dealTags = articles
      .filter((article) => article.category === 'Deal')
      .map((article) => article.dealTag)

    expect(dealTags).toEqual(['HOT', 'SWEET SPOT', 'PROMO', 'HOT'])
  })

  it('should keep publish dates descending when rendered in seed order', () => {
    const publishedTimes = articles.map((article) =>
      new Date(`${article.date}T00:00:00.000Z`).getTime(),
    )

    const sortedTimes = [...publishedTimes].sort((first, second) => {
      return second - first
    })

    expect(publishedTimes).toEqual(sortedTimes)
  })
})
