/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // DVSA brand colours
        dvsa: {
          green: '#005EA5',   // GOVUK blue (primary action)
          yellow: '#FFDD00',  // GOVUK yellow (hazard / highlight)
          red: '#D4351C',     // GOVUK red (wrong answer / error)
          correct: '#00703C', // GOVUK green (correct answer)
          bg: '#F3F2F1',      // GOVUK page background
          text: '#0B0C0C',    // GOVUK body text
          link: '#1D70B8',    // GOVUK link blue
          border: '#B1B4B6',  // GOVUK border grey
          focus: '#FFDD00',   // GOVUK focus ring yellow
        },
      },
      fontFamily: {
        govuk: ['GDS Transport', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
