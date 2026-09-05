import { useTranslation } from 'react-i18next'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
]

export function useAppTranslation() {
  const { t, i18n } = useTranslation()

  const currentLanguage = i18n.language || 'en'

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('setu_language', langCode)
    }
  }

  // Wrapper function for future backend dynamic text translation fallback
  const translateDynamic = (text, dynamicTranslations = {}) => {
    if (dynamicTranslations && dynamicTranslations[currentLanguage]) {
      return dynamicTranslations[currentLanguage]
    }
    return text
  }

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    translateDynamic,
  }
}

export default useAppTranslation
