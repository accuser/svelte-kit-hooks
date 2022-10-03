/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		logger: import('pino').BaseLogger;
		loggerOptions: import('pino').LoggerOptions;
		requestId: string;
	}

	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
