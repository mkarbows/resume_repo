/* eslint indent: ["error", 2] */
module.exports = function (config) {
  config.set({
    frameworks: [
      "jasmine",
      "fixture"
    ],

    files: [
    //   "*.js",
      "vector.js",
      "matrix.js",
      "threeD.js",
      "glsl-utilities.js",
      "meshMaker.js",
      "http://code.jquery.com/jquery-latest.min.js",
      "test/**/*.html",
      "test/**/*.js"
    ],

    preprocessors: {
      "test/**/*.html": ["html2js"],
      "*.js": ["coverage"]
    },

    browsers: [
      "Chrome", "Firefox"
    ],

    reporters: [
      "dots",
      "coverage"
    ]
  });
};
