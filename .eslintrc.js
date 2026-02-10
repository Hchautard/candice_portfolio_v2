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

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
  ],

  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
  },
};