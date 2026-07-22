import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function submitContactMessage(input: { name: string; email: string; message: string }) {
  await addDoc(collection(db, "contact_messages"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}
