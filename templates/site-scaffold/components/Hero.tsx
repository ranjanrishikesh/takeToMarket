export function Hero() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          {/* {{HERO_HEADLINE}} */}
        </h1>
        <p className="mt-6 text-lg text-neutral-700">
          {/* {{HERO_SUBHEAD}} */}
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="{{HERO_CTA_PRIMARY_HREF}}" className="rounded-md bg-[var(--color-primary)] px-5 py-3 text-white">
            {/* {{HERO_CTA_PRIMARY_LABEL}} */}
          </a>
          <a href="{{HERO_CTA_SECONDARY_HREF}}" className="rounded-md px-5 py-3 ring-1 ring-neutral-300">
            {/* {{HERO_CTA_SECONDARY_LABEL}} */}
          </a>
        </div>
      </div>
    </section>
  );
}
