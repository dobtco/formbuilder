ALL_TASKS = ['coffee', 'haml', 'sass']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-haml')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig

    pkg: '<json:package.json>'

    coffee:
      main:
        expand: true
        flatten: false
        cwd: 'coffee'
        src: ['**/*.coffee']
        dest: 'js/'
        ext: '.js'

    haml:
      all:
        options:
          language: 'coffee'
          placement: 'global'
          target: 'js'
          namespace: 'window.FormBuilder.JST'
          includePath: true
          pathRelativeTo: './templates'
        files:
          'js/templates.js': ['templates/**/*.haml']

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
      app:
        files: ['./coffee/**/*.coffee', 'templates/**/*.haml', './sass/**/*.sass']
        tasks: ALL_TASKS

  grunt.registerTask 'default', ALL_TASKS