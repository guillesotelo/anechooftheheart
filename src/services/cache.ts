type CacheEntry<T> = {
    data: T
    expiresAt: number
}

const cacheStore = new Map<string, CacheEntry<any>>()

const DEFAULT_TTL = 1000 * 60 * 15 // 15 minutes

export async function getOrSetCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = DEFAULT_TTL
): Promise<T> {
    const now = Date.now()
    const cached = cacheStore.get(key)

    if (cached && now < cached.expiresAt) {
        return cached.data
    }

    const data = await fetchFn()
    cacheStore.set(key, {
        data,
        expiresAt: now + ttl,
    })

    return data
}  