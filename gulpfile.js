const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => gulp.src([
  'packages/sandbox/*.ts{,x}',
  'packages/devextreme-*/src/**/*.ts{,x}',
  '!**/node_modules/**/*',
])
  .pipe(eslint({ configFile: '.eslintrc', fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest((file) => file.base))
  .pipe(eslint.formatEach('compact', process.stderr)));
