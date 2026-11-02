import { env } from '$env/dynamic/private';
import { getGoogleRating } from '$lib/server';
import type { LayoutServerLoad } from './$types';

const SITE = 'mdelectricnc';
const RATING_KEY = 'mde-google-rating';
const FRESH_MS = 4 * 60 * 60 * 1000;

type StoredRating = {
	rating: number | null;
	ratingCount: number | null;
	fetchedAt: number;
};

type RatingSource = 'cache' | 'api' | 'stale' | 'empty';

function logRating(event: {
	source: RatingSource;
	kv: boolean;
	ageMs?: number | null;
	status?: number | null;
	error?: string;
}) {
	console.log(
		JSON.stringify({
			event: 'google_rating',
			site: SITE,
			...event
		})
	);
}

export const load: LayoutServerLoad = ({ platform }) => {
	const kv = platform?.env.KV;
	const apiKey = env.GOOGLE_MAPS_PLATFORM_KEY ?? '';

	return {
		googleRating: (async () => {
			const cached = kv ? await kv.get<StoredRating>(RATING_KEY, 'json') : null;
			const ageMs = cached ? Date.now() - cached.fetchedAt : null;
			if (cached && ageMs != null && ageMs < FRESH_MS) {
				logRating({ source: 'cache', kv: true, ageMs });
				return { rating: cached.rating, ratingCount: cached.ratingCount };
			}

			try {
				const fresh = await getGoogleRating(apiKey);
				if (kv && fresh.rating != null) {
					await kv.put(
						RATING_KEY,
						JSON.stringify({
							rating: fresh.rating,
							ratingCount: fresh.ratingCount,
							fetchedAt: Date.now()
						})
					);
					logRating({ source: 'api', kv: true, ageMs, status: fresh.status });
					return { rating: fresh.rating, ratingCount: fresh.ratingCount };
				}

				if (cached) {
					logRating({ source: 'stale', kv: Boolean(kv), ageMs, status: fresh.status });
					return { rating: cached.rating, ratingCount: cached.ratingCount };
				}

				logRating({ source: 'empty', kv: Boolean(kv), ageMs, status: fresh.status });
				return { rating: fresh.rating, ratingCount: fresh.ratingCount };
			} catch (error) {
				logRating({
					source: cached ? 'stale' : 'empty',
					kv: Boolean(kv),
					ageMs,
					error: error instanceof Error ? error.message : 'rating fetch failed'
				});
				if (cached) return { rating: cached.rating, ratingCount: cached.ratingCount };
				return { rating: null, ratingCount: null };
			}
		})()
	};
};
