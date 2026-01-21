import React from 'react';

type MaterialInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export function MaterialInput({ label, id, className = '', ...props }: MaterialInputProps) {
    // 如果未提供 ID，则生成一个随机 ID，以便标签与之关联
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`md-input-container ${className}`}>
            <input
                id={inputId}
                className="md-input"
                placeholder=" "
                {...props}
            />
            <label htmlFor={inputId} className="md-label">
                {label}
            </label>
        </div>
    );
}
