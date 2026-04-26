const KEYCLOAK_URL = process.env.E2E_KEYCLOAK_URL ?? 'http://localhost:8081';
const REALM = process.env.E2E_KEYCLOAK_REALM ?? 'memo';
const CLIENT_ID = process.env.E2E_KEYCLOAK_CLIENT_ID ?? 'memo-client';
const ADMIN_USERNAME = process.env.E2E_KEYCLOAK_ADMIN ?? 'admin';
const ADMIN_PASSWORD = process.env.E2E_KEYCLOAK_ADMIN_PASSWORD ?? 'admin';

export async function fetchKeycloakToken(
  username: string,
  password: string
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: CLIENT_ID,
    username,
    password,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Keycloak token request failed for ${username}: ${response.status} ${text}`
    );
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error(`Keycloak response missing access_token for ${username}`);
  }
  return json.access_token;
}

async function fetchAdminToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: 'admin-cli',
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });
  const response = await fetch(
    `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Keycloak master admin token: ${response.status}`
    );
  }
  const json = (await response.json()) as { access_token: string };
  return json.access_token;
}

interface EnsureUserOpts {
  username: string;
  email: string;
  password: string;
  realmRoles: string[];
}

async function getUserIdByUsername(
  adminToken: string,
  username: string
): Promise<string | null> {
  const response = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${encodeURIComponent(username)}&exact=true`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  if (!response.ok) {
    throw new Error(`Failed to look up user ${username}: ${response.status}`);
  }
  const arr = (await response.json()) as Array<{ id: string }>;
  return arr.length > 0 ? arr[0].id : null;
}

async function getRealmRole(
  adminToken: string,
  roleName: string
): Promise<{ id: string; name: string }> {
  const response = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${encodeURIComponent(roleName)}`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  if (!response.ok) {
    throw new Error(`Realm role ${roleName} not found: ${response.status}`);
  }
  return response.json();
}

async function ensureUser(
  adminToken: string,
  opts: EnsureUserOpts
): Promise<void> {
  let userId = await getUserIdByUsername(adminToken, opts.username);
  if (userId) return;

  const createResponse = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        username: opts.username,
        email: opts.email,
        firstName: 'E2E',
        lastName: opts.username,
        enabled: true,
        emailVerified: true,
        credentials: [
          { type: 'password', value: opts.password, temporary: false },
        ],
      }),
    }
  );
  if (!createResponse.ok && createResponse.status !== 409) {
    const text = await createResponse.text();
    throw new Error(
      `Failed to create user ${opts.username}: ${createResponse.status} ${text}`
    );
  }

  userId = await getUserIdByUsername(adminToken, opts.username);
  if (!userId) {
    throw new Error(`Created user ${opts.username} but could not look it up`);
  }

  if (opts.realmRoles.length > 0) {
    const roles = await Promise.all(
      opts.realmRoles.map(name => getRealmRole(adminToken, name))
    );
    const assignResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(roles),
      }
    );
    if (!assignResponse.ok) {
      const text = await assignResponse.text();
      throw new Error(
        `Failed to assign roles to ${opts.username}: ${assignResponse.status} ${text}`
      );
    }
  }
}

export async function ensureE2eUsers(): Promise<void> {
  const adminToken = await fetchAdminToken();
  await ensureUser(adminToken, {
    username: 'e2e-user',
    email: 'e2e-user@memo.local',
    password: 'e2e-user',
    realmRoles: ['USER'],
  });
  await ensureUser(adminToken, {
    username: 'e2e-admin',
    email: 'e2e-admin@memo.local',
    password: 'e2e-admin',
    realmRoles: ['ADMIN', 'USER'],
  });
}
