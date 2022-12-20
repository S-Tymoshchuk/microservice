module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    "import/resolver": {
      "alias": {
        "map": [
          ["@utils", "./src/auth/utils"],
          ["@config", "./src/auth/dto"],
          ["@init", "./src/auth/docs"],
          ["@components", "./src/auth/components"],
          ["@decorators", "./src/auth/decorators"],
        ],
        "extensions": [".ts", ".js", ".jsx", ".json"]
      }
    }
  },
};
