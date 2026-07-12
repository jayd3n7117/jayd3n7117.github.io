import type { APIRoute } from 'astro';

import { buildRobotsTxt } from '../config/site';

export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  new Response(buildRobotsTxt(site ?? new URL('http://localhost:4321')), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
