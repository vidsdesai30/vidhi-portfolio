"use client";

interface ExperienceSectionProps {
    onClose: () => void;
}

const education = [
    {
        year: "2027",
        degree: "M.Sc. IT — Cybersecurity & Forensics",
        institution: "Parul University",
        detail: "Expected Graduation · 2027",
        current: true,
    },
    {
        year: "May 2025",
        degree: "Bachelor's of Vocational in Software Development",
        institution: "Gujarat Technical University",
        detail: "8.52 CGPA",
        current: false,
    },
    {
        year: "March 2022",
        degree: "HSC — Arts",
        institution: "The Ambica High School Gadat, Navsari",
        detail: "56.42%",
        current: false,
    },
    {
        year: "March 2020",
        degree: "SSC",
        institution: "Divine Public School, Navsari",
        detail: "58.83%",
        current: false,
    },
];

export default function ExperienceSection({ onClose }: ExperienceSectionProps) {
    return (
        <div style={{ maxWidth: "700px", width: "100%" }}>
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    background: "none",
                    border: "1px solid rgba(240,236,227,0.2)",
                    borderRadius: "4px",
                    color: "rgba(240,236,227,0.6)",
                    padding: "0.5rem 1.2rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "3rem",
                    transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)";
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240,236,227,0.6)";
                    e.currentTarget.style.borderColor = "rgba(240,236,227,0.2)";
                }}
            >
                ← Back
            </button>

            <h2
                className="font-serif"
                style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--color-text)",
                    marginBottom: "4rem",
                    letterSpacing: "0.02em",
                }}
            >
                Education
            </h2>

            <div style={{ position: "relative" }}>
                {/* Timeline vertical line */}
                <div
                    style={{
                        position: "absolute",
                        left: "110px",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        background: "linear-gradient(to bottom, transparent, rgba(200,184,154,0.4), transparent)",
                    }}
                />

                {education.map((edu, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: "2.5rem",
                            marginBottom: "3.5rem",
                            position: "relative",
                            animation: `fadeInUp 0.6s ease ${i * 0.15}s both`,
                        }}
                    >
                        {/* Year */}
                        <div
                            style={{
                                minWidth: "110px",
                                textAlign: "right",
                                paddingTop: "4px",
                            }}
                        >
                            <span
                                className="font-serif"
                                style={{
                                    color: edu.current ? "#f0ece3" : "rgba(200,184,154,1)",
                                    fontSize: "1rem",
                                    fontStyle: "italic",
                                    lineHeight: 1.4,
                                    display: "block",
                                    fontWeight: edu.current ? 600 : 400,
                                }}
                            >
                                {edu.year}
                            </span>
                        </div>

                        {/* Dot */}
                        <div
                            style={{
                                position: "absolute",
                                left: "102px",
                                top: "10px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--color-accent)",
                                border: "2px solid rgba(5,8,15,0.9)",
                                flexShrink: 0,
                            }}
                        />

                        {/* Content */}
                        <div style={{ paddingLeft: "0.5rem" }}>
                            <h3
                                className="font-serif"
                                style={{
                                    fontSize: "clamp(1rem, 2vw, 1.3rem)",
                                    fontWeight: 500,
                                    color: "var(--color-text)",
                                    marginBottom: "0.3rem",
                                    lineHeight: 1.3,
                                }}
                            >
                                {edu.degree}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--color-accent)",
                                    letterSpacing: "0.1em",
                                    marginBottom: "0.4rem",
                                    lineHeight: 1.5,
                                }}
                            >
                                {edu.institution}
                            </p>
                            <p
                                style={{
                                    fontSize: "0.85rem",
                                    color: "var(--color-text-muted)",
                                    letterSpacing: "0.06em",
                                    fontFamily: "system-ui, sans-serif",
                                }}
                            >
                                {edu.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
