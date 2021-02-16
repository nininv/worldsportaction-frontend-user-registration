module.exports = {
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2017": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "no-unused-vars": [
      1,
      {
        "vars": "all",
        "args": "after-used"
      }
    ],
    "no-class-assign": 0,
    "react/prop-types": 0,
    "no-case-declarations": 0,
    "react/display-name": 0,
    "react/no-find-dom-node": 0,
    "react/no-unescaped-entities": 0,
    "react/no-render-return-value": 0
  }
}
