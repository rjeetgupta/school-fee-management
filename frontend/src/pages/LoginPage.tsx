import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { BookText, ArrowLeft } from "lucide-react";
import { loginFormSchema, loginFormDefaults } from "@/validations/auth.schema";
import type { LoginFormValues } from "@/validations/auth.schema";
import { useLogin } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaults,
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 flex items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="rounded-sm border border-paper-line bg-white/60 p-7">
          <div className="mb-6 flex flex-col items-center text-center">
            <BookText size={26} className="text-gold-dark" />
            <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
              Administrator Login
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Fee Register · Single administrator access
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink-soft"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                {...register("email")}
                className="w-full rounded-sm border border-paper-line bg-white px-3 py-2 text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink-soft"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-sm border border-paper-line bg-white px-3 py-2 text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            {login.isError && (
              <p className="rounded-sm bg-danger/10 px-3 py-2 text-sm text-danger">
                {extractErrorMessage(login.error)}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="mt-2 rounded-sm bg-gold px-4 py-2.5 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
            >
              {login.isPending ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
