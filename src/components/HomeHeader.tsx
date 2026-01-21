"use client";

import { useI18n } from '@/lib/i18n';


export function HomeHeader() {
    const { t } = useI18n();

    return (
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    {t('header.title')}
                </h1>
                <p className="text-muted">{t('header.subtitle')}</p>
            </div>
            {/* 语言切换器已移动到全局布局 */}
        </header>
    );
}
