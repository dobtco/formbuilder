module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-eco')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-release')
  grunt.loadNpmTasks('grunt-karma')

  grunt.initConfig
    bower: grunt.file.readJSON("bower.json")
    pkg: '<json:package.json>'
    srcFolder: 'src'
    compiledFolder: 'compiled' # Temporary holding area.
    distFolder: 'dist'
    testFolder: 'test'

    eco:
      all:
        options:
          basePath: (path) ->
            path.replace('src/templates', 'formbuilder')
        files:
          '<%= compiledFolder %>/templates.js': '<%= srcFolder %>/templates/**/*.eco'

    coffee:
      all:
        files:
          '<%= compiledFolder %>/scripts.js': [
            '<%= srcFolder %>/scripts/main.coffee'
          ]
          '<%= compiledFolder %>/autosaver.js': 'bower_components/autosaver/index.coffee'

    concat:
      all:
        files:
          '<%= compiledFolder %>/vendor.js': [
            'bower_components/formrenderer-base/dist/formrenderer.js'
            '<%= compiledFolder %>/autosaver.js'
            'bower_components/Sortable/Sortable.js'
            'bower_components/jquery.scrollWindowTo/index.js'
          ]
          '<%= compiledFolder %>/formbuilder.js': [
            '<%= compiledFolder %>/scripts.js'
            '<%= compiledFolder %>/templates.js'
          ]
      dist:
        files:
          '<%= distFolder %>/formbuilder.standalone.uncompressed.js': [
            '<%= compiledFolder %>/formbuilder.js'
          ]
          '<%= distFolder %>/formbuilder.uncompressed.js': [
            '<%= compiledFolder %>/vendor.js'
            '<%= compiledFolder %>/formbuilder.js'
          ]

    sass:
      all:
        options:
          sourcemap: 'none'
        files:
          '<%= distFolder %>/formbuilder.uncompressed.css': '<%= srcFolder %>/styles/main.scss'

    cssmin:
      dist:
        files:
          '<%= distFolder %>/formbuilder.css': '<%= distFolder %>/formbuilder.uncompressed.css'

    clean:
      compiled:
        ['<%= compiledFolder %>']

    uglify:
      dist:
        files:
          '<%= distFolder %>/formbuilder.standalone.js': '<%= distFolder %>/formbuilder.standalone.uncompressed.js'
          '<%= distFolder %>/formbuilder.js': '<%= distFolder %>/formbuilder.uncompressed.js'

    watch:
      build:
        files: [
          '<%= srcFolder %>/**/*.{coffee,eco}'
        ]
        tasks: 'default'
      test:
        files: ['<%= testFolder %>/**/*_test.{coffee,js}']
        tasks: 'test'

    # To test, run `grunt --no-write -v releaseTask`
    release:
      options:
        file: 'bower.json'
        npm: false

    karma:
      main:
        options:
          configFile: '<%= testFolder %>/karma.conf.coffee'
          singleRun: true
          reporters: 'dots'

  grunt.registerTask 'default', ['eco:all', 'coffee:all', 'concat:all', 'concat:dist', 'sass:all', 'clean:compiled']
  grunt.registerTask 'dist', ['cssmin:dist', 'uglify:dist']
  grunt.registerTask 'all', ['default', 'dist']
  grunt.registerTask 'test', ['karma:main']
