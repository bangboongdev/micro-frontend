import vi from "@/lang/vi";
import en from "@/lang/en";
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'vi', // set locale
  fallbackLocale: 'vi', // set fallback locale
  globalInjection: true,
  messages: {
    vi,
    // en
  },
 
});
export default i18n;