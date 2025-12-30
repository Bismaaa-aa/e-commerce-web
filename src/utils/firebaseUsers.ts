import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const createUserDocument = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.email);

  await setDoc(
    userRef,
    {
      email: user.email,
      createdAt: new Date(),
      cart: []
    },
    { merge: true }
  );
};
