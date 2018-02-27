module.exports = {
    "roots": [
      "<rootDir>/src",
      "<rootDir>/generator"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "moduleNameMapper": {
      "\\.(css|less)$": "identity-obj-proxy"
    }    
  }