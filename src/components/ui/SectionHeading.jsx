export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-600">{eyebrow}</p>}
      <h2 className="text-balance text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-navy-500">{subtitle}</p>}
    </div>
  )
}
