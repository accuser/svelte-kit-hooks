import { beforeEach, describe, expect, it, vi } from 'vitest';
import injectLogger from '$lib/logger/inject-logger';
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;

declare module 'vitest' {
	export interface TestContext {
		event: RequestEvent;
		resolve: (
			event: RequestEvent<Partial<Record<string, string>>>,
			opts?: ResolveOptions | undefined
		) => MaybePromise<Response>;
	}
}

describe('injectLogger', async () => {
	beforeEach(async (context) => {
		context.event = {
			locals: {
				loggerOptions: {},
				requestId: 'beef'
			}
		} as unknown as RequestEvent;

		context.resolve = vi.fn();
	});

	it('is a handler', async ({ event, resolve }) => {
		await injectLogger({ event, resolve });

		expect(resolve).toHaveBeenCalledWith(event);
	});

	it('sets `event.locals.logger`', async ({ event, resolve }) => {
		await injectLogger({ event, resolve });

		expect(event.locals.logger).toBeTruthy();
	});
});
