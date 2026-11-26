import { supabase } from "./supabaseClient";

export const BUCKET_NAME = "mie-ayam-surabaya";

/**
 * Uploads a file to Supabase Storage with the required folder structure:
 * ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
 */
export async function uploadFileToStorage(file, { featureName, itemId, filename }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    throw new Error("Pengguna belum login. Sesi diperlukan untuk mengunggah ke bucket pribadi.");
  }

  let extension = "jpg";
  if (filename && filename.includes(".")) {
    extension = filename.split(".").pop().toLowerCase();
  } else if (file?.name && file.name.includes(".")) {
    extension = file.name.split(".").pop().toLowerCase();
  } else if (file?.type) {
    extension = file.type.split("/")[1] || "jpg";
    if (extension === "jpeg") extension = "jpg";
  }

  const uuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `f_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Strict folder rule: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
  const filePath = `${user.id}/${featureName}/${itemId}/${uuid}.${extension}`;

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

  const signedUrl = await getSignedFileUrl(filePath, 60 * 60 * 24);
  return { filePath, signedUrl };
}

/**
 * Generates a signed URL for a file in the private bucket
 */
export async function getSignedFileUrl(filePath, expiresIn = 3600 * 24) {
  if (!filePath) return "";
  if (filePath.startsWith("data:") || filePath.startsWith("/images/") || filePath.startsWith("http")) {
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
export async function deleteFileFromStorage(filePath) {
  if (!filePath) return false;
  if (filePath.startsWith("/images/") || filePath.startsWith("data:")) {
    return true;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  return !error;
}
