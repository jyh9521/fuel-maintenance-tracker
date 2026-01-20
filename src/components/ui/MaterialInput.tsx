import React from 'react';

type MaterialInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export function MaterialInput({ label, id, className = '', ...props }: MaterialInputProps) {
    // Generate a random ID if not provided, for the label to associate with
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
