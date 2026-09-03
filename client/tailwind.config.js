module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B1F35",
          800: "#0E2A47",
          700: "#123659",
          600: "#1C4A73",
          100: "#E4EAF0",
        },
        amber: {
          700: "#C97C22",
          600: "#E8963A",
          100: "#FBEBD6",
        },
        ink: "#16212B",
        muted: "#62717F",
        line: "#E1E6EA",
        canvas: "#F4F6F8",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
