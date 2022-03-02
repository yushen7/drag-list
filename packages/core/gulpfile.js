const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");
function compileTs(cb) {
  return gulp.src("src/**/*.ts").pipe(tsProject()).pipe(gulp.dest("lib/"));
}

exports.default = compileTs;
