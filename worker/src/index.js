const AUTH0_DOMAIN = 'dev-h2m4gq7r6orddrd0.us.auth0.com';
const ROLES_CLAIM = 'https://thessalonian-mandate-institute.org/roles';
const SUPABASE_URL = 'https://mwrazxkxmznvoijitqys.supabase.co';
const ALLOWED_ORIGIN = 'https://thessalonian-mandate-institute.org';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return respond(null, 204);
    }

    const origin = request.headers.get('Origin');
    if (origin !== ALLOWED_ORIGIN) {
      return respond({ error: 'Forbidden' }, 403);
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return respond({ error: 'Unauthorized' }, 401);
    }

    let payload;
    try {
      payload = await verifyJWT(authHeader.slice(7));
    } catch {
      return respond({ error: 'Invalid token' }, 401);
    }

    const roles = payload[ROLES_CLAIM] || [];
    if (!roles.includes('admin')) {
      return respond({ error: 'Forbidden — admin role required' }, 403);
    }

    const path = new URL(request.url).pathname;

    if (path === '/api/admin/stats')        return handleStats(env);
    if (path === '/api/admin/applications') return handleTable(env, 'applications', 'submitted_at');
    if (path === '/api/admin/members')      return handleTable(env, 'profiles', 'created_at');
    if (path === '/api/admin/progress')     return handleTable(env, 'cert_progress', 'created_at');

    return respond({ error: 'Not found' }, 404);
  }
};

async function verifyJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');
  const [headerB64, payloadB64, sigB64] = parts;

  const decode = b64 => JSON.parse(new TextDecoder().decode(
    Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  ));

  const header = decode(headerB64);
  const payload = decode(payloadB64);

  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');

  const jwksResp = await fetch(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`);
  const { keys } = await jwksResp.json();
  const jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('Signing key not found');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk', jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['verify']
  );

  const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = Uint8Array.from(
    atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
    c => c.charCodeAt(0)
  );

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, signingInput);
  if (!valid) throw new Error('Invalid signature');

  return payload;
}

async function supabaseFetch(env, path) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return resp.json();
}

async function handleTable(env, table, orderCol) {
  const data = await supabaseFetch(env, `${table}?order=${orderCol}.desc`);
  return respond(data);
}

async function handleStats(env) {
  const headers = {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'count=exact',
    'Range-Unit': 'items',
    'Range': '0-0'
  };

  const [apps, members, active, done] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/applications?select=id`, { method: 'HEAD', headers }),
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id`, { method: 'HEAD', headers }),
    fetch(`${SUPABASE_URL}/rest/v1/cert_progress?select=id&status=eq.in_progress`, { method: 'HEAD', headers }),
    fetch(`${SUPABASE_URL}/rest/v1/cert_progress?select=id&status=eq.completed`, { method: 'HEAD', headers })
  ]);

  const count = r => {
    const cr = r.headers.get('content-range');
    return cr ? (parseInt(cr.split('/')[1]) || 0) : 0;
  };

  return respond({
    applications: count(apps),
    members: count(members),
    inProgress: count(active),
    completed: count(done)
  });
}

function respond(data, status = 200) {
  return new Response(
    data !== null ? JSON.stringify(data) : null,
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      }
    }
  );
}
