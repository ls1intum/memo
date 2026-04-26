import { apiClient } from '@/lib/api/client';
import { fetchKeycloakToken, ensureE2eUsers } from './keycloak-helpers';
import { setUserProfile } from './db-helpers';

let usersBootstrapped = false;
async function bootstrap(): Promise<void> {
  if (usersBootstrapped) return;
  await ensureE2eUsers();
  usersBootstrapped = true;
}

const USER_EMAIL = 'e2e-user@memo.local';
const USER_PASSWORD = 'e2e-user';
const ADMIN_EMAIL = 'e2e-admin@memo.local';
const ADMIN_PASSWORD = 'e2e-admin';

let userToken: string | undefined;
let adminToken: string | undefined;
let userId: string | undefined;
let adminId: string | undefined;

export interface MeResponse {
  id: string;
  role: 'USER' | 'ADMIN';
}

async function callMe(token: string): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getUserToken(): Promise<string> {
  if (!userToken) {
    await bootstrap();
    userToken = await fetchKeycloakToken(USER_EMAIL, USER_PASSWORD);
    const me = await callMe(userToken);
    userId = me.id;
    await setUserProfile(me.id, USER_EMAIL, 'E2E User', 'USER');
  }
  return userToken;
}

export async function getAdminToken(): Promise<string> {
  if (!adminToken) {
    await bootstrap();
    adminToken = await fetchKeycloakToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    const me = await callMe(adminToken);
    adminId = me.id;
    await setUserProfile(me.id, ADMIN_EMAIL, 'E2E Admin', 'ADMIN');
  }
  return adminToken;
}

export async function getUserId(): Promise<string> {
  if (!userId) await getUserToken();
  return userId!;
}

export async function getAdminId(): Promise<string> {
  if (!adminId) await getAdminToken();
  return adminId!;
}

export function authAs(token: string): void {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuth(): void {
  delete apiClient.defaults.headers.common.Authorization;
}
