import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import {
  studentLoginFormSchema,
  studentLoginFormDefaults,
} from "@/validations/studentAuth.schema";
import type { StudentLoginFormValues } from "@/validations/studentAuth.schema";
import { useStudentLogin } from "@/hooks/useStudentAuth";
import { extractErrorMessage } from "@/lib/api";

export function StudentLoginPage() {
  const navigate = useNavigate();
  const login = useStudentLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentLoginFormValues>({
    resolver: zodResolver(studentLoginFormSchema),
    defaultValues: studentLoginFormDefaults,
  });

  const onSubmit = (values: StudentLoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => navigate("/student/dashboard"),
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft hover:text-navy"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="site-card p-7">
          <div className="mb-6 flex flex-col items-center text-center">
            <GraduationCap size={26} className="text-navy" />
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy">
              Student Portal
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Log in with your Student ID and Date of Birth
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="studentId"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft"
              >
                Student ID (Admission Number)
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="ADM-2026-0001"
                {...register("studentId")}
                className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
              />
              {errors.studentId && (
                <p className="mt-1 text-xs text-danger">
                  {errors.studentId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-danger">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {login.isError && (
              <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
                {extractErrorMessage(login.error)}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary mt-2 w-full disabled:opacity-50"
            >
              {login.isPending ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
