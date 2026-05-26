import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MauTemplateClient } from "@/components/MauTemplateClient"
import { SITE_URL } from "@/lib/siteUrl"
import { TEMPLATE_META } from "@/lib/templateMeta"

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  return Object.keys(TEMPLATE_META).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = TEMPLATE_META[params.slug]
  if (!meta) return {}
  const url = `${SITE_URL}/mau/${meta.slug}`
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
    },
  }
}

function buildFaqJsonLd(slug: string) {
  const meta = TEMPLATE_META[slug]
  if (!meta) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export default function MauTemplatePage({ params }: PageProps) {
  const meta = TEMPLATE_META[params.slug]
  if (!meta) notFound()

  const faqLd = buildFaqJsonLd(params.slug)

  return (
    <>
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <Link href="/mau" className="hover:text-ink">
            Biểu mẫu
          </Link>
          <span className="mx-1">/</span>
          <span className="text-ink2">{meta.h1}</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {meta.h1}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{meta.intro}</p>
        <p className="mt-3 text-sm font-medium text-ink2">
          <span className="text-muted">Căn cứ pháp lý: </span>
          {meta.legalBasis}
        </p>
        <p className="mt-1 text-xs text-muted">Cập nhật nội dung tham khảo: {meta.lastUpdated}</p>

        <MauTemplateClient templateId={meta.templateId} />

        <section className="mt-12 border-t border-black/10 pt-8" aria-labelledby="faq-mau">
          <h2 id="faq-mau" className="font-display text-xl font-semibold text-ink">
            Câu hỏi thường gặp
          </h2>
          <div className="mt-4 space-y-2">
            {meta.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-black/10 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-[rgba(26,18,8,0.1)] py-3 px-4 font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span className="text-muted group-open:hidden">+</span>
                  <span className="hidden text-red group-open:inline">−</span>
                </summary>
                <p className="px-4 py-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10">
          <Link href="/mau" className="text-sm font-semibold text-red hover:underline">
            ← Tất cả biểu mẫu
          </Link>
        </p>
      </article>
    </>
  )
}
