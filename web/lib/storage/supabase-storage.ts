import { supabase } from "@/src/supabaseClient";

export const BUCKET_NAME = "mie-ayam-surabaya";

/**
 * Uploads a file to Supabase Storage with the required folder structure:
 * ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
 */
export async function uploadFileToStorage(
  file: File | Blob,
  params: {
    featureName: "orders" | "menu" | "gallery" | "general" | string;
    itemId: string | number;
    filename?: string;
  }
): Promise<{ filePath: string; signedUrl: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    throw new Error("Pengguna belum login. Sesi diperlukan untuk mengunggah ke bucket pribadi.");
  }

  // Determine file extension
  let extension = "jpg";
  if (params.filename && params.filename.includes(".")) {
    extension = params.filename.split(".").pop()?.toLowerCase() || "jpg";
  } else if ("name" in file && typeof file.name === "string" && file.name.includes(".")) {
    extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  } else if (file.type) {
    extension = file.type.split("/")[1] || "jpg";
    if (extension === "jpeg") extension = "jpg";
  }

  // Generate UUID
  const uuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `f_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Strict folder rule: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
  const filePath = `${user.id}/${params.featureName}/${params.itemId}/${uuid}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    throw new Error(`Gagal mengunggah berkas ke Storage: ${uploadError.message}`);
  }

  // Generate signed URL since bucket is private
  const signedUrl = await getSignedFileUrl(filePath, 60 * 60 * 24);

  return { filePath, signedUrl };
}

/**
 * Generates a signed URL for a file in the private bucket
 */
export async function getSignedFileUrl(filePath: string, expiresIn = 3600 * 24): Promise<string> {
  if (!filePath) return "";

  // If already a data URL, local public asset (e.g. /images/...), or HTTP URL, return as is
  if (filePath.startsWith("data:") || filePath.startsWith("/images/") || filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data?.signedUrl) {
    return filePath;
  }

  return data.signedUrl;
}

/**
 * Removes the file from Storage
 */
export async function deleteFileFromStorage(filePath: string): Promise<boolean> {
  if (!filePath) return false;

  // If it's a local static asset, ignore
  if (filePath.startsWith("/images/") || filePath.startsWith("data:")) {
    return true;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.warn(`Gagal menghapus berkas dari storage "${filePath}":`, error.message);
    return false;
  }

  return true;
}
