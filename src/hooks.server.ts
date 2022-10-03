import { logger } from '$lib/logger';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(logger);
