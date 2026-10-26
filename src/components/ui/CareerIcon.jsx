import { BarChart3, Briefcase, Code2, Megaphone, PenTool, Rocket, ShieldCheck } from 'lucide-react'

const byCategory = { frontend: Code2, data: BarChart3, ux: PenTool, marketing: Megaphone, security: ShieldCheck, product: Rocket, career: Briefcase }

export default function CareerIcon({ id, className = 'h-5 w-5' }) {
  const Icon = byCategory[id] || Briefcase
  return <Icon className={className} />
}
