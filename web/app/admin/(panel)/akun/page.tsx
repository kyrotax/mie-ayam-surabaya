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
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pencil,
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

  // Modal Edit Profil Pengguna
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("admin");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editError, setEditError] = useState<string | null>(null);

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
          name: formName.trim(),
          email: formEmail.trim(),
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

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditError(null);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);

    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Nama dan email wajib diisi.");
      return;
    }

    try {
      const updated = await updateUserService(
        editingUser.id,
        {
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
          status: editStatus,
        },
        currentUserId,
        currentUserRole
      );
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      sukses(`Profil akun "${updated.name}" berhasil diperbarui.`);
      setEditingUser(null);
    } catch (err: any) {
      setEditError(err.message || "Gagal memperbarui profil akun.");
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
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kelola Akun & Hak Akses"
        description="Kelola akun karyawan, atur hak akses (Owner / Admin Kasir), dan edit profil profil pengguna secara fleksibel."
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-[#FFF8E7] text-xs font-semibold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Karyawan / Pengguna</span>
          </button>
        }
      />

      {/* Tabel Pengguna */}
      <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-white shadow-xs">
        <table className="w-full text-left text-sm hidden md:table">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#D4AF37]/20 text-xs font-bold uppercase text-[#2C1810]">
              <th className="py-3 px-4">Nama Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Login Terakhir</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15 text-xs">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3 px-4 font-bold text-[#2C1810]">
                    {u.name} {isSelf && <span className="text-[10px] text-[#8A5A00]">(Anda)</span>}
                  </td>
                  <td className="py-3 px-4 text-[#6B4423] font-mono">{u.email}</td>
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
                  <td className="py-3 px-4 text-[#6B4423]">
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
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg text-[#6B4423] hover:text-[#2C1810] hover:bg-[#FAF7F2] transition"
                        title="Edit Profil Karyawan"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(u)}
                        className="p-1.5 rounded-lg text-[#6B4423] hover:text-[#2C1810] hover:bg-[#FAF7F2] transition"
                        title="Reset Kata Sandi"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-lg text-[#B42318] hover:bg-[#FBE4E1] disabled:opacity-30 disabled:hover:bg-transparent transition"
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
        <div className="md:hidden divide-y divide-[#D4AF37]/15">
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <div key={u.id} className="p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-[#2C1810]">
                      {u.name} {isSelf && <span className="text-[10px] text-[#8A5A00]">(Anda)</span>}
                    </div>
                    <div className="font-mono text-[#6B4423] text-[11px]">{u.email}</div>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/15">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      u.status === "active"
                        ? "bg-[#E4F2E5] text-[#276B2B]"
                        : "bg-[#FBE4E1] text-[#B42318]"
                    }`}
                  >
                    {u.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(u)}
                      className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 text-[11px] font-semibold text-[#2C1810] hover:bg-[#FAF7F2]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResetPassword(u)}
                      className="px-2 py-1 rounded-lg border border-[#2C1810]/15 text-[11px] font-semibold text-[#6B4423]"
                    >
                      Reset
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        className="px-2 py-1 rounded-lg bg-[#FBE4E1] text-[#B42318] text-[11px] font-semibold"
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

      {/* Modal Edit Profil Pengguna */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit Profil Pengguna"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          {editError && (
            <div className="p-3 rounded-xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <InputField
            label="Nama Lengkap"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="mis. Budi Santoso"
          />

          <InputField
            label="Alamat Email"
            type="email"
            required
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="budi@mieayam.test"
          />

          <SelectField
            label="Peran Akun"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as Role)}
          >
            <option value="admin">Admin Kasir (Akses Operasional)</option>
            <option value="owner">Owner (Akses Penuh Seluruh Sistem)</option>
          </SelectField>

          <SelectField
            label="Status Akun"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as any)}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </SelectField>

          <div className="pt-4 border-t border-[#D4AF37]/20 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-xl border border-[#2C1810]/20 text-xs font-semibold text-[#2C1810] hover:bg-[#FAF7F2]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white text-xs font-semibold transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah Pengguna */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Akun Karyawan / Pengguna Baru"
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
            placeholder="mis. Siti Rahma"
          />

          <InputField
            label="Alamat Email"
            type="email"
            required
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="siti@mieayam.test"
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
              <label className="text-xs font-semibold uppercase text-[#2C1810]">
                Kata Sandi Sementara
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-semibold text-[#8B0000] hover:underline"
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
              className="w-full h-11 px-3.5 rounded-xl border border-[#2C1810]/20 bg-white text-[#2C1810] font-mono text-sm"
            />
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/20 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#2C1810]/20 text-xs font-semibold text-[#2C1810] hover:bg-[#FAF7F2]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white text-xs font-semibold transition"
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
