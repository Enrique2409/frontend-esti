"use client";

import "../../Styles/admin.css";

export default function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    required = false,
}) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={`inputs-box mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
  ${error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}
`}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && <p id={`${name}-error`} className="text-red-500 text-xs mt-1">{error}</p>}
            

        </div>
    );
}
