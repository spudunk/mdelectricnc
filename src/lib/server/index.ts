import { googlePlaceID } from '$lib';

export const getGoogleRating = async (googleApiKey: string) => {
	const empty = { rating: null, ratingCount: null, status: null as number | null };
	if (!googleApiKey) return empty;

	const response = await fetch(`https://places.googleapis.com/v1/places/${googlePlaceID}`, {
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': googleApiKey,
			'X-Goog-FieldMask': 'rating,userRatingCount'
		}
	});

	if (!response.ok) return { ...empty, status: response.status };

	const data: { rating?: number; userRatingCount?: number } = await response.json();

	return {
		rating: data.rating ?? null,
		ratingCount: data.userRatingCount ?? null,
		status: response.status
	};
};
