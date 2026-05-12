"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Create profile if missing
        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: user.id,
            full_name: user.email?.split("@")[0],
          });
        }
      }

      router.push("/dashboard");
    } else {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-8
          backdrop-blur-2xl
        "
      >
        <h1 className="text-4xl font-bold mb-3">Login</h1>

        <p className="text-gray-400 mb-8">Access your SolarFlow CRM</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black
              px-5
              py-4
              outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black
              px-5
              py-4
              outline-none
            "
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-green-500
              py-4
              font-semibold
              text-black
            "
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}
