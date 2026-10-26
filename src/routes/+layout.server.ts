import { env } from '$env/dynamic/private';
import { getGoogleRating } from '$lib/server';
import type { LayoutServerLoad } from './$types';

const RATING_KEY = 'mde-google-rating';
const FRESH_MS = 30 * 60 * 1000;

type StoredRating = {
	rating: number | null;
	ratingCount: number | null;
	fetchedAt: number;
};

export const load: LayoutServerLoad = ({ platform }) => {
	const kv = platform?.env.KV;
	const apiKey = env.GOOGLE_MAPS_PLATFORM_KEY ?? '';

	return {
		googleRating: (async () => {
			const cached = kv ? await kv.get<StoredRating>(RATING_KEY, 'json') : null;
			if (cached && Date.now() - cached.fetchedAt < FRESH_MS) {
				return { rating: cached.rating, ratingCount: cached.ratingCount };
			}

			const fresh = await getGoogleRating(apiKey);
			if (kv && fresh.rating != null) {
				await kv.put(RATING_KEY, JSON.stringify({ ...fresh, fetchedAt: Date.now() }));
				return fresh;
			}

			if (cached) return { rating: cached.rating, ratingCount: cached.ratingCount };
			return fresh;
		})()
	};
};
