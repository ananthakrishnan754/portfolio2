// ============= PARTICLES CONFIGURATION =============
// Initialize tsParticles
document.addEventListener("DOMContentLoaded", async () => {
    await tsParticles.load("particles-js", {
        fullScreen: { enable: false },
        background: {
            color: { value: "transparent" },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                repulse: {
                    distance: 120,
                    duration: 0.4,
                }
            },
        },
        particles: {
            color: {
                value: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"], // Google/colorful theme
            },
            links: {
                enable: false, // Turn off lines
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: true,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 120, // Increase count for density
            },
            opacity: {
                value: { min: 0.3, max: 0.8 },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 2, max: 5 },
            },
        },
        detectRetina: true,
    });
});
