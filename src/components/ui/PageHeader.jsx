// Navy banner used at the top of inner pages.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute -top-24 end-0 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 start-10 h-72 w-72 rounded-full bg-navy-500/30 blur-3xl" />
      <div className="container-page relative py-12 sm:py-16">
        <h1 className="animate-fade-up text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl animate-fade-up text-base text-navy-200 sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-6 animate-fade-up">{children}</div>}
      </div>
    </section>
  )
}
