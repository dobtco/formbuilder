ALL_TASKS = ['coffee', 'haml']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-haml')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig

    pkg: '<json:package.json>'

    coffee:
      all:
        expand: true
        flatten: true
        cwd: 'coffee'
        src: ['*.coffee']
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

    watch:
      app:
        files: ['./coffee/*.coffee']
        tasks: ALL_TASKS

  grunt.registerTask 'default', ALL_TASKS