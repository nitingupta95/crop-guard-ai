"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const styles = {
  container:
    "min-h-screen flex items-center justify-center bg-background px-4", // ✅ themed
  card:
    "w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-xl p-8", // ✅ themed
  title: "text-3xl font-bold text-foreground text-center", // ✅ themed
  subtitle: "mt-2 text-sm text-muted-foreground text-center", // ✅ themed
  form: "mt-8 space-y-6",
  label: "block text-sm font-medium text-foreground mb-1", // ✅ themed
  inputWrapper: "relative",
  input:
    "w-full pl-10 pr-3 py-3 rounded-lg border border-input focus:border-primary focus:ring-primary " +
    "bg-background text-foreground placeholder-muted-foreground shadow-sm", // ✅ themed
  button:
    "w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 " +
    "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary " +
    "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01]", // ✅ themed
  spinner:
    "w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin",
  footer: "text-center text-sm text-muted-foreground mt-4", // ✅ themed
  footerLink:
    "text-primary hover:text-primary/80 font-medium transition-colors", // ✅ themed
};

// ✅ page component must be default export
export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Save user in localStorage for demo
    localStorage.setItem("demoUser", JSON.stringify(form));
    localStorage.setItem("isLoggedIn", "false");

    toast.success("Signup successful! Please login.");
    setIsLoading(false);
    router.push("/login");
  };

  const updateForm =
    (field: keyof SignupForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join us today and get started</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name */}
          <div>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={form.name}
                onChange={updateForm("name")}
                placeholder="Choose a name"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={form.email}
                onChange={updateForm("email")}
                placeholder="Enter your email"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={form.password}
                onChange={updateForm("password")}
                placeholder="Create a strong password"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Footer */}
          <div className={styles.footer}>
            Already have an account?{" "}
            <Link href="/login" className={styles.footerLink}>
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
