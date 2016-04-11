module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appFolder: 'app/',
        distFolder: 'dist/',

        copy: {
            build: {
                cwd: '<%= appFolder %>',
                src: [
                    '**',
                    '!**/partials/**/*',
                    '!**/templates/**/*',
                    '!**/*.jade' ,
                    '!**/images/**/*',
                    '!**/sass/**/*'],
                dest: '<%= distFolder %>',
                expand: true
            }
        },

        clean: {
            build: {
                nonull: false,
                src: ['<%= distFolder %>']
            },

            stylesheets: {
                nonull: false,
                src: ['<%= distFolder %>*.css']
            },

            scripts: {
                nonull: false,
                src: ['<%= distFolder %>js']
            },

            images: {
                nonull: false,
                src: ['<%= distFolder %>images']
            },

            postbuild: {
                nonull: false,
                src: ['<%= distFolder %>js/dist',
                    '<%= distFolder %>sass',
                    '<%= distFolder %>partials',
                    '<%= distFolder %>assets',
                    '<%= distFolder %>coffee',
                    '<%= distFolder %>templates',
                    '<%= distFolder %>css']
            }
        },

        jade: {
            dev: {
                options: {
                    pretty: true,
                    data: {
                        debug: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>',
                    src: [ '*.jade' ],
                    dest: '<%= distFolder %>',
                    ext: '.html'
                }]
            },
            dist: {
                options: {
                    pretty: false,
                    data: {
                        debug: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>',
                    src: [ '*.jade' ],
                    dest: '<%= distFolder %>',
                    ext: '.html'
                }]
            }
        },

        concat: {
            options: {
                    // define a string to put between each file in the concatenated output
                separator: ''
            },

            dist: {
                // the files to concatenate
                src: ['<%= distFolder %>assets/jquery.js',
                    '<%= appFolder %>assets/elr-utilities.js',
                    '<%= appFolder %>assets/elr-time-utilities.js',
                    '<%= appFolder %>assets/elr-validation-utilities.js',
                    '<%= distFolder %>assets/elr-js-utilities/*.js',
                    '<%= distFolder %>assets/main.js'],
                // the location of the resulting JS file
                dest: '<%= distFolder %>js/<%= pkg.name %>.<%= pkg.version %>.js'
            }
        },

        jshint: {
            files: ['<%= appFolder %>assets/elr-js-utilities/*.js',
                '<%= appFolder %>assets/main.js',
                '<%= appFolder %>assets/elr-utilities.js',
                '<%= appFolder %>assets/elr-time-utilities.js',
                '<%= appFolder %>assets/elr-validation-utilities.js'],
            options: {
                maxerr: 10,
                unused: false,
                eqnull: true,
                eqeqeq: true,
                jquery: true
            }
        },

        uglify: {
            my_target: {
                options: {
                    mangle: false
                },

                files: {
                    '<%= distFolder %>js/<%= pkg.name %>.<%= pkg.version %>.js': ['<%= distFolder %>js/<%= pkg.name %>.<%= pkg.version %>.js']
                }
            }
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= distFolder %>images'
                }]
            }
        },

        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>sass',
                    src: ['**/*.scss'],
                    dest: '<%= distFolder %>',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>sass',
                    src: ['**/*.scss'],
                    dest: '<%= distFolder %>',
                    ext: '.css'
                }]
            }
        },

        scsslint: {
            allFiles: [
                '<%= appFolder %>sass/**/*.scss',
            ],
            options: {
                bundleExec: false,
                colorizeOutput: true,
                config: '.scss-lint.yml',
                reporterOutput: null
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 8 versions']
            },
            build: {
                expand: false,
                files: {
                    '<%= distFolder %>styles.css': '<%= distFolder %>styles.css'
                }
            }
        },

        csslint: {
            strict: {
                options: {
                    "unique-headings": false,
                    "font-sizes": false,
                    "box-sizing": false,
                    "floats": false,
                    "duplicate-background-images": false,
                    "qualified-headings": false,
                    "box-model": false,
                    "adjoining-classes": false,
                    "compatible-vendor-prefixes": false,
                    "important": false,
                    "shorthand": false,
                    "unqualified-attributes": false,
                    "fallback-colors": false
                },
                src: ['<%= distFolder %>*.css']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= distFolder %>**/*'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '<%= distFolder %>'
                }
            }
        },

        watch: {

            jade: {
                files: ['<%= appFolder %>/**/*.jade'],
                tasks: [ 'jade:dev' ],
            },

            images: {
                files: ['<%= appFolder %>images/**/*.{png,jpg,jpeg}'],
                tasks: [ 'imagemin' ],
            },

            sass: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['<%= appFolder %>sass/**/*.scss'],
                tasks: [ 'sass:dev', 'scsslint', 'csslint' ],
            },

            scripts: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['<%= distFolder %>assets/jquery.js',
                '<%= appFolder %>assets/el-utilities.js',
                '<%= appFolder %>assets/el-time-utilities.js',
                '<%= appFolder %>assets/el-validation-utilities.js',
                '<%= distFolder %>assets/elr-js-utilities/*.js',
                '<%= distFolder %>assets/main.js'],
                tasks: [ 'concat', 'jshint' ],
            },

            copy: {
                files: [ '<%= appFolder %>*',
                '<%= appFolder %>assets/*',
                '<%= appFolder %>assets/elr-js-utilities/*',
                '<%= appFolder %>sass/**/*',
                '<%= appFolder %>partials/**/*',
                '!<%= appFolder %>**/*.scss',
                '!<%= appFolder %>**/*.{png,jpg,jpeg}' ],
                tasks: [ 'copy' ]
            },
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).

    grunt.registerTask('default',
        ['clean:build',
        'copy',
        'jade:dev',
        'imagemin',
        'concat',
        'sass:dev',
        'autoprefixer',
        // 'browserSync',
        'scsslint',
        'csslint',
        'jshint',
        'watch']
    );

    grunt.registerTask('build',
        ['clean:build',
        'copy',
        'jade:dist',
        'imagemin',
        'concat',
        'uglify',
        'sass:dist',
        'autoprefixer',
        'clean:postbuild']
    );
};