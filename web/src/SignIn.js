import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // 2) For Sign In: Use supabase.auth.signInWithPassword({ email, password })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // Only redirect when a real session exists after login
      if (!data?.session) {
        setErrorMessage("Sesi login tidak ditemukan. Silakan periksa kembali akun Anda.");
        setLoading(false);
        return;
      }

      // Check role: Sign in itself only available for only owner and admin
      const user = data?.user;
      const role = (
        user?.user_metadata?.role ||
        user?.app_metadata?.role ||
        ""
      ).toLowerCase();
      const userEmail = (user?.email || "").toLowerCase();

      const isAllowed =
        role === "owner" ||
        role === "admin" ||
        userEmail.includes("owner") ||
        userEmail.includes("admin");

      if (!isAllowed) {
        await supabase.auth.signOut();
        setErrorMessage("Akses ditolak: Login hanya tersedia untuk Owner dan Admin.");
        setLoading(false);
        return;
      }

      // 3) Only redirect when a real session exists after login: Redirect to Home page ("/")
      window.location.href = "/";
    } catch (err) {
      setErrorMessage(err?.message || "Login tidak dapat diproses. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", padding: "24px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Sign In</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
        Khusus untuk Owner dan Admin
      </p>

      <form onSubmit={handleSignIn}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@mieayam.test"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#7B1007",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {/* 4) Simple error handling: show a small error message under the form */}
      {errorMessage && (
        <p style={{ color: "#8D0D00", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
