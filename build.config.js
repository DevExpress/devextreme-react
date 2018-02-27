
module.exports = {
  src: './src/**/*.{ts,tsx}',
  generator: {
    src: './tools/src/**/*.{ts,tsx}',
    binDir: './tools/bin/',
    entry: './tools/bin/generator.js'
  },
  example: {
    src: "example/**/*.ts{,x}"
  },
  npm: {
    dist: './npm/',
    package: 'package.json'
  },
  metadataPath: './tools/integration-data.json',
  componentFolder: './src/ui',
  baseComponent: '../core/component'
}