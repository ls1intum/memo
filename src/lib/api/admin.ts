import { apiClient } from './client';
import type { ImportResult, RelationshipImportRow } from './types';

export interface CompetencyImportRow {
  title: string;
  description?: string;
}

export const adminApi = {
  importCompetenciesJson: async (
    rows: CompetencyImportRow[]
  ): Promise<ImportResult> => {
    const response = await apiClient.post<ImportResult>(
      '/api/admin/competencies/import',
      rows
    );
    return response.data;
  },

  importCompetenciesFile: async (file: File): Promise<ImportResult> => {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post<ImportResult>(
      '/api/admin/competencies/import/file',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  importRelationshipsJson: async (rows: RelationshipImportRow[]): Promise<ImportResult> => {
    const response = await apiClient.post<ImportResult>(
      '/api/admin/relationships/import',
      rows
    );
    return response.data;
  },

  importRelationshipsFile: async (file: File): Promise<ImportResult> => {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post<ImportResult>(
      '/api/admin/relationships/import/file',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};
