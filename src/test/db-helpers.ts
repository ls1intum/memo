import { Client } from 'pg';

const DB_URL =
  process.env.E2E_DB_URL ?? 'postgresql://postgres:memo@localhost:5433/memo';

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

export async function setUserProfile(
  id: string,
  email: string,
  name: string,
  role: 'USER' | 'ADMIN'
): Promise<void> {
  await withClient(async client => {
    await client.query(
      `UPDATE users SET email = $2, name = $3, role = $4 WHERE id = $1`,
      [id, email, name, role]
    );
  });
}

export async function deleteCompetenciesByTitlePrefix(
  prefix: string
): Promise<void> {
  await withClient(async client => {
    await client.query(
      `DELETE FROM competencies WHERE title LIKE $1 || '%'`,
      [prefix]
    );
  });
}

export async function deleteLearningResourcesByTitlePrefix(
  prefix: string
): Promise<void> {
  await withClient(async client => {
    await client.query(
      `DELETE FROM learning_resources WHERE title LIKE $1 || '%'`,
      [prefix]
    );
  });
}

export async function deleteUsersByEmailPrefix(prefix: string): Promise<void> {
  await withClient(async client => {
    await client.query(
      `DELETE FROM users WHERE email LIKE $1 || '%' AND email NOT IN ('e2e-user@memo.local', 'e2e-admin@memo.local')`,
      [prefix]
    );
  });
}

export async function deleteCompetencyResourceLinksForCompetencyPrefix(
  titlePrefix: string
): Promise<void> {
  await withClient(async client => {
    await client.query(
      `DELETE FROM competency_resource_links
       WHERE competency_id IN (SELECT id FROM competencies WHERE title LIKE $1 || '%')`,
      [titlePrefix]
    );
  });
}
