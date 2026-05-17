export function FinalCta() {
  return (
    <section className="px-6 py-24 bg-[var(--color-primary)] text-white text-center">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold tracking-tight">
          {/* {{FINAL_CTA_HEADLINE}} */}
        </h2>
        <p className="mt-4 text-lg opacity-90">
          {/* {{FINAL_CTA_SUBHEAD}} */}
        </p>
        <a href="{{FINAL_CTA_HREF}}" className="mt-8 inline-block rounded-md bg-white px-5 py-3 text-neutral-900">
          {/* {{FINAL_CTA_LABEL}} */}
        </a>
      </div>
    </section>
  );
}
