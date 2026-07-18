import { Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/data/site";
import { InquiryForm } from "@/components/forms/InquiryForm";

export function ContactSection() {
  return (
    <section id="contact" className="section-y bg-surface">
      <div className="container-wisein">
        <h2 className="text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          데이터와 AI가 필요한 순간,
          <br />
          와이즈인컴퍼니와 상담하세요
        </h2>
        <p className="mt-6 max-w-3xl text-[16px] md:text-[17px] leading-[1.8] text-text-muted">
          데이터 분석, AI 솔루션 개발, 데이터·AI 교육, 고객사 맞춤형 B2C 플랫폼 개발에 대한
          문의를 남겨주시면 담당자가 확인 후 연락드립니다.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="rounded-2xl border border-border bg-white p-8">
            <p className="text-[13px] font-bold uppercase tracking-widest text-primary">CONTACT</p>
            <h3 className="mt-3 text-[22px] font-bold text-text-strong">{company.nameKo}</h3>
            <p className="mt-1 text-[13px] text-text-muted">{company.nameEn}</p>

            <dl className="mt-8 space-y-6 text-[14.5px]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[12px] font-semibold uppercase text-text-muted">Address</dt>
                  <dd className="mt-1 text-text-strong leading-[1.65]">{company.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[12px] font-semibold uppercase text-text-muted">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${company.email}`}
                      className="text-text-strong hover:text-primary"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[12px] font-semibold uppercase text-text-muted">Phone</dt>
                  <dd className="mt-1">
                    <a href={company.phoneHref} className="text-text-strong hover:text-primary">
                      {company.phone}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </aside>

          <InquiryForm />
        </div>
      </div>
    </section>
  );
}