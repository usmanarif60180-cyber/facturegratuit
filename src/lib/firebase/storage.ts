import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

export async function uploadOrganizationFile(
  organizationId: string,
  folder: "logos" | "receipts" | "signatures",
  file: File
): Promise<string> {
  const path = `organizations/${organizationId}/${folder}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
