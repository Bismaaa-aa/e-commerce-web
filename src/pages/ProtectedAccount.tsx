// src/pages/ProtectedAccount.tsx
import { Navigate } from "react-router-dom";
import Account from "./Account";
import type { User } from "firebase/auth";

interface ProtectedAccountProps {
    user: User | null;
}

export default function ProtectedAccount({ user }: ProtectedAccountProps) {
    if (!user) return <Navigate to="/home" replace />;
    return <Account user={user} />;
}
