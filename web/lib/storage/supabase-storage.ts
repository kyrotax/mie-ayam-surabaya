import { supabase } from "@/src/supabaseClient";

export const BUCKET_NAME = "mie-ayam-surabaya";
export const BUCKET_FALLBACKS = [
  "mie-ayam-surabaya",
  "MIE-AYAN-SURABAYA",
  "MIE-AYAM-SURABAYA",
  "mie-ayan-surabaya",
];

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

  let lastError: any = null;
  let uploadSuccess = false;

  // Try uploading to primary bucket and candidate buckets if needed
  for (const bucket of BUCKET_FALLBACKS) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

    if (!uploadError) {
      uploadSuccess = true;
      break;
    }
    lastError = uploadError;
  }

  if (!uploadSuccess && lastError) {
    throw new Error(`Gagal mengunggah berkas ke Storage: ${lastError.message}`);
  }

  // Generate signed URL
  const signedUrl = await getSignedFileUrl(filePath, 60 * 60 * 24);

  return { filePath, signedUrl };
}

/**
 * Generates a signed or public URL for a file in Supabase Storage
 */
export async function getSignedFileUrl(filePath: string, expiresIn = 3600 * 24 * 7): Promise<string> {
  if (!filePath) return "";

  // If already a data URL, local public asset (e.g. /images/...), or HTTP URL, return as is
  if (filePath.startsWith("data:") || filePath.startsWith("/images/") || filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Try creating signed URL across candidate buckets
  for (const bucket of BUCKET_FALLBACKS) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch {
      // ignore and continue
    }
  }

  // Fallback to internal storage proxy endpoint
  return `/api/storage/${filePath.replace(/^\/+/, "")}`;
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

  for (const bucket of BUCKET_FALLBACKS) {
    try {
      await supabase.storage.from(bucket).remove([filePath]);
    } catch {
      // ignore
    }
  }

  return true;
}
