"use client";

import { useState, type FormEvent } from "react";
import { Send, Mail } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const subject = (formData.get("subject") as string).trim();
    const msg = (formData.get("message") as string).trim();

    const newErrors: Record<string, boolean> = {};
    if (!name) newErrors.name = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;
    if (!msg) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      setMessage("필수 항목을 올바르게 입력해주세요.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message: msg }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "메시지가 성공적으로 전송되었습니다.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.error || "전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  const inputBase =
    "w-full font-sans text-[0.9375rem] text-text bg-surface border border-border rounded-lg px-3.5 py-2.5 transition-all duration-200 placeholder:text-text-subtle focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-dim)]";

  return (
    <section id="contact" className="py-24" aria-labelledby="contact-title">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>Contact</SectionLabel>
        <FadeIn>
          <h2 id="contact-title" className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-10">
            연락하기
          </h2>
        </FadeIn>

        <div className="max-w-[560px]">
          <FadeIn>
            <p className="text-[1.0625rem] text-text-muted leading-[1.75] mb-10">
              새로운 기회, 협업 제안, 또는 궁금한 점이 있으시면 언제든지 연락주세요. 최대한 빠르게 답변
              드리겠습니다.
            </p>
          </FadeIn>

          <FadeIn>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 mb-10">
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-name" className="text-[0.8125rem] font-semibold text-text-muted tracking-wide">
                  이름 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder="홍길동"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className={`${inputBase} ${errors.name ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" : ""}`}
                  onInput={() => setErrors((prev) => ({ ...prev, name: false }))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-email" className="text-[0.8125rem] font-semibold text-text-muted tracking-wide">
                  이메일 <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="example@email.com"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className={`${inputBase} ${errors.email ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" : ""}`}
                  onInput={() => setErrors((prev) => ({ ...prev, email: false }))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-subject" className="text-[0.8125rem] font-semibold text-text-muted tracking-wide">
                  제목
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  placeholder="문의 제목"
                  maxLength={200}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-message" className="text-[0.8125rem] font-semibold text-text-muted tracking-wide">
                  메시지 <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="문의 내용을 입력해주세요."
                  required
                  maxLength={5000}
                  rows={5}
                  className={`${inputBase} resize-y min-h-[120px] leading-[1.7] ${errors.message ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" : ""}`}
                  onInput={() => setErrors((prev) => ({ ...prev, message: false }))}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="self-start inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_0_4px_var(--accent-dim)] transition-all duration-200 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeDasharray="31.4 31.4" strokeDashoffset="31.4" />
                    </svg>
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    메시지 보내기
                  </>
                )}
              </button>

              {message && (
                <div
                  className={`text-sm p-4 rounded-lg ${
                    status === "success"
                      ? "text-green-500 bg-green-500/8 border border-green-500/20"
                      : "text-red-500 bg-red-500/8 border border-red-500/20"
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}
            </form>
          </FadeIn>

          <FadeIn delay={0.1}>
            <a
              href="mailto:developer@park.seong.uk"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors duration-200"
              aria-label="이메일 보내기: developer@park.seong.uk"
            >
              <Mail size={16} />
              또는 직접 이메일 보내기: developer@park.seong.uk
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
