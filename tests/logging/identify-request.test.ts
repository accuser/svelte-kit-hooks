import { beforeEach, describe, expect, it, vi } from 'vitest';
import identifyRequest from '$lib/logger/identify-request';
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;

declare module 'vitest' {
	export interface TestContext {
		event: RequestEvent;
		resolve: (
			event: RequestEvent<Partial<Record<string, string>>>,
			opts?: ResolveOptions | undefined
		) => MaybePromise<Response>;
		response: Response;
	}
}

describe('identifyRequest', async () => {
	beforeEach(async (context) => {
		context.event = {
			locals: {
				requestId: ''
			},
			request: {
				headers: {
					get: vi.fn().mockReturnValue(null)
				}
			}
		} as unknown as RequestEvent;

		context.response = { headers: { set: vi.fn() } } as unknown as Response;

		context.resolve = vi.fn().mockResolvedValue(context.response);
	});

	it('is a handler', async ({ event, resolve }) => {
		await identifyRequest({ event, resolve });

		expect(resolve).toHaveBeenCalledWith(event);
	});

	it('gets the `X-Request-ID` header', async ({ event, resolve }) => {
		await identifyRequest({ event, resolve });

		expect(event.request.headers.get).toHaveBeenCalledWith('X-Request-ID');
	});

	it('sets the `X-Request-ID` header', async ({ event, resolve, response }) => {
		event.request.headers.get = vi.fn().mockReturnValue('beef');

		await identifyRequest({ event, resolve });

		expect(response.headers.set).toHaveBeenCalledWith('X-Request-ID', 'beef');
	});

	describe('when the `X-Request-ID` header is set', async () => {
		it('sets the `event.locals.requestId` with the value of the `X-Request-ID` header', async ({
			event,
			resolve
		}) => {
			event.request.headers.get = vi.fn().mockReturnValue('beef');

			await identifyRequest({ event, resolve });

			expect(event.locals.requestId).toEqual('beef');
		});
	});

	describe('when the `X-Request-ID` header is not set', async () => {
		it('sets the `event.locals.requestId` with the a random value', async ({ event, resolve }) => {
			await identifyRequest({ event, resolve });

			expect(event.locals.requestId).toMatch(/[a-z0-9]{8}/);
		});
	});
});
