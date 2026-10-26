import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import Field from './Field'

export default function PasswordField(props) {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Field {...props} type={show ? 'text' : 'password'} dir="ltr" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute end-2 top-[34px] rounded-md p-1.5 text-navy-400 hover:text-navy-700"
        aria-label={show ? t('auth.hide') : t('auth.show')}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
