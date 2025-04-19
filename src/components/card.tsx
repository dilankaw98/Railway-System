"use client";

export default function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white text-blue-900 p-8 drop-shadow-lg ${className || ""}`}>
            {children}
        </div>
    );
}