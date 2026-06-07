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
