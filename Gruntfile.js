'use strict';

module.exports = function (grunt) {
  // Load time of Grunt does not slow down even if there are many plugins. 
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'
  });

  // Time how long tasks take.
  require('time-grunt')(grunt);

  grunt.initConfig({
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'app/server.js',
          debug: true
        }
      },
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    jshint: {
      server: {
        options: {
          jshintrc: 'app/.jshintrc'
        },
        src: ['app/{,*/}*.js', '!app/test_utilities/**/*.js']
      }
    },

    clean: {
      server: '.tmp'
    },

    // Debugging with node inspector.
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint.
    nodemon: {
      debug: {
        script: 'app/server.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Run some tasks in parallel to speed up the build process.
    concurrent: {
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['app/**/*.spec.js']
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      dev: {
        NODE_ENV: 'development'
      }
    },
  });

  // Used for delaying livereload until after server has restarted.
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if(target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'concurrent:debug'
      ]);
    }

    if(target === 'development') {
      return grunt.task.run([
        'clean:server',
        'env:dev',
        'express:dev',
        'wait',
        'open',
        'express-keepalive'
      ]);
    }
  });

  grunt.registerTask('test', function (target) {
    if(target === 'server') {
      return grunt.task.run([
        'env:test',
        'mochaTest'
      ]);
    }
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test:server',
  ]);
};
