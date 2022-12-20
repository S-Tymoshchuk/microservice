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
          ["@utils", "./src/video/utils"],
          ["@config", "./src/video/dto"],
          ["@init", "./src/video/docs"],
          ["@components", "./src/video/components"],
          ["@decorators", "./src/video/decorators"],
          ["@enums", "./src/video/enums"],
        ],
        "extensions": [".ts", ".js", ".jsx", ".json"]
      }
    }
  },
};
