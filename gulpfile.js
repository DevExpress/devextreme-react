const gulp = require('gulp');
const eslint = require("gulp-eslint");

gulp.task('lint', () => gulp.src(['packages/**/src/**/*.ts{,x}', 'example/**/*.ts{,x}'])
  .pipe(eslint({ configFile: '.eslintrc', fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest((file) => file.base))
  .pipe(eslint.formatEach('compact', process.stderr)));
