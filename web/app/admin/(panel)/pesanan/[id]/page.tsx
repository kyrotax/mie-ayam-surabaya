"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/lib/admin/types";
import { getOrderByIdService, deleteOrderService } from "@/lib/admin/services/order-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";
import {
  ArrowLeft,
  Camera,
  Edit,
  Trash2,
  Calendar,
  User,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

export default function PesananDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { sukses, bahaya } = useToast();
  const orderId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrderByIdService(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handleDelete = async () => {
    if (!order) return;
    try {
      await deleteOrderService(order.id);
      sukses(`Pesanan ${order.orderNumber} berhasil dihapus.`);
      router.push("/admin/pesanan");
    } catch {
      bahaya("Gagal menghapus pesanan.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#3B2416]">Pesanan Tidak Ditemukan</h3>
        <p className="text-xs text-[#6B5240]">ID pesanan yang Anda cari mungkin telah dihapus.</p>
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8D0D00] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5240] hover:text-[#8D0D00] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>

        {/* Aksi Owner: Hapus Pesanan */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B42318]/30 hover:bg-[#FBE4E1] text-xs font-semibold text-[#B42318] transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Pesanan</span>
          </button>
        </div>
      </div>

      <PageHeader
        title={`Detail Pesanan ${order.orderNumber}`}
        description="Rincian item terverifikasi dan metadata pencatatan kasir."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Foto Asli (Jika ada) */}
        {order.photoUrl && (
          <div className="md:col-span-5 p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#3B2416]/10">
              <Camera className="w-4 h-4 text-[#8D0D00]" />
              <span className="font-serif font-bold text-xs text-[#3B2416]">
                Foto Catatan Asli
              </span>
            </div>
            <div className="relative w-full h-[320px] bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src={order.photoUrl}
                alt="Foto catatan"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Rincian Transaksi */}
        <div className={order.photoUrl ? "md:col-span-7 space-y-4" : "md:col-span-12 space-y-4"}>
          {/* Metadata Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#3B2416]/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#E4F2E5] text-[#276B2B]">
                  Terkonfirmasi
                </span>
                <span className="text-xs font-medium text-[#6B5240]">
                  Sumber: {order.source === "foto" ? "📸 Foto Catatan AI" : "✍️ Input Manual"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6B5240] block">Waktu Transaksi</span>
                <span className="font-bold text-[#3B2416]">
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              <div>
                <span className="text-[#6B5240] block">Petugas Kasir</span>
                <span className="font-bold text-[#3B2416]">{order.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Rincian Item */}
          <div className="p-5 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#3B2416]">Daftar Item Sajian</h4>
            <div className="divide-y divide-[#3B2416]/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#3B2416]">
                      {item.name} <span className="text-[#8D0D00]">x{item.qty}</span>
                    </div>
                    {item.note && (
                      <div className="text-[11px] text-[#8A5A00] italic">{item.note}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#3B2416]">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </div>
                    <div className="text-[10px] text-[#6B5240]">
                      @ Rp {item.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Pembayaran */}
            <div className="pt-3 border-t-2 border-[#3B2416]/10 flex items-center justify-between">
              <span className="font-bold text-sm text-[#3B2416]">Total Pembayaran</span>
              <span className="font-serif font-bold text-xl text-[#8D0D00]">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Hapus Pesanan */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pesanan?"
        message={`Apakah Anda yakin ingin menghapus data pesanan ${order.orderNumber}?`}
        confirmText="Hapus Pesanan"
        isDanger={true}
      />
    </div>
  );
}

