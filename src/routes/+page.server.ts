import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { fail } from '@sveltejs/kit';
import { contact } from '$lib';

const turnstileSecret = dev
	? '1x0000000000000000000000000000000AA'
	: env.PRIVATE_TURNSTILE_SITEKEY;

export const actions = {
	verify: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('cf-turnstile-response');

		if (!token) {
			return fail(400, { error: 'Missing verification token' });
		}

		const verification = await fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					secret: turnstileSecret,
					response: token
				})
			}
		);

		const result = await verification.json();

		if (result.success) {
			return {
				success: true,
				phone: contact.phone,
				email: contact.email,
				tel: contact.tel
			};
		}

		return fail(400, { error: 'Human verification failed' });
	}
};
