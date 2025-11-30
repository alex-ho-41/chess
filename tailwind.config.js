/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'chess-board-light': '#EEEED2',
                'chess-board-dark': '#769656',
            },
        },
    },
    plugins: [],
}
