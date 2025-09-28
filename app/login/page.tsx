 "use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

interface LoginForm {
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
    "w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin", // ✅ themed
  footer: "text-center text-sm text-muted-foreground mt-4", // ✅ themed
  footerLink:
    "text-primary hover:text-primary/80 font-medium transition-colors", // ✅ themed
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const storedUser = localStorage.getItem("demoUser");

    if (!storedUser) {
      toast.error("No account found. Please sign up first.");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email === form.email && user.password === form.password) {
      toast.success(`Welcome back, ${user.name}!`);
      localStorage.setItem("isLoggedIn", "true");
      setTimeout(() => {
        router.push("/dashboard"); // 👈 redirect page after login
      }, 1000);
    } else {
      toast.error("Invalid email or password");
    }

    setIsLoading(false);
  };

  const updateForm =
    (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
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
                placeholder="Enter your password"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Footer */}
          <div className={styles.footer}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.footerLink}>
              Create one here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
