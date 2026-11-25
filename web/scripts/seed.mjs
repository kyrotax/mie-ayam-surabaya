import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

let url = "https://fidpdnscwysqrcadagmq.supabase.co";
let key = "sb_publishable_DPohBpc8xplzlccUCxILjQ_UyOI0SKy";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      url = trimmed.split("=")[1].trim();
    }
    if (
      trimmed.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=") ||
      trimmed.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")
    ) {
      key = trimmed.split("=")[1].trim();
    }
  }
}

const supabase = createClient(url, key);

async function checkAuth() {
  const email = "mieayamsurabaya.owner@gmail.com";
  const password = "Owner12345!";

  console.log(`Testing signIn with ${email}...`);
  let { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("Sign in result:", signInData?.user?.id, "error:", signInErr?.message);

  if (!signInData?.user) {
    console.log(`Trying to sign up ${email}...`);
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: "H. Bambang (Owner)",
          role: "owner",
        },
      },
    });
    console.log("Sign up result user:", signUpData?.user?.id, "session:", !!signUpData?.session, "error:", signUpErr?.message);
  }
}

checkAuth().catch(console.error);
