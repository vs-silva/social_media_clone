import {createI18n} from "vue-i18n";
import LanguageResourceMessages from "../../language-resources-messages";

const engine = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: LanguageResourceMessages
});

export function translate(key: string): string {
    if(!key.trim()) {
        return '';
    }
    return engine.global.t(key);
}


export default engine;
