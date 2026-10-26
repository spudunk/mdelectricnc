import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const BOARD = 'https://arls-public.ncbeec.org';
const LICENSE_NUMBER = '35895';

function field(html: string, label: string) {
	const match = html.match(
		new RegExp(`display-label">\\s*${label}\\s*</div>\\s*<div class="display-field">([\\s\\S]*?)</div>`, 'i')
	);
	return match?.[1].replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
}

export const load: PageServerLoad = async ({ fetch }) => {
	const search = await fetch(`${BOARD}/Public/_Search/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ AccountNumber: LICENSE_NUMBER, AccountTypeID: '20' })
	});
	if (!search.ok) error(502, 'The state license lookup is unavailable.');

	const key = (await search.text()).match(/ShowAccountDetails\(\s*'([^']+)'\s*\)/)?.[1];
	if (!key) error(404, 'License record was not found.');

	const [detailsRes, qualifiersRes] = await Promise.all([
		fetch(`${BOARD}/Public/_ShowAccountDetails/?key=${key}&Source=Search`),
		fetch(`${BOARD}/Public/_ShowAccountQualifiers/?key=${key}`)
	]);
	if (!detailsRes.ok || !qualifiersRes.ok) error(502, 'The state license lookup is unavailable.');

	const details = await detailsRes.text();
	const qualifiers = await qualifiersRes.text();
	const qualifier = [...qualifiers.matchAll(/<tr>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>/g)].map(
		([, name, number, status]) => ({
			name: name.trim(),
			number: number.trim(),
			status: status.trim()
		})
	);

	return {
		source: BOARD,
		license: {
			name: field(details, 'Name'),
			number: field(details, 'License #'),
			type: field(details, 'Account Type'),
			expires: field(details, 'Expiration Date'),
			status: field(details, 'Status'),
			qualifier
		}
	};
};
