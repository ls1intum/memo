import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api/users';
import type { User } from '@/lib/api/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function anonId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export function RolesPage() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) =>
      usersApi.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role updated');
    },
    onError: () => toast.error('Failed to update role'),
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 -top-24 h-144 w-xl -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-88 w-88 rounded-[40%] bg-linear-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-4xl px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/admin"
            className="flex items-center gap-1 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">Roles</span>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Roles
            </h1>
            <p className="text-sm text-slate-500">
              Manage user roles. No personal data is displayed.
            </p>
          </div>
          {data.length > 0 && (
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {data.length} total
            </span>
          )}
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : data.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    ID
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">
                    Joined
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Change role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((u: User) => (
                  <tr
                    key={u.id}
                    className="group align-middle hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3 pr-6 font-mono text-xs text-slate-400">
                      {anonId(u.id)}
                    </td>
                    <td className="py-3 pr-6">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center rounded-full bg-[#0a4da2]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0a4da2]">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-6 text-xs text-slate-400 hidden sm:table-cell">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() =>
                          updateRole.mutate({
                            id: u.id,
                            role: u.role === 'ADMIN' ? 'USER' : 'ADMIN',
                          })
                        }
                        disabled={updateRole.isPending}
                        className="rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0a4da2]/40 hover:text-[#0a4da2] disabled:opacity-50"
                      >
                        {u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
