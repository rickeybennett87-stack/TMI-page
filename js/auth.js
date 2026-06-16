const ROLES_CLAIM = 'https://thessalonian-mandate-institute.org/roles';

let auth0Client = null;

async function initAuth() {
  auth0Client = await auth0.createAuth0Client({
    domain: AUTH0_CONFIG.domain,
    clientId: AUTH0_CONFIG.clientId,
    authorizationParams: AUTH0_CONFIG.authorizationParams,
    cacheLocation: AUTH0_CONFIG.cacheLocation
  });

  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);

    const claims = await auth0Client.getIdTokenClaims();
    const roles = (claims && claims[ROLES_CLAIM]) || [];

    if (roles.includes('admin')) {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
    return;
  }

  await updateNavAuth();
}

async function updateNavAuth() {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const existing = navLinks.querySelector('.nav-auth');
  if (existing) existing.remove();

  const authEl = document.createElement('div');
  authEl.className = 'nav-auth';
  authEl.style.display = 'flex';
  authEl.style.alignItems = 'center';
  authEl.style.gap = '1rem';

  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    authEl.innerHTML = `
      <span class="nav-user-name">${user.name || user.email}</span>
      <a href="/dashboard.html" class="nav-apply">Dashboard</a>
      <a href="#" class="nav-sign-out" onclick="signOut(); return false;">Sign Out</a>
    `;
  } else {
    authEl.innerHTML = `
      <a href="#" class="nav-apply" onclick="signIn(); return false;">Sign In</a>
    `;
  }

  navLinks.appendChild(authEl);
}

async function signIn() {
  await auth0Client.loginWithRedirect();
}

async function signOut() {
  await auth0Client.logout({
    logoutParams: { returnTo: window.location.origin }
  });
}

document.addEventListener('DOMContentLoaded', initAuth);
