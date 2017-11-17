/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc: {
            dist: {
                src: ['src'],
                options: {
                    destination: 'build/dist/api-doc',
                    configure: 'tools/jsdoc.conf.json',
                    readme: 'README.md',
                    recurse: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    out: 'build/dist/worldwind.min.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            },
            compileDebug: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    optimize: 'none',
                    out: 'build/dist/worldwind.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            },
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['dots', 'junit', 'html'],
                junitReporter: {
                    outputFile: 'test-results.xml',
                    outputDir: 'build/test-results'
                },
                htmlReporter: {
                    outputFile: 'build/test-results/report.html',
                },
            }
        },

        clean: [
            'build/'
        ],

        compress: {
            images: {
                options: {
                    archive: 'build/dist/images.zip'
                },
                files: [
                    {src: ['images/**']}
                ]
            },
            dist: {
                options: {
                    archive: 'build/WebWorldWind-Distribution-<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'build/dist/',
                    src: ['**/*']
                }]
            }
        },

        copy: {
            main: {
                files: [
                    // Copy all of the files in the examples folder except the current shim which uses the sources files
                    {
                        expand: true,
                        src: ['images/**', 'examples/**', '!examples/WorldWindShim.js', 'README.md', 'LICENSE.txt'],
                        dest: 'build/dist/'
                    },
                    // Copy and rename the deployment WorldWindShim which uses the minified library
                    {
                        expand: true,
                        cwd: 'tools',
                        src: ['WorldWindShim.build.js'],
                        dest: 'build/dist/examples/',
                        rename: function (dest, src) {
                            return dest + src.replace('WorldWindShim.build', 'WorldWindShim');
                        }
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['clean', 'karma', 'jsdoc', 'requirejs', 'copy', 'compress']);
};
