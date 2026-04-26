import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { adminApi } from '@/lib/api/admin';
import {
  getAdminToken,
  getUserToken,
  authAs,
  clearAuth,
} from '@/test/fixtures';
import { deleteCompetenciesByTitlePrefix } from '@/test/db-helpers';

const PREFIX = `[e2e-admin-${Date.now()}]`;

describe('Admin Import API', () => {
  beforeAll(async () => {
    const token = await getAdminToken();
    authAs(token);
  });

  afterAll(async () => {
    clearAuth();
    await deleteCompetenciesByTitlePrefix(PREFIX);
  });

  it('imports competencies from JSON', async () => {
    const result = await adminApi.importCompetenciesJson([
      { title: `${PREFIX} json-1`, description: 'first' },
      { title: `${PREFIX} json-2`, description: 'second' },
    ]);
    expect(result).toMatchObject({
      imported: expect.any(Number),
      skipped: expect.any(Number),
      errors: expect.any(Array),
    });
    expect(result.imported).toBeGreaterThanOrEqual(2);
  });

  it('imports competencies from a CSV file upload', async () => {
    const csv = `title,description\n${PREFIX} csv-1,row1\n${PREFIX} csv-2,row2\n`;
    const file = new File([csv], 'comps.csv', { type: 'text/csv' });
    const result = await adminApi.importCompetenciesFile(file);
    expect(result.imported).toBeGreaterThanOrEqual(2);
  });

  it('imports competencies from a JSON file upload', async () => {
    const json = JSON.stringify([
      { title: `${PREFIX} jsonfile-1` },
      { title: `${PREFIX} jsonfile-2` },
    ]);
    const file = new File([json], 'comps.json', { type: 'application/json' });
    const result = await adminApi.importCompetenciesFile(file);
    expect(result.imported).toBeGreaterThanOrEqual(2);
  });

  it('blocks a non-admin user from importing', async () => {
    const userToken = await getUserToken();
    authAs(userToken);
    await expect(
      adminApi.importCompetenciesJson([{ title: `${PREFIX} denied` }])
    ).rejects.toThrow();
    authAs(await getAdminToken());
  });
});
