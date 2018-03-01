const mkdir = require('mkdirp');
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");
const runSequence = require('run-sequence');

const config = require('./build.config');

const
  GENERATE = 'generate',
  CLEAN = 'clean',

  OUTPUTDIR_CLEAN = 'output-dir.clean',
  OUTPUTDIR_CREATE = 'output-dir.create',
  GEN_COMPILE = 'generator.compile',
  GEN_CLEAN = 'generator.clean',
  GEN_RUN = 'generator.run',

  LINT = 'lint',

  NPM_CLEAN = 'npm.clean',
  NPM_PACKAGE = 'npm.package',
  NPM_BUILD = 'npm.build';

gulp.task(GENERATE, () =>
  runSequence(
    CLEAN,
    [OUTPUTDIR_CREATE, GEN_COMPILE],
    GEN_RUN
  )
);

gulp.task(CLEAN, [OUTPUTDIR_CLEAN, GEN_CLEAN]);

gulp.task(OUTPUTDIR_CLEAN, () =>
  gulp.src([config.componentFolder, config.indexFileName], { read: false })
    .pipe(clean())
);

gulp.task(GEN_CLEAN, () =>
  gulp.src(config.generator.binDir, { read: false })
    .pipe(clean())
);

gulp.task(OUTPUTDIR_CREATE, (done) =>
  mkdir(config.componentFolder, done)
);

gulp.task(GEN_COMPILE, [GEN_CLEAN], () =>
  gulp.src([config.generator.src, `!**/*.test.ts`])
    .pipe(ts({
      'target': 'es6',
      'module': 'commonjs'
    }))
    .pipe(gulp.dest(config.generator.binDir))
);

gulp.task(GEN_RUN, (done) => {
  const generateSync = require(`${config.generator.binDir}generator.js`).default;
  generateSync(
    JSON.parse(fs.readFileSync(config.metadataPath).toString()),
    config.baseComponent,
    {
      componentsDir: config.componentFolder,
      indexFileName: config.indexFileName
    }
  );

  done();
});

gulp.task(NPM_CLEAN, () =>
  gulp.src(config.npm.dist, { read: false })
    .pipe(clean())
);

gulp.task(NPM_PACKAGE, [NPM_CLEAN], () =>
  gulp.src(config.npm.package)
    .pipe(gulp.dest(config.npm.dist))
)

gulp.task(NPM_BUILD, [NPM_PACKAGE], () => {
  return gulp.src(config.src)
    .pipe(ts('tsconfig.json'))
    .pipe(gulp.dest(config.npm.dist))
});

gulp.task(LINT, () => {
  return gulp.src([config.src, config.generator.src, config.example.src])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report())
})
