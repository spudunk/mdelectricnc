import { PRIVATE_TURNSTILE_SITEKEY as turnstileSecret } from '$env/static/private';
import { fail } from '@sveltejs/kit';

// Dev secret that always passes (must match the dev sitekey on the client)
// const turnstileSecret = '1x0000000000000000000000000000000AA';

export const actions = {
	verify: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('cf-turnstile-response');

		if (!token) {
			return fail(400, { error: 'Missing verification token' });
		}

		// For dev key, the test secret always succeeds, but to make local testing
		// completely reliable we short-circuit here.
		if (turnstileSecret === '1x0000000000000000000000000000000AA') {
			return {
				success: true,
				phone: '(541) 555-0123',
				email: 'info@atlasplumbing.com',
				tel: '+15415550123'
			};
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
				phone: '(541) 555-0123',
				email: 'info@atlasplumbing.com',
				tel: '+15415550123'
			};
		}

		return fail(400, { error: 'Human verification failed' });
	}
};
