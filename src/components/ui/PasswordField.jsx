import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import Field from './Field'

export default function PasswordField(props) {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Field {...props} type={show ? 'text' : 'password'} dir="ltr" className="[&_input]:pe-12" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute end-1 top-[27px] flex h-10 w-10 items-center justify-center rounded-lg text-navy-500 hover:text-navy-800"
        aria-label={show ? t('auth.hide') : t('auth.show')}
        aria-pressed={show}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
