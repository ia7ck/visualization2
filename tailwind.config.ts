import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {},
  plugins: [require("@tailwindcss/forms")],
};
export default config;
