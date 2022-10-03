import { sequence } from '@sveltejs/kit/hooks';
import { identifyRequest, handleFetch } from './identify-request.js';
import injectLogger from './inject-logger.js';
import logRequest from './log-request.js';

const logger = sequence(identifyRequest, injectLogger, logRequest);

export default logger;
export { handleFetch, logger };
