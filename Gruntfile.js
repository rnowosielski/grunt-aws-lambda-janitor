'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    },
    lambda_versions_clean: {
      test: {
        options: {
          lambdaFunctionName: "SomeLambda1"
        }
      },
      test2: {
        options: {
          lambdaFunctionName: "SomeLambda2"
        }
      }
    },
    lambda_aliases_clean: {
      test: {
        options: {
          lambdaFunctionName: "StereotypeLambda",
          region: "eu-west-1",
          validAliases: ["master", "develop"]
        }
      },
      test2: {
        options: {
          lambdaFunctionName: "SomeLambda2"
        }
      }
    }
  });

  grunt.task.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['lambda_versions_clean']);
};