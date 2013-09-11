ALL_TASKS = ['jst:all', 'coffee:all', 'concat:all', 'sass:all']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-jst')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig

    pkg: '<json:package.json>'

    jst:
      all:
        options:
          namespace: 'FormBuilder.templates'
          processName: (filename) ->
            filename.replace('./templates/', '').replace('.html', '')

        files:
          'templates/compiled.js': ['./templates/**/*.html']

    coffee:
      all:
        files:
          'js/compiled.js': ['coffee/rivets-config.coffee', 'coffee/main.coffee', 'coffee/fields/*.coffee']

    concat:
      all:
        src: ['js/compiled.js', 'templates/compiled.js']
        dest: 'form-builder.js'

    sass:
      all:
        files:
          'form-builder.css': 'sass/formbuilder.sass'

    watch:
      all:
        files: ['./coffee/**/*.coffee', 'templates/**/*.html', './sass/**/*.sass']
        tasks: ALL_TASKS

  grunt.registerTask 'default', ALL_TASKS
