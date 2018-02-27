
module.exports = {
  generator: {
    srcDir: './tools/src/',
    binDir: './tools/bin/',
    entry: './tools/bin/generator.js'
  },
  npm: {
    src: './src/**/*.{ts,tsx}',
    dist: './npm/',
    package: 'package.json'
  },
  metadataPath: './tools/integration-data.json',
  componentFolder: './src/ui',
  baseComponent: '../core/component'
}