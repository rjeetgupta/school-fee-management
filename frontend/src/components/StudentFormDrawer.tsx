import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { studentFormSchema, studentFormDefaults } from "@/validations/student.schema";
import type { StudentFormValues } from "@/validations/student.schema";
import { GENDERS } from "@/types/student";
import { useCreateStudent, useUpdateStudent } from "@/hooks/useStudents";
import { extractErrorMessage } from "@/lib/api";

const FIELDS: Array<{
  name: keyof StudentFormValues;
  label: string;
  type?: "text" | "number" | "email" | "date" | "select";
  required?: boolean;
  span?: "full" | "half";
}> = [
  { name: "admissionNumber", label: "Admission Number", required: true, span: "half" },
  { name: "rollNumber", label: "Roll Number", required: true, span: "half" },
  { name: "studentName", label: "Student Name", required: true, span: "full" },
  { name: "fatherName", label: "Father's Name", required: true, span: "full" },
  { name: "class", label: "Class", required: true, span: "half" },
  { name: "section", label: "Section", required: true, span: "half" },
  { name: "gender", label: "Gender", type: "select", required: true, span: "half" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, span: "half" },
  { name: "email", label: "Email", type: "email", required: true, span: "full" },
  { name: "mobileNumber", label: "Mobile Number", required: true, span: "half" },
  { name: "whatsappNumber", label: "WhatsApp Number", span: "half" },
  { name: "address", label: "Address", span: "full" },
  { name: "tuitionFee", label: "Tuition Fee (₹)", type: "number", required: true, span: "half" },
  { name: "hostelFee", label: "Hostel Fee (₹)", type: "number", span: "half" },
  { name: "miscellaneousFee", label: "Miscellaneous Fee (₹)", type: "number", span: "half" },
];

export function StudentFormDrawer() {
  const drawerMode = useUIStore((s) => s.drawerMode);
  const studentBeingEdited = useUIStore((s) => s.studentBeingEdited);
  const closeDrawer = useUIStore((s) => s.closeDrawer);

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const isOpen = drawerMode !== "closed";
  const isEdit = drawerMode === "edit";
  const isSubmitting = createStudent.isPending || updateStudent.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as never,
    defaultValues: studentFormDefaults,
  });

  useEffect(() => {
    if (isEdit && studentBeingEdited) {
      reset({
        admissionNumber: studentBeingEdited.admissionNumber,
        rollNumber: studentBeingEdited.rollNumber,
        studentName: studentBeingEdited.studentName,
        fatherName: studentBeingEdited.fatherName,
        class: studentBeingEdited.class,
        section: studentBeingEdited.section,
        gender: studentBeingEdited.gender,
        dateOfBirth: studentBeingEdited.dateOfBirth?.slice(0, 10) ?? "",
        email: studentBeingEdited.email,
        mobileNumber: studentBeingEdited.mobileNumber,
        whatsappNumber: studentBeingEdited.whatsappNumber ?? "",
        address: studentBeingEdited.address ?? "",
        tuitionFee: studentBeingEdited.tuitionFee,
        hostelFee: studentBeingEdited.hostelFee ?? 0,
        miscellaneousFee: studentBeingEdited.miscellaneousFee ?? 0,
      });
    } else if (drawerMode === "create") {
      reset(studentFormDefaults);
    }
  }, [isEdit, studentBeingEdited, drawerMode, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: StudentFormValues) => {
    if (isEdit && studentBeingEdited) {
      updateStudent.mutate(
        { id: studentBeingEdited._id, values },
        { onSuccess: () => closeDrawer() }
      );
    } else {
      createStudent.mutate(values, { onSuccess: () => closeDrawer() });
    }
  };

  const mutationError = createStudent.error ?? updateStudent.error;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close"
        onClick={closeDrawer}
        className="absolute inset-0 bg-ink/30"
      />
      <div className="drawer-enter relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-paper-line bg-paper px-6 py-6 shadow-xl">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-gold-dark">
              {isEdit ? "Edit Entry" : "New Entry"}
            </p>
            <h2 className="font-display text-xl font-semibold">
              {isEdit ? "Update Student Record" : "Add Student to Register"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close form"
            className="rounded-sm p-1 text-ink-soft hover:bg-paper-line/40"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field.name} className={field.span === "full" ? "col-span-2" : "col-span-1"}>
                <label
                  htmlFor={field.name}
                  className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink-soft"
                >
                  {field.label}
                  {field.required && <span className="text-danger"> *</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    {...register(field.name)}
                    className="w-full rounded-sm border border-paper-line bg-white px-3 py-2 text-sm"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type={field.type ?? "text"}
                    step={field.type === "number" ? "0.01" : undefined}
                    {...register(field.name)}
                    className="w-full rounded-sm border border-paper-line bg-white px-3 py-2 text-sm"
                  />
                )}
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-danger">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {mutationError && (
            <p className="rounded-sm bg-danger/10 px-3 py-2 text-sm text-danger">
              {extractErrorMessage(mutationError)}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-sm bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Student"}
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-sm border border-paper-line px-4 py-2 text-sm text-ink-soft hover:bg-paper-line/30"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
