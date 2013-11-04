ALL_TASKS = ['jst:all', 'coffee:all', 'concat:all', 'stylus:all']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-jst')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-release')
  grunt.loadNpmTasks('grunt-karma')

  grunt.initConfig

    pkg: '<json:package.json>'
    distFolder: 'dist'
    testFolder: 'test'

    jst:
      all:
        options:
          namespace: 'Formbuilder.templates'
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
        '<%= distFolder %>/formbuilder.js': ['js/compiled.js', 'templates/compiled.js']
        'vendor/js/vendor.js': [
          'bower_components/jquery/jquery.js'
          'bower_components/jquery-ui/ui/jquery.ui.core.js'
          'bower_components/jquery-ui/ui/jquery.ui.widget.js'
          'bower_components/jquery-ui/ui/jquery.ui.mouse.js'
          'bower_components/jquery-ui/ui/jquery.ui.draggable.js'
          'bower_components/jquery-ui/ui/jquery.ui.droppable.js'
          'bower_components/jquery-ui/ui/jquery.ui.sortable.js'
          'bower_components/jquery.scrollWindowTo/index.js'
          'bower_components/underscore/underscore-min.js'
          'bower_components/underscore.mixin.deepExtend/index.js'
          'bower_components/rivets/dist/rivets.js'
          'bower_components/backbone/backbone.js'
          'bower_components/backbone-deep-model/src/deep-model.js'
        ]

    cssmin:
      dist:
        files:
          '<%= distFolder %>/formbuilder-min.css': '<%= distFolder %>/formbuilder.css'
          'vendor/css/vendor.css': 'bower_components/font-awesome/css/font-awesome.css'

    stylus:
      all:
        files:
          '<%= distFolder %>/formbuilder.css': 'styl/formbuilder.styl'

    uglify:
      dist:
        files:
          '<%= distFolder %>/formbuilder-min.js': '<%= distFolder %>/formbuilder.js'

    watch:
      all:
        files: ['./coffee/**/*.coffee', 'templates/**/*.html', './styl/**/*.styl']
        tasks: ALL_TASKS

    # To test, run `grunt --no-write -v release`
    release:
      npm: false

    karma:
      unit:
        configFile: '<%= testFolder %>/karma.conf.coffee'


  grunt.registerTask 'default', ALL_TASKS
  grunt.registerTask 'dist', ['cssmin:dist', 'uglify:dist']
  grunt.registerTask 'test', ['dist', 'karma']
