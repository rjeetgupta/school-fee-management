import { useNavigate } from "react-router";
import { LogOut, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useMyProfile, useMyFeeSummary, useMyFeeHistory, useMyPayments } from "@/hooks/useStudentPortal";
import { PayFeeButton } from "@/components/PayFeeButton";
import { useQueryClient } from "@tanstack/react-query";

function StatusPill({ status }: { status: string }) {
  const color =
    status === "Paid"
      ? "text-success bg-success/10"
      : status === "Partial"
        ? "text-gold-dark bg-gold/10"
        : "text-danger bg-danger-soft";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{status}</span>
  );
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  const profile = useMyProfile();
  const feeSummary = useMyFeeSummary();
  const feeHistory = useMyFeeHistory();
  const payments = useMyPayments();

  const handleLogout = () => {
    clearAuth();
    navigate("/student-login");
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["student-portal"] });
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-paper-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-navy" />
            <span className="font-display text-lg font-semibold text-navy">
              Student Portal
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-paper-line/40"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="site-card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Personal Information
          </p>
          {profile.isLoading ? (
            <p className="mt-3 text-sm text-ink-soft">Loading profile…</p>
          ) : profile.data ? (
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-ink-soft">Name</p>
                <p className="font-medium text-navy">{profile.data.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Father's Name</p>
                <p className="font-medium text-navy">{profile.data.fatherName}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Class</p>
                <p className="font-medium text-navy">{profile.data.class}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Roll Number</p>
                <p className="font-medium text-navy">{profile.data.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Admission No.</p>
                <p className="font-medium text-navy">{profile.data.admissionNumber}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Mobile</p>
                <p className="font-medium text-navy">{profile.data.mobileNumber}</p>
              </div>
              {profile.data.address && (
                <div className="col-span-2">
                  <p className="text-xs text-ink-soft">Address</p>
                  <p className="font-medium text-navy">{profile.data.address}</p>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="site-card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Outstanding Due
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-danger">
                ₹{(feeSummary.data?.totalDue ?? 0).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {feeSummary.data?.pendingMonthsCount ?? 0} month(s) pending
              </p>
            </div>
            {(feeSummary.data?.totalDue ?? 0) > 0 && (
              <PayFeeButton amount={feeSummary.data!.totalDue} onSettled={refreshAll} />
            )}
          </div>

          {feeSummary.data && feeSummary.data.pendingMonths.length > 0 && (
            <div className="mt-5 overflow-x-auto border-t border-paper-line pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink-soft">
                    <th className="pb-2 pr-4 font-normal">Month</th>
                    <th className="pb-2 pr-4 text-right font-normal">Monthly Fee</th>
                    <th className="pb-2 pr-4 text-right font-normal">Paid</th>
                    <th className="pb-2 pr-4 text-right font-normal">Due</th>
                    <th className="pb-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeSummary.data.pendingMonths.map((m) => (
                    <tr key={m.month} className="border-t border-paper-line">
                      <td className="py-2 pr-4">{m.month}</td>
                      <td className="py-2 pr-4 text-right">₹{m.monthlyAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2 pr-4 text-right">₹{m.amountPaid.toLocaleString("en-IN")}</td>
                      <td className="py-2 pr-4 text-right font-medium text-danger">
                        ₹{m.due.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2">
                        <StatusPill status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="site-card mt-6 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Fee Details — Monthly
          </p>
          {feeHistory.isLoading && (
            <p className="mt-3 text-sm text-ink-soft">Loading…</p>
          )}
          {feeHistory.data && feeHistory.data.length === 0 && (
            <p className="mt-3 text-sm text-ink-soft">No fee records yet.</p>
          )}
          {feeHistory.data && feeHistory.data.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink-soft">
                    <th className="border-b border-paper-line pb-2 pr-4 font-normal">Month</th>
                    <th className="border-b border-paper-line pb-2 pr-4 text-right font-normal">Amount</th>
                    <th className="border-b border-paper-line pb-2 pr-4 text-right font-normal">Paid</th>
                    <th className="border-b border-paper-line pb-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeHistory.data.map((fm) => (
                    <tr key={fm._id}>
                      <td className="border-b border-paper-line py-2 pr-4">{fm.month}</td>
                      <td className="border-b border-paper-line py-2 pr-4 text-right">
                        ₹{fm.monthlyAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="border-b border-paper-line py-2 pr-4 text-right">
                        ₹{fm.amountPaid.toLocaleString("en-IN")}
                      </td>
                      <td className="border-b border-paper-line py-2">
                        <StatusPill status={fm.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="site-card mt-6 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Payment History
          </p>
          {payments.isLoading && (
            <p className="mt-3 text-sm text-ink-soft">Loading…</p>
          )}
          {payments.data && payments.data.length === 0 && (
            <p className="mt-3 text-sm text-ink-soft">No payments recorded yet.</p>
          )}
          {payments.data && payments.data.length > 0 && (
            <ul className="mt-3 flex flex-col divide-y divide-paper-line">
              {payments.data.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-navy">{p.receiptNumber}</p>
                    <p className="text-xs text-ink-soft">
                      {new Date(p.paymentDate).toLocaleDateString("en-IN")} · {p.channel}
                      {p.paymentMode ? ` · ${p.paymentMode}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">₹{p.amount.toLocaleString("en-IN")}</span>
                    <StatusPill status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
