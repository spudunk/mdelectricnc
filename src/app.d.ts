// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'unplugin-icons/types/svelte';

declare global {
	
	interface Window {
		turnstile: {
			render: (container: string | HTMLElement, options: TurnstileOptions) => string;
			reset: (widgetId?: string) => void;
			getResponse: (widgetId?: string) => string | undefined;
			remove: (widgetId?: string) => void;
		};
	}

	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Define the Turnstile options interface for type safety
interface TurnstileOptions {
	sitekey: string;
	callback?: (token?: string) => void;
	'error-callback'?: (errorCode: string) => void;
	'expired-callback'?: () => void;
	'timeout-callback'?: () => void;
	theme?: 'light' | 'dark' | 'auto';
	size?: 'normal' | 'invisible';
	// Add other optional Turnstile parameters as needed
}

export { };
