module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['./*.js', './modules/*.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: 'doc'              
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

};