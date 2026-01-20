"use client";

import { useI18n } from '@/lib/i18n';
import { Button } from './ui/Button';

export function LanguageSwitcher() {
    const { lang, setLang } = useI18n();

    const toggleLang = () => {
        if (lang === 'ja') setLang('zh');
        else if (lang === 'zh') setLang('en');
        else setLang('ja');
    };

    const label = lang === 'ja' ? 'JP' : lang === 'zh' ? 'CN' : 'EN';

    return (
        <Button
            variant="ghost"
            onClick={toggleLang}
            className="h-8 min-w-[32px] px-3 rounded-full font-bold shadow-sm text-xs border border-white/10 hover:bg-white/10 transition-colors"
            title="Switch Language"
        >
            {label}
        </Button>
    );
}
