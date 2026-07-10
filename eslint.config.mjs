import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  ...nextConfig,
  {
    ignores: ["node_modules/**", ".next/**", "out/**"],
  },
  {
    rules: {
      // Flags the idiomatic "sync from an external store" and
      // "reset form state when the edited record changes" effects used
      // throughout the data hooks and dialogs — both are the documented
      // exception the rule itself calls out, not a bug.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
