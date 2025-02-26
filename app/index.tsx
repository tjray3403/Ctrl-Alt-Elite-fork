import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React from "react";

export default function Index() {
  const auth = getAuth();
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Ensure the app doesn't stay in a loading state forever
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // Prevents flickering while checking auth status

  return user ? <Redirect href="/(tabs)/profile" /> : <Redirect href="/auth/login" />;
}
