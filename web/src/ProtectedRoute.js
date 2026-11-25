import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * Protect private pages/components with supabase.auth.getSession()
 * If no session exists, redirect to /login.
 */
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
        } else {
          setHasSession(true);
        }
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <p style={{ color: "#666", fontSize: "14px" }}>Memeriksa sesi...</p>
      </div>
    );
  }

  return hasSession ? children : null;
}
