interface StampBadgeProps {
  status: string;
}

/**
 * Signature visual element of the register: a rubber-stamp-style badge,
 * echoing how a physical fee register gets marked by hand.
 * Shows student status today; Module 2 (Fee Collection) will add a
 * Paid/Partial/Due stamp once payments exist to compute against.
 */
export function StampBadge({ status }: StampBadgeProps) {
  const isActive = status === "Active";
  return (
    <span
      className={
        "stamp " +
        (isActive
          ? "text-success"
          : "text-ink-soft")
      }
    >
      {status}
    </span>
  );
}
