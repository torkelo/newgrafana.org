module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.loadNpmTasks("grunt-execute");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.initConfig({
    clean: ["dist"],

    copy: {
    },

    watch: {
      options: {
        livereload: 3003,
      },
      content: {
        files: ["content/**/*", "layouts/**/*"],
        tasks: ["hugo"],
        options: {spawn: false},
      },
      sass: {
        files: ["static/sass/**/*"],
        tasks: ["sass", "postcss"],
        options: {
          spawn: false
        }
      },
      js: {
        files: ["static/js/**/*"],
        tasks: ["babel", "systemjs"],
        options: {
          spawn: false
        }
      },
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "dist/css/styles.css": "static/sass/styles.scss",
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require("autoprefixer")({browsers: "last 2 versions"}), // add vendor prefixes
        ]
      },
      dist: {
        src: "dist/css/*.css"
      }
    },

    connect: {
      mysite: {
        options: {
          hostname: "127.0.0.1",
          port: 3002,
          protocol: "http",
          base: "dist",
          livereload: 3003,
          keepalive: true,
        }
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets:  ["es2015"],
        plugins: ["transform-es2015-modules-systemjs", "transform-es2015-for-of"],
      },
      dist: {
        files: [{
          cwd: "static",
          expand: true,
          src: ["js/**/*.js", "!js/system.conf.js"],
          dest: "dist",
          ext:".js"
        }]
      },
    },

    cssmin: {
      build: {
        expand: true,
        cwd: "dist/css",
        src: ["*.css"],
        dest: "dist/css"
      }
    },

    uglify: {
      build: {
        expand: true,
        src: ["**/*.js"],
        dest: 'dist/js',
        cwd: 'dist/js',
        options: {
          quite: true,
          compress: {},
          preserveComments: false,
        }
      }
    },

    usemin: {
      html: ["dist/**/*.html"]
    },

    filerev: {
      options: {encoding: "utf8", algorithm: "md5", length: 8},
      js: {
        src: "dist/js/app.bundle.js",
        dest: "dist/js",
      },
      css: {
        src: "dist/css/styles.css",
        dest: "dist/css",
      }
    }

  });

  grunt.registerTask("hugo", function(target) {
    var done = this.async();
    var args = ["--destination=dist/"];

    if (target === "dev") {
      args.push("--baseUrl=http://localhost:1345");
      args.push("--buildDrafts=true");
      args.push("--buildFuture=true");
    }

    hugo = require("child_process").spawn("hugo", args, {stdio: "inherit"});
    hugo.on("exit", function() { done(true); });
    hugo.on("error", function() { done(true); });
  });

  grunt.registerTask('systemjs', function() {
    var Builder = require('systemjs-builder');
    var done = this.async();

    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('dist', 'dist/js/system.conf.js');
    console.log('Starting systemjs-builder');

    builder
      .buildStatic('js/app.js', 'dist/js/app.bundle.js')
      .then(function() {
        console.log('Build complete');
        done();
      })
    .catch(function(err) {
      console.log('Build error');
      console.log(err);
      done(false);
    });
  });

  grunt.registerTask("default", [
      "hugo:dev",
      "sass",
      "postcss",
      "babel",
      "systemjs",
  ]);

  grunt.registerTask("build", [
      "clean",
      "default",
      "cssmin",
      "uglify",
      "filerev",
      "usemin",
  ]);

};

