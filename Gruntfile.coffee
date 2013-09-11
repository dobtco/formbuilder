ALL_TASKS = ['coffee', 'jst', 'sass']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-jst')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig

    pkg: '<json:package.json>'

    coffee:
      all:
        expand: true
        flatten: false
        cwd: 'coffee'
        src: ['**/*.coffee']
        dest: 'js/'
        ext: '.js'

    jst:
      all:
        options:
          namespace: 'FormBuilder.templates'
          processName: (filename) ->
            filename.replace('./templates/', '').replace('.html', '')

        files:
          'js/templates.js': ['./templates/**/*.html']

    sass:
      all:
        files: [{
          expand: true
          cwd: 'sass'
          src: ['*.sass', '*.scss']
          dest: 'css'
          ext: '.css'
        }]

    watch:
      all:
        files: ['./coffee/**/*.coffee', 'templates/**/*.html', './sass/**/*.sass']
        tasks: ALL_TASKS

  grunt.registerTask 'default', ALL_TASKS