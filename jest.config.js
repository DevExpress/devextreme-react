module.exports = {
    "roots": [
      "<rootDir>/src",
      "<rootDir>/tools"
    ],
    "transform": {
      "^.+\\.(j|t)sx?$": "ts-jest"
    },
    "testRegex": "test\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ]
}