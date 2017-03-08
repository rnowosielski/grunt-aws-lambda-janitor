# grunt-aws-lambda-janitor

Keeps the aws lambda versions in check

## Installation

In order to install the package call

    npm install grunt-aws-lambda-janitor --save-dev
    
and add it to your `Gruntfile.js` the taks configuration

    grunt.initConfig({
        lambda_versions_clean: {
          SomeStage: {
            options: {
              lambdaFunctionName: "SomeLambda",
              region: "eu-west-1"
            }
          }
        }
    });

and possibly add to on of your tasks

    grunt.registerTask('deploy', [ ... 'lambda_versions_clean']);

