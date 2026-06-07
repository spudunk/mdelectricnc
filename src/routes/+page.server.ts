import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { fail, type Actions } from '@sveltejs/kit';
import { contact, type Contact } from '$lib';
import { privateDevKeys as tsKeys } from '$lib/turnstile';

const turnstileSecret = dev
	? tsKeys.pass
	: env.PRIVATE_TURNSTILE_SITEKEY;

async function verifyTurnstile(token: string, remoteip?: string) {
	const verification = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				secret: turnstileSecret,
				response: token,
				...(remoteip && { remoteip })
			})
		}
	);
	if (!verification.ok) throw new Error('Turnstile verification request failed');
	return verification.json() as Promise<{ success: boolean;[key: string]: unknown }>;
}



export const actions = {
	verify: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const token = data.get('cf-turnstile-response')?.toString();

		if (!token) {
			return fail(400, { error: 'Missing verification token' });
		}

		const ip = getClientAddress?.();

		try {
			const result = await verifyTurnstile(token, ip);
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
