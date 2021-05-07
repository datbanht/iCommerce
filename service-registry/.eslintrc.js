module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['prettier'],
  plugins: ["prettier"],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'max-len': ["error", { "code": 200, "ignoreComments": true }],
    'arrow-parens': ["warn", "as-needed"]
  },
};
