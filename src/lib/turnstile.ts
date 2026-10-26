
export const publicKey = '0x4AAAAAAFnUcCCNoSQx9OEr'


// These are public dev keys, not secret
export const privateDevKeys = {
  pass: '1x0000000000000000000000000000000AA',
  fail: '2x0000000000000000000000000000000AA',
  used: '3x0000000000000000000000000000000AA'
}

export const publicDevKeys = {
	pass: '1x00000000000000000000AA',
	fail: '2x00000000000000000000AB',
	challenge: '3x00000000000000000000FF'
}



export interface TurnstileOptions {
	sitekey: string;
	onSuccess?: () => void;
	onError?: (errorCode: string) => void;
	onTimeout?: () => void;
	onExpired?: () => void;
	ref?: (ctrl: { reset: () => void }) => void;
}

export function turnstile(
	node: HTMLElement,
	{ sitekey, onSuccess, onError, onTimeout, onExpired, ref }: TurnstileOptions
) {
	let widget: string | undefined;
	let cancelled = false;

	const reset = () => {
		if (widget && window.turnstile) {
			window.turnstile.reset(widget);
		}
	};

	const render = () => {
		if (cancelled) return;
		const api = window.turnstile;
		if (api) {
			widget = api.render(node, {
				sitekey,
				theme: 'dark',
				callback: () => {
					onSuccess?.();
					node.closest('form')?.requestSubmit();
				},
				'error-callback': (errorCode: string) => onError?.(errorCode),
				'timeout-callback': () => onTimeout?.(),
				'expired-callback': () => onExpired?.()
			});
			ref?.({ reset });
		} else {
			setTimeout(render, 100);
		}
	};

	render();

	return {
		destroy() {
			cancelled = true;
			if (widget && window.turnstile) {
				window.turnstile.remove(widget);
			}
		}
	};
}

