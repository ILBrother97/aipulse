import { premiumCache } from '../cache/premiumCache'

export function invalidateCacheOnWebhook(event: { type: string; data: { user_id?: string } }) {
  if (event.data.user_id) {
    premiumCache.invalidateUser(event.data.user_id)
  }
}
