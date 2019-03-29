module.exports = {
  "env": {
    "node": true,
    "es6": true
  },
  "parserOptions": {
      sourceType: "module"
  },
  "globals": {
    "module": true,
    "define": true,
    "require": true,
    "global": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": 1,
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "never"
    ],
    "no-unused-vars": [
        "error",
        {
            "args": "after-used",
            "argsIgnorePattern": "^_\\w+"
        }
    ]
  },
}
