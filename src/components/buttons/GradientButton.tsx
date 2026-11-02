import React, { ButtonHTMLAttributes } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    /** First color (hex or CSS variable) */
    from?: string;
    /** Second color (hex or CSS variable) */
    to?: string;
    /** Gradient direction */
    direction?: "to right" | "to left" | "to top" | "to bottom" | "to bottom right" | "to top right";
    /** Any extra Tailwind utility classes */
    className?: string;
}

export default function GradientButton({
    children,
    from,
    to,
    direction = "to right",
    className = "",
    disabled = false,
    ...props
}: GradientButtonProps) {
    const hasCustomGradient = Boolean(from && to && from !== to);

    return (
        <button
            disabled={disabled}
            className={`relative overflow-hidden cursor-pointer rounded-xl px-7 py-3 font-semibold text-white bg-brand-blue shadow-md shadow-brand-blue/30 transition-all duration-300 hover:bg-opacity-95 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 ${className}`}
            style={
                hasCustomGradient
                    ? { backgroundImage: `linear-gradient(${direction}, ${from}, ${to})` }
                    : { backgroundColor: "var(--color-brand-blue)" }
            }
            {...props}
        >
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 hover:bg-white/10" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
}
