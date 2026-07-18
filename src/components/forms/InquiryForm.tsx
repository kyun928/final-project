import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/inquiry.functions";
import { budgetOptions, inquiryCategories, scheduleOptions } from "@/data/site";
import { PrivacyModal } from "@/components/common/PrivacyModal";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "이름을 두 글자 이상 입력해 주세요."),
  company: z.string().trim().min(2, "회사명을 두 글자 이상 입력해 주세요."),
  phone: z
    .string()
    .trim()
    .regex(/^(01[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/, "연락처 형식을 확인해 주세요."),
  email: z.string().trim().email("이메일 형식을 확인해 주세요."),
  category: z.string().min(1, "문의 분야를 선택해 주세요."),
  budget: z.string(),
  schedule: z.string(),
  message: z.string().trim().min(10, "문의 내용을 10자 이상 입력해 주세요."),
  consent: z.boolean().refine((v) => v === true, {
    message: "개인정보 수집 및 이용에 동의해 주세요.",
  }),
  hp: z.string().max(0),
});

type FormValues = z.infer<typeof schema>;

type Handle = { setCategory: (c: string) => void };
let _handle: Handle | null = null;
export function preselectInquiryCategory(c: string) {
  _handle?.setCategory(c);
}

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const send = useServerFn(submitInquiry);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      category: "",
      budget: "",
      schedule: "",
      message: "",
      consent: false,
      hp: "",
    },
  });

  useEffect(() => {
    _handle = { setCategory: (c: string) => setValue("category", c) };
    return () => {
      _handle = null;
    };
  }, [setValue]);

  const onSubmit = handleSubmit(
    async (values) => {
      setStatus("submitting");
      setErrorMessage("");
      try {
        await send({ data: values });
        setStatus("success");
        reset();
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err instanceof Error && err.message
            ? err.message
            : "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        );
        setStatus("error");
      }
    },
    (fieldErrors) => {
      const first = Object.keys(fieldErrors)[0] as keyof FormValues | undefined;
      if (first) setFocus(first);
    },
  );

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-border bg-white p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" strokeWidth={1.75} />
        <h3 className="mt-5 text-[22px] font-bold text-text-strong">
          문의가 정상적으로 접수되었습니다.
        </h3>
        <p className="mt-2 text-[15px] text-text-muted">
          담당자가 내용을 확인한 후 연락드리겠습니다.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex h-11 items-center rounded-md border border-border bg-white px-6 text-sm font-semibold text-text-strong hover:border-primary hover:text-primary"
        >
          새 문의 작성
        </button>
      </div>
    );
  }

  const fieldBase =
    "w-full h-12 rounded-md border border-border bg-white px-4 text-[15px] text-text-strong placeholder:text-text-muted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-6 md:p-10"
    >
      {/* honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Do not fill
          <input type="text" tabIndex={-1} autoComplete="off" {...register("hp")} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="이름" required error={errors.name?.message}>
          <input id="name" type="text" className={fieldBase} {...register("name")} />
        </Field>
        <Field label="회사명" required error={errors.company?.message}>
          <input id="company" type="text" className={fieldBase} {...register("company")} />
        </Field>
        <Field label="연락처" required error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="010-0000-0000"
            className={fieldBase}
            {...register("phone")}
          />
        </Field>
        <Field label="이메일" required error={errors.email?.message}>
          <input id="email" type="email" className={fieldBase} {...register("email")} />
        </Field>
        <Field label="문의 분야" required error={errors.category?.message}>
          <select id="category" className={cn(fieldBase, "appearance-none")} {...register("category")}>
            <option value="">선택해 주세요</option>
            {inquiryCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="예산 (선택)">
            <select id="budget" className={cn(fieldBase, "appearance-none")} {...register("budget")}>
              <option value="">선택</option>
              {budgetOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="일정 (선택)">
            <select
              id="schedule"
              className={cn(fieldBase, "appearance-none")}
              {...register("schedule")}
            >
              <option value="">선택</option>
              {scheduleOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-5">
        <Field label="문의 내용" required error={errors.message?.message}>
          <textarea
            id="message"
            rows={6}
            className="w-full rounded-md border border-border bg-white px-4 py-3 text-[15px] text-text-strong placeholder:text-text-muted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            placeholder="문의하실 내용을 자세히 입력해 주세요."
            {...register("message")}
          />
        </Field>
      </div>

      <div className="mt-6 rounded-md border border-border bg-surface p-4">
        <label className="flex items-start gap-3 text-[14px] text-text-strong cursor-pointer">
          <input
            id="consent"
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
            {...register("consent")}
          />
          <span>
            <span className="font-medium">개인정보 수집 및 이용에 동의합니다.</span>{" "}
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="text-primary underline underline-offset-2 hover:brightness-90"
            >
              자세히 보기
            </button>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-[13px] text-destructive">{errors.consent.message}</p>
        )}
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-[14px] text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {errorMessage || (
              <>
                문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나{" "}
                <a href="mailto:wisein@wisein.co.kr" className="underline">
                  wisein@wisein.co.kr
                </a>
                로 문의해 주세요.
              </>
            )}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary py-3.5 text-[16px] font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {status === "submitting" ? "접수 중..." : "문의 접수하기"}
      </button>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-text-strong">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[12.5px] text-destructive">{error}</p>}
    </div>
  );
}