module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true
  },
  globals: {
    __PATH_PREFIX__: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb"],
  plugins: ["compat", "import", "promise", "react"],
  settings: {
    react: {
      version: "16",
    },
  },
  rules: {
    "arrow-body-style": "off",
    "arrow-parens": ["error", "always"],
    "camelcase": "off",
    "comma-dangle": ["error", "always-multiline"],
    "compat/compat": "off",
    "consistent-return": ["error"],
    "function-paren-newline": "off",
    "generator-star-spacing": "off",
    "implicit-arrow-linebreak": "off",
    "import/no-extraneous-dependencies": ["error", { "packageDir": "./" }],
    "import/no-unresolved": ["error", { ignore: ["electron"] }],
    "import/prefer-default-export": "off",
    "jsx-a11y/label-has-associated-control": "off", // Broken?
    "jsx-a11y/label-has-for": "off", // Broken?
    "linebreak-style": ["error", "unix"],
    "max-len": ["warn", { code: 80, ignoreUrls: true }],
    "no-console": "off",
    "no-inner-declarations": ["error"],
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-use-before-define": ["warn"],
    "operator-linebreak": ["error", "after"],
    "prefer-const": ["warn", { destructuring: "all" }],
    "promise/no-native": "off",
    "promise/param-names": ["error"],
    "quote-props": ["warn", "consistent"],
    "react/destructuring-assignment": "off",
    "react/display-name": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".jsx"] }],
    "react/jsx-key": "warn",
    "react/jsx-no-bind": "off",
    "react/jsx-wrap-multilines": "off",
    "react/no-unescaped-entities": "off",
    "react/prefer-stateless-function": ["warn"],
    "react/prop-types": ["warn"],
    "react/require-default-props": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",

    "quotes": ["error", "double"],
    "semi": ["error"],
  }
}
