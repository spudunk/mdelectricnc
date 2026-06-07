import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { fail, type Actions } from '@sveltejs/kit';
import { contact, type Contact } from '$lib';

const turnstileSecret = dev
	? '1x0000000000000000000000000000000AA' // always pass
	// ? '2x0000000000000000000000000000000AA' // always fail
	// ? '3x0000000000000000000000000000000AA' // token already spent
	: env.PRIVATE_TURNSTILE_SITEKEY;

async function verifyTurnstile(token: string) {
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
	if (!verification.ok) throw new Error('Turnstile verification request failed');
	return verification.json() as Promise<{ success: boolean; [key: string]: unknown }>;
}



export const actions = {
	verify: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('cf-turnstile-response')?.toString();

		if (!token) {
			return fail(400, { error: 'Missing verification token' });
		}

		try {
			const result = await verifyTurnstile(token);
			if (result.success) {
				return {
					success: true,
					email: contact.email,
					...(contact.showTel && { phone: contact.phone, tel: contact.tel })
				} satisfies { success: true } & Contact;
			}
		} catch {
			// fall through to error below
		}

		return fail(400, { error: 'Human verification failed' });
	}
} satisfies Actions;
