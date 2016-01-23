module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'app.js'
                }
            }
        },
        typescript: {
            server: {
                src: ['App/Server/Server.ts'],
                dest: 'app.js',
                options: {
                    target: 'es5',
                    comments: false,
                    ignoreError: true
                }
            },
            screen: {
                src: ['App/Screen/Screen.ts'],
                dest: 'public/js/Screen.js',
                options: {
                    target: 'es3',
                    comments: false,
                    ignoreError: true
                }
            },
            // client: {
            //     src: ['App/Client/Client.ts'],
            //     dest: 'public/js/client.js',
            //     options: {
            //         target: 'es3',
            //         comments: false,
            //         ignoreError: true
            //     }
            // }
        },
        watch: {
            options: { livereload: true },
            screen: { files: 'App/Screen/**/*.ts', tasks: ['typescript:screen'] },
           // client: { files: 'App/Client/**/*.ts', tasks: ['typescript:client'] },
            common: { files: 'App/Common/**/*.ts', tasks: ['typescript'] },
            server: { files: 'App/Server/**/*.ts', tasks: ['typescript:server'] },
            express: { files: ['app.js'], tasks: ['express:dev'], options: { spawn: false }, /* Without this option specified express won't be reloaded*/ },
            reload: { files: ['public/**/*'], options: { livereload: true } },
            configFiles: {
                files: ['Gruntfile.js'] 
            }
            //compile: { files: 'App/**/*.ts', tasks: ['typescript'] }
        },
        //compress: {
        //      main: {
        //            options: {
        //              archive: 'build/Build.zip'
        //            },
        //             files: [
        //                  {expand: true, cwd: 'public/', src: ['**'], dest: '/'}, // makes all src relative to cwd
        //                ]
        //      }
        //},
        open: {
            dev: {
                path: 'http://localhost:3000/screen.html'
            }
        }
    });

    grunt.registerTask('default', ['express:dev','typescript', 'watch']);
    grunt.registerTask('compile', ['watch:compile']);
}