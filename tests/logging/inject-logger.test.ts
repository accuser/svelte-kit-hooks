import { beforeEach, describe, expect, it, vi } from 'vitest';
import logRequest from '$lib/logger/log-request';
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

describe('logRequest', async () => {
	beforeEach(async (context) => {
		context.event = {
			locals: {
				logger: {
					info: vi.fn()
				}
			},
			request: { method: 'GET' },
			url: { pathname: '/' }
		} as unknown as RequestEvent;

		context.resolve = vi.fn().mockResolvedValue({ status: 200 });
	});

	it('is a handler', async ({ event, resolve }) => {
		await logRequest({ event, resolve });

		expect(resolve).toHaveBeenCalledWith(event);
	});

	it('logs the request', async ({ event, resolve }) => {
		await logRequest({ event, resolve });

		expect(event.locals.logger.info).toBeCalledWith('GET /');
	});

	it('logs the response', async ({ event, resolve }) => {
		await logRequest({ event, resolve });

		expect(event.locals.logger.info).toBeCalledWith('200');
	});
});
