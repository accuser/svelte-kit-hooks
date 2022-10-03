import type { Handle, HandleFetch } from '@sveltejs/kit';

const X_REQUEST_ID = 'X-Request-ID';

const handleFetch: HandleFetch = ({ event, request, fetch }) => {
	const {
		locals: { requestId }
	} = event;

	if (!request.headers.has(X_REQUEST_ID)) {
		request.headers.set(X_REQUEST_ID, requestId);
	}

	return fetch(request);
};

/**
 * Get the value of the `X-Request-Id` header and store it in the event's
 * `locals` object.
 *
 * If there is no `X-Request-Id` header, a new request id is generated.
 */
const identifyRequest: Handle = async ({ event, resolve }) => {
	const {
		request: { headers }
	} = event;

	event.locals.requestId = headers.get(X_REQUEST_ID) ?? Math.random().toString(36).slice(2, 10);

	const response = await resolve(event);

	response.headers.set(X_REQUEST_ID, event.locals.requestId);

	return response;
};

export default identifyRequest;
export { handleFetch, identifyRequest };
