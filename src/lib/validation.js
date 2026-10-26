export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isStrongPassword = (v) => v.length >= 8 && /\d/.test(v)
export const isUrl = (v) => /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v.trim())
export const isPhone = (v) => /^\+?[\d\s-]{8,16}$/.test(v.trim())
