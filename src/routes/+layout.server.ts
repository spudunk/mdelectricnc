import { env } from '$env/dynamic/private';
import { getGoogleRating } from '$lib/server';
import type { LayoutServerLoad } from './$types';

const SITE = 'mdelectricnc';
const RATING_KEY = 'mde-google-rating';
const FRESH_MS = 24 * 60 * 60 * 1000;

type StoredRating = {
	rating: number | null;
	ratingCount: number | null;
	fetchedAt: number;
};

type RatingSource = 'cache' | 'api' | 'stale' | 'empty' | 'kv_error';

const empty = { rating: null, ratingCount: null };

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
			if (!kv) {
				logRating({ source: 'empty', kv: false, error: 'KV binding missing' });
				return empty;
			}

			let cached: StoredRating | null;
			try {
				cached = await kv.get<StoredRating>(RATING_KEY, 'json');
			} catch (error) {
				logRating({
					source: 'kv_error',
					kv: true,
					error: error instanceof Error ? error.message : 'KV read failed'
				});
				return empty;
			}

			if (!cached) {
				logRating({ source: 'empty', kv: true, error: 'no cached rating' });
				return empty;
			}

			const ageMs = Date.now() - cached.fetchedAt;
			if (ageMs < FRESH_MS) {
				logRating({ source: 'cache', kv: true, ageMs });
				return { rating: cached.rating, ratingCount: cached.ratingCount };
			}

			try {
				const fresh = await getGoogleRating(apiKey);
				if (fresh.rating == null) {
					logRating({ source: 'stale', kv: true, ageMs, status: fresh.status });
					return { rating: cached.rating, ratingCount: cached.ratingCount };
				}

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
			} catch (error) {
				logRating({
					source: 'stale',
					kv: true,
					ageMs,
					error: error instanceof Error ? error.message : 'rating fetch failed'
				});
				return { rating: cached.rating, ratingCount: cached.ratingCount };
			}
		})()
	};
};
