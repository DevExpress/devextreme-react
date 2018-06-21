
module.exports = {
  src: './src/**/*.{ts,tsx}',
  testSrc: './src/**/__tests__/*.*', 
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
    package: 'package.json',
    license: 'LICENSE',
    readme: 'README.md'
  },
  metadataPath: './tools/integration-data.json',
  componentFolder: './src/ui',
  indexFileName: './src/index.ts',
  baseComponent: '../core/component',
  configComponent: '../core/nested-option'
}