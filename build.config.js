
module.exports = {
  generator: {
    srcDir: './generator/src/',
    binDir: './generator/bin/',
    entry: './generator/bin/generator.js'
  },
  npm: {
    src: './src/**/*.{ts,tsx}',
    dist: './npm/',
    package: 'package.json'
  },
  metadataPath: './generator/integration-data.json',
  componentFolder: './src/ui',
  baseComponent: '../core/component'
}