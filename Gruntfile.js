module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    clean: ["dist"],

    copy: {
    },

    watch: {
      rebuild_all: {
        files: ['static/**/*', 'layouts/**/*', 'content/**/*'],
        tasks: ['default'],
        options: {spawn: false}
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
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
        ]
      },
      dist: {src: 'dist/css/*.css'}
    },

    connect: {
      mysite: {
        options: {
          hostname: '127.0.0.1',
          port: 1345,
          protocol: 'http',
          base: 'dist',
          livereload: true,
          keepalive: true,
        }
      }
    }
  });

  grunt.registerTask('hugo', function(target) {
    var done = this.async();
    var args = ["--destination=dist/"];

    if (target === 'dev') {
      args.push('--baseUrl=http://127.0.0.1:1342');
      args.push('--buildDrafts=true');
      args.push('--buildFuture=true');
    }

    hugo = require('child_process').spawn('hugo', args, {stdio: 'inherit'});
    hugo.on('exit', function() { done(true); });
    hugo.on('error', function() { done(true); });
  });

  grunt.registerTask('default', [
    'clean',
    'hugo',
    'sass',
    'postcss',
    ]);
};

