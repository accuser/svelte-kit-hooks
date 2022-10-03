import type { Handle } from '@sveltejs/kit';
import pino from 'pino';
import pretty from 'pino-pretty';

const injectLogger: Handle = async ({ event, resolve }) => {
	const {
		locals: { loggerOptions = { base: undefined }, requestId }
	} = event;

	event.locals.logger = pino(
		{
			name: requestId,
			...loggerOptions
		},
		pretty()
	);

	return resolve(event);
};

export default injectLogger;
