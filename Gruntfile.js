module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: [
        'lib/*js'
      ],
      options: {
          nomen: false
        , indent: 2  
        // , unused: true  
        , asi: true //remove semicolon alert
        , laxcomma: true //alow comma on the next line
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.registerTask('default', ['jshint']);
};