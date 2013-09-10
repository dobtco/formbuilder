module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
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

    watch:
      app:
        files: ['./coffee/*.coffee']
        tasks: ['coffee']

  grunt.registerTask 'default', ['coffee']