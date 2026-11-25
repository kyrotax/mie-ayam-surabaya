import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);

    try {
      // 1) For Sign Up: Use supabase.auth.signUp({ email, password })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // After signUp(), if data.session is null, don’t redirect to the dashboard.
      // Just show: "Check your email and confirm your account before logging in."
      if (!data?.session) {
        setInfoMessage("Check your email and confirm your account before logging in.");
        setLoading(false);
        return;
      }

      // Only redirect when a real session exists
      window.location.href = "/";
    } catch (err) {
      setErrorMessage(err?.message || "Pendaftaran tidak dapat diproses. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", padding: "24px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Sign Up</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
        Daftar akun baru
      </p>

      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
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
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      {/* Confirmation message when data.session is null */}
      {infoMessage && (
        <p style={{ color: "#1F6B3B", backgroundColor: "#EDF7F1", padding: "10px", borderRadius: "6px", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
          {infoMessage}
        </p>
      )}

      {/* 4) Simple error handling: show a small error message under the form */}
      {errorMessage && (
        <p style={{ color: "#8D0D00", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
