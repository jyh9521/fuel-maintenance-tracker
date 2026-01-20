import React from 'react';

// 按钮组件属性定义
// 继承标准 ButtonHTMLAttributes
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

// 通用按钮组件
export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const baseClass = 'btn';
    // 根据变体选择央视
    const variantClass =
        variant === 'primary' ? 'btn-primary' :
            variant === 'secondary' ? 'btn-secondary' :
                variant === 'ghost' ? 'btn-ghost' :
                    'bg-red-500 text-white';

    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props} />
    );
}
