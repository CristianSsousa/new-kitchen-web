/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#fdf2f8",
                    100: "#fce7f3",
                    200: "#fbcfe8",
                    300: "#f9a8d4",
                    400: "#f472b6",
                    500: "#ec4899",
                    600: "#db2777",
                    700: "#be185d",
                    800: "#9d174d",
                    900: "#831843",
                },
                secondary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                },
                romantic: {
                    gold: "#d4af37",
                    cream: "#faf7f0",
                    blush: "#f5c2c7",
                    sage: "#87a96b",
                    dusty: "#d4a574",
                },
            },
            fontFamily: {
                serif: ["Playfair Display", "serif"],
                sans: ["Inter", "sans-serif"],
                script: ["Dancing Script", "cursive"],
            },
            backgroundImage: {
                "gradient-romantic":
                    "linear-gradient(135deg, #fdf2f8 0%, #f0f9ff 100%)",
                "gradient-gold":
                    "linear-gradient(135deg, #d4af37 0%, #f7e7ce 100%)",
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                fadeIn: "fadeIn 0.5s ease-in-out",
                slideUp: "slideUp 0.5s ease-out",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0px)" },
                },
            },
        },
    },
    plugins: [],
};
