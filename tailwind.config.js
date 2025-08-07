/** @type {import('tailwindcss').Config} */
module.exports = {

    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{js,jsx,ts,tsx}",
        "./src/screens/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
                bgActionBlue: '#539DF3',
                bgDefDark: '#1F1F1F',
                SearchBar: '#181818'
            }
        }
    },

    plugins: []
}
