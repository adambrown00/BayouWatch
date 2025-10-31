import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Save original overflow and lock scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // Focus the modal content for accessibility
        const el = contentRef.current;
        el?.focus();

        // Close on Escape
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const backdropStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
    };

    const modalStyle: React.CSSProperties = {
        background: "white",
        maxWidth: "600px",
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        position: "relative",
        outline: "none",
    };

    const headerStyle: React.CSSProperties = {
        padding: "1rem 1.25rem",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: "1.125rem",
        fontWeight: 600,
    };

    const closeBtnStyle: React.CSSProperties = {
        background: "transparent",
        border: "none",
        fontSize: "1.25rem",
        cursor: "pointer",
        lineHeight: 1,
    };

    const bodyStyle: React.CSSProperties = {
        padding: "1rem 1.25rem",
    };

    const onBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            style={backdropStyle}
            onMouseDown={onBackdropClick}
            aria-hidden={false}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={modalStyle}
                ref={contentRef}
                tabIndex={-1}
            >
                <div style={headerStyle}>
                    <h2 id="modal-title" style={titleStyle}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={closeBtnStyle}
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                <div style={bodyStyle}>{children}</div>
            </div>
        </div>,
        document.body
    );
}