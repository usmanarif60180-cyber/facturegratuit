import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function subscribeToNewsletter(email: string, source: string) {
  await addDoc(collection(db, "newsletter_subscribers"), {
    email,
    source,
    createdAt: serverTimestamp(),
  });
}
