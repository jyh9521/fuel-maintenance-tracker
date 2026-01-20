import React from 'react';

// 卡片组件属性定义
// 继承 HTMLDivElement 的属性以便支持 onClick 等标准事件
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
    title?: string;
};

// 通用卡片组件
// 使用玻璃拟态 (glassmorphism) 样式
export function Card({ children, className = '', title, ...props }: CardProps) {
    return (
        <div className={`md-card p-4 ${className}`} {...props}>
            {title && <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>}
            {children}
        </div>
    );
}
