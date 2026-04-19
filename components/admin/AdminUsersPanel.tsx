"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Pencil, PlusCircle, Trash2, X } from "lucide-react";

type AdminRole = "SUPER_ADMIN" | "OPERATOR" | "EDITOR" | "PARTNER_MANAGER";
type AdminStatus = "ACTIVE" | "INACTIVE";

type PublicAdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "최고 관리자",
  OPERATOR: "운영자",
  EDITOR: "편집자",
  PARTNER_MANAGER: "파트너 관리자",
};

const STATUS_LABEL: Record<AdminStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ko-KR");
  } catch {
    return "-";
  }
}

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<PublicAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<PublicAdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<PublicAdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const json = (await res.json()) as { success: boolean; data?: PublicAdminUser[]; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "불러오기 실패");
      setUsers(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: PublicAdminUser) => {
    if (!confirm(`'${user.name} (${user.email})' 관리자를 삭제할까요?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "삭제 실패");
      fetchUsers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const handleToggleStatus = async (user: PublicAdminUser) => {
    const next: AdminStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "상태 변경 실패");
      fetchUsers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "상태 변경 실패");
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">관리자 계정 관리</h2>
          <p className="mt-1 text-sm text-slate-500">
            로그인 가능한 관리자 계정을 추가·수정·비활성화할 수 있습니다. 최고 관리자(SUPER_ADMIN) 만
            이 화면을 사용할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <PlusCircle className="h-4 w-4" />
          관리자 추가
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {["이름", "이메일", "권한", "상태", "마지막 로그인", "생성일", "운영"].map((c) => (
                <th key={c} className="px-4 py-4 text-left">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  불러오는 중…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  등록된 관리자가 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">{ROLE_LABEL[user.role]}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      {STATUS_LABEL[user.status]}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {formatDateTime(user.lastLoginAt)}
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditTarget(user)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        수정
                      </button>
                      <button
                        onClick={() => setResetTarget(user)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        비번
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            fetchUsers();
          }}
        />
      ) : null}

      {editTarget ? (
        <EditUserModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            fetchUsers();
          }}
        />
      ) : null}

      {resetTarget ? (
        <ResetPasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onSaved={() => {
            setResetTarget(null);
            fetchUsers();
          }}
        />
      ) : null}
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AdminRole>("OPERATOR");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, role, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "추가 실패");
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "추가 실패");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title="관리자 추가" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Field label="이메일">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
            placeholder="admin@goyangmice.kr"
          />
        </Field>
        <Field label="이름">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </Field>
        <Field label="권한">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          >
            {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="비밀번호 (6자 이상)">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </Field>
        {err ? <p className="text-xs text-rose-600">{err}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={busy || !email || !name || password.length < 6}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "추가 중…" : "추가"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: PublicAdminUser;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<AdminRole>(user.role);
  const [status, setStatus] = useState<AdminStatus>(user.status);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, role, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "수정 실패");
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "수정 실패");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title={`${user.email} 수정`} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Field label="이름">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </Field>
        <Field label="권한">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          >
            {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="상태">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminStatus)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          >
            {(Object.keys(STATUS_LABEL) as AdminStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>
        {err ? <p className="text-xs text-rose-600">{err}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={busy || !name}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onSaved,
}: {
  user: PublicAdminUser;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "비밀번호 변경 실패");
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "비밀번호 변경 실패");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title={`${user.email} 비밀번호 변경`} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Field label="새 비밀번호 (6자 이상)">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </Field>
        {err ? <p className="text-xs text-rose-600">{err}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={busy || pw.length < 6}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "변경 중…" : "변경"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
