// eslint-disable-next-line no-undef
module.exports = {
  // Environnements (navigateur, node, etc.)
  env: {
    "browser": true,
    "es2021": true,
    "node": true,
  },

  parserOptions:  {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },

  // Version de React lue dans package.json (sinon avertissement à chaque lint)
  settings: {
    react: { version: "detect" },
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
  },
};