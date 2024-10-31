module.exports = {
  content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',    // All files in the pages directory
      './src/components/**/*.{js,ts,jsx,tsx}', // All files in the components directory
      './src/app/**/*.{js,ts,jsx,tsx}',       // Any additional directories within src
  ],
  theme: {
      extend: {},
  },
  plugins: [],
};
