/*
 * LiveCast
 * https://github.com/tikalk/LiveCast
 *
 * Copyright (c) 2013 AssafG
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var mountFolder = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

    // load all grunt-plugin tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var nodeConfig = {
        listen: 8000,
        dev:"app",
        dist:"dist",
        express:{
            port: 3000,
            static :{
                src:'private',
                dist:'public'
            }
        },
        start: "supervisor app/app.js"
    };

    // node start process
    var nodeStart = nodeConfig.start;
    var verbose = grunt.verbose;
    verbose.subhead(nodeStart);
    var nodeProcess = require('child_process').exec(nodeStart);

    nodeProcess.stdout.on('data', function (d) { grunt.log.writeln(d); });
    nodeProcess.stderr.on('data', function (d) { grunt.log.error(d); });

    nodeProcess.on('exit', function(code) {
        if (code > 0) {
            grunt.log.error('Exited with code: '+code);
            return ;
        }

        verbose.ok('Exited with code: '+code);
    });

    // Project configuration.
    grunt.initConfig({
        c: nodeConfig,
        exec: {
            node: {
                command: '<%= c.start %>'
            }
        },
        connect: {
            options: {
                port: '<%= c.listen %>'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            proxySnippet
                        ];
                    }
                }
            },
            proxies: [
                {
                    context: '/',
                    host: 'localhost',
                    port: '<%= c.express.port %>',
                    https: false,
                    changeOrigin: false
                }

            ]
        },
        open: {
            server: {
                url: 'http://localhost:<%= c.listen %>'
            }
        },
        coffee: {
            server: {
                files: {
                    '<%= c.dev %>/private/.temp/js/coffee.js': '<%= c.dev %>/private/js/**/*.coffee'
                }
            }
        },
        concat: {
            options: {
                separator: ''
            },
            js: {
                src: ['<%= c.dev %>/private/.temp/js/*.js'],
                dest: '<%= c.dev %>/public/js/main.js'
            },
            css: {
                src: ['<%= c.dev %>/private/.temp/css/*.css'],
                dest: '<%= c.dev %>/public/css/style.css'
            }
        },
        cssmin: {
            server: {
                files: {
                    '<%= c.dev %>/public/css/style.css': ['<%= c.dev %>/private/.temp/css/*.css']
                }
            }
        },
        copy: {
            server: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private',
                    dest: '<%= c.dev %>/public',
                    src: [
                        '*.{ico,txt,html}'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/img',
                    dest: '<%= c.dev %>/private/.temp/img',
                    src: [
                        '*'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/js/',
                    dest: '<%= c.dev %>/private/.temp/js/',
                    src: [
                        '*.js'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/css/',
                    dest: '<%= c.dev %>/private/.temp/css/',
                    src: [
                        '*.css'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/components/',
                    dest: '<%= c.dev %>/public/components/',
                    src: [
                        '**/*.js'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/',
                    dest: '<%= c.dev %>/public/',
                    src: [
                        '**/*.{ico,txt,html}'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= c.dev %>/private/',
                    dest: '<%= c.dist %>',
                    src: [
                        '**/*.{ico,txt,html}'
                    ]
                }]
            }
        },
        watch: {
            node: {
                files: ['{<%= c.dev %>,<%= c.dev %>/routes}/*.js'],
                tasks: ['livereload']
            },
            html: {
                files: ['<%= c.dev %>/private/**/*.{ico,txt,html}'],
                tasks: ['copy:server']
            },
            coffee: {
                files: ['<%= c.dev %>/private/js/**/*.coffee'],
                tasks: ['coffee']
            },
            js: {
                files: ['<%= c.dev %>/private/js/*.js'],
                tasks: ['copy:server']
            },
            livereload: {
                files: [
                    '<%= c.dev %>/views/*.{jade,ejs,html}',
                    '<%= c.dev %>/private/*.html',
                    '{<%= c.dev %>/private/.temp,<%= c.dev %>/private}/css/*.css',
                    '{<%= c.dev %>/private/.temp,<%= c.dev %>/private}/js/*.js',
                    '<%= c.dev %>/private/img/*.{png,jpg,jpeg}'
                ],
                tasks: ['concat:css','concat:js','cssmin:server','livereload']
            }
        },
        clean: {
            dist: ['<%= c.dev %>/private/.temp', '<%= c.dist %>/*'],
            server: '<%= c.dev %>/private/.temp'
        },
        "jasmine-node": {
            options: {
                coffee: true
            },
            run: {
                spec: path.join("tests","spec")
            },
            env: {
                NODE_PATH: "lib/js"
            },
            executable: path.join('node_modules','.bin','jasmine-node')
        }
    });

    // remove when regarde task is renamed
    grunt.renameTask('regarde', 'watch');

    // remove when mincss task is renamed
    grunt.renameTask('mincss', 'cssmin');

	grunt.registerTask('build', [
		'configureProxies',
		'clean:server',
		'coffee:server',
		'copy:server',
		'concat:css',
		'concat:js',
        'cssmin:server'
	]);
	
    grunt.registerTask('default', [
        'configureProxies',
        'livereload-start',
        'connect:livereload',
        'clean:server',
        'coffee:server',
        'copy:server',
        'concat:css',
        'concat:js',
        'cssmin:server',
        'jasmine-node',
        'open',
        'watch']);

};