import type { Handle } from '@sveltejs/kit';

const logRequest: Handle = async ({ event, resolve }) => {
	const {
		locals: { logger },
		request: { method },
		url: { pathname }
	} = event;

	logger.info(`${method} ${pathname}`);

	const response = await resolve(event);

	logger.info(`${response.status}`);

	return response;
};

export default logRequest;
