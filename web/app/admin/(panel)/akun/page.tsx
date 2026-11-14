"use client";

import React, { useState, useEffect } from "react";
import { User, Role } from "@/lib/admin/types";
import {
  getUserListService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "@/lib/admin/services/user-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RoleBadge } from "@/components/admin/ui/RoleBadge";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { InputField, SelectField } from "@/components/admin/ui/Field";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  UserPlus,
  Shield,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminAkunPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Simulasi current user yang sedang login (Owner)
  const currentUserId = "usr_owner_1";
  const currentUserRole: Role = "owner";

  // Modal Tambah Pengguna
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<Role>("admin");
  const [formPassword, setFormPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Dialog Konfirmasi Hapus
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserListService();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(pass);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError("Semua field wajib diisi.");
      return;
    }

    try {
      const created = await createUserService(
        {
          name: formName,
          email: formEmail,
          role: formRole,
          status: "active",
          password: formPassword,
        },
        currentUserRole
      );
      setUsers((prev) => [...prev, created]);
      sukses(`Akun "${created.name}" berhasil dibuat.`);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Gagal menambah pengguna.");
    }
  };

  const handleToggleStatus = async (targetUser: User) => {
    const nextStatus = targetUser.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateUserService(
        targetUser.id,
        { status: nextStatus },
        currentUserId,
        currentUserRole
      );
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      sukses(`Status akun "${targetUser.name}" diubah ke ${nextStatus === "active" ? "Aktif" : "Nonaktif"}.`);
    } catch (err: any) {
      bahaya(err.message || "Gagal mengubah status akun.");
    }
  };

  const handleChangeRole = async (targetUser: User, nextRole: Role) => {
    try {
      const updated = await updateUserService(
        targetUser.id,
        { role: nextRole },
        currentUserId,
        currentUserRole
      );
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      sukses(`Peran "${targetUser.name}" diubah menjadi ${nextRole}.`);
    } catch (err: any) {
      bahaya(err.message || "Gagal mengubah peran akun.");
    }
  };

  const handleResetPassword = async (targetUser: User) => {
    try {
      const newTempPass = "Reset123!";
      await updateUserService(
        targetUser.id,
        { password: newTempPass },
        currentUserId,
        currentUserRole
      );
      sukses(`Kata sandi akun "${targetUser.name}" di-reset menjadi "${newTempPass}".`);
    } catch (err: any) {
      bahaya(err.message || "Gagal mereset kata sandi.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUserService(deleteTarget.id, currentUserId, currentUserRole);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      sukses(`Akun "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    } catch (err: any) {
      bahaya(err.message || "Gagal menghapus pengguna.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Akun & Hak Akses"
        description="Atur pengguna yang berhak masuk ke sistem, peran Owner atau Admin, dan status akun."
        action={
          <button
            type="button"
            onClick={() => {
              setFormName("");
              setFormEmail("");
              setFormRole("admin");
              setFormPassword("");
              setFormError(null);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        }
      />

      {/* Tabel Pengguna */}
      <div className="overflow-hidden rounded-2xl border border-[#3B2416]/10 bg-white shadow-xs">
        <table className="w-full text-left text-sm hidden md:table">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#3B2416]/10 text-xs font-bold uppercase text-[#3B2416]">
              <th className="py-3 px-4">Nama Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Login Terakhir</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2416]/10 text-xs">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="py-3 px-4 font-bold text-[#3B2416]">
                    {u.name} {isSelf && <span className="text-[10px] text-[#8A5A00]">(Anda)</span>}
                  </td>
                  <td className="py-3 px-4 text-[#6B5240] font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => handleToggleStatus(u)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] transition ${
                        u.status === "active"
                          ? "bg-[#E4F2E5] text-[#276B2B]"
                          : "bg-[#FBE4E1] text-[#B42318]"
                      } ${isSelf ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                    >
                      {u.status === "active" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Nonaktif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[#6B5240]">
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Belum pernah"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResetPassword(u)}
                        className="p-1.5 rounded-lg text-[#6B5240] hover:text-[#3B2416] hover:bg-[#FAF8F5]"
                        title="Reset Kata Sandi"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-lg text-[#B42318] hover:bg-[#FBE4E1] disabled:opacity-30 disabled:hover:bg-transparent"
                        title={isSelf ? "Tidak bisa menghapus akun sendiri" : "Hapus Akun"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile View Card */}
        <div className="md:hidden divide-y divide-[#3B2416]/10">
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <div key={u.id} className="p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-[#3B2416]">
                      {u.name} {isSelf && <span className="text-[10px] text-[#8A5A00]">(Anda)</span>}
                    </div>
                    <div className="font-mono text-[#6B5240] text-[11px]">{u.email}</div>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#3B2416]/5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      u.status === "active"
                        ? "bg-[#E4F2E5] text-[#276B2B]"
                        : "bg-[#FBE4E1] text-[#B42318]"
                    }`}
                  >
                    {u.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleResetPassword(u)}
                      className="px-2.5 py-1 rounded-lg border border-[#3B2416]/15 text-[11px] font-semibold"
                    >
                      Reset Sandi
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        className="px-2.5 py-1 rounded-lg bg-[#FBE4E1] text-[#B42318] text-[11px] font-semibold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Akun Pengguna Baru"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <InputField
            label="Nama Lengkap"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="mis. Budi Santoso"
          />

          <InputField
            label="Alamat Email"
            type="email"
            required
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="budi@mieayam.test"
          />

          <SelectField
            label="Peran Akun"
            value={formRole}
            onChange={(e) => setFormRole(e.target.value as Role)}
          >
            <option value="admin">Admin Kasir (Hanya Akses Operasional)</option>
            <option value="owner">Owner (Akses Penuh Seluruh Sistem)</option>
          </SelectField>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase text-[#3B2416]">
                Kata Sandi Sementara
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-semibold text-[#8D0D00] hover:underline"
              >
                Buat Otomatis
              </button>
            </div>
            <input
              type="text"
              required
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="Minimal 8 karakter..."
              className="w-full h-11 px-3.5 rounded-xl border border-[#3B2416]/25 font-mono text-sm"
            />
          </div>

          <div className="pt-4 border-t border-[#3B2416]/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-xs font-semibold text-[#3B2416]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold transition"
            >
              Buat Pengguna
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        title="Hapus Akun Pengguna?"
        message={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.name}" (${deleteTarget?.email})?`}
        confirmText="Hapus Akun"
        isDanger={true}
      />
    </div>
  );
}

