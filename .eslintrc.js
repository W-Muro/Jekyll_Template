module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "google",
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "rules": {
    "quotes": ["error", "double"],
    "max-len": ["warn", {"code": 80}],
    "indent": ["error", 2],
  },
};
