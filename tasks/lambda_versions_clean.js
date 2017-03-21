'use strict';

const AWS = require("aws-sdk");
var lambda = new AWS.Lambda({ region: 'eu-west-1' });

let getAliases = (functionName) => {
  return new Promise((resolve, reject) => {
    let versions = {};
    var params = {
      FunctionName: functionName
    };
    lambda.listAliases(params, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        data.Aliases.forEach(function (alias) {
          if (versions[alias.FunctionVersion]) {
            versions[alias.FunctionVersion]++;
          } else {
            versions[alias.FunctionVersion] = 1;
          }
        });
        resolve(versions);
      }
    })
  });
};

let getVersions = (functionName) => {
  return new Promise((resolve, reject) => {
    let versions = [];
    let params = {
      FunctionName: functionName
    };
    lambda.listVersionsByFunction(params, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        data.Versions.forEach(function (lambdaVersion) {
          versions.push(lambdaVersion.Version);
        });
        resolve(versions);
      }
    });
  })
};

module.exports = function (grunt) {

  function lambda_versions_clean_for(options) {
    console.log("Cleaning versions of lambda " + options.lambdaFunctionName + " that are not assigned to any aliases");
    lambda = new AWS.Lambda({ region: options.region });

    return Promise.all([getAliases(options.lambdaFunctionName), getVersions(options.lambdaFunctionName)]).then(
      (res) => {
        return res[1].filter((version) => !res[0][version]).map((version) => {
          return new Promise((resolve, reject) => {
            var params = {
              FunctionName: options.lambdaFunctionName,
              Qualifier: version
            };
            console.log("Cleaning version " + version);
            lambda.deleteFunction(params, function (err, data) {
              if (err) {
                console.log("Failed to clean version " + version + ". " + err.message);
                resolve(err);
              }
              else {
                console.log("Cleaned version " + version);
                resolve(data);
              }
            });
          })
        })
      }).then((promises) => Promise.all(promises).then(() => {
      console.log("Finished cleaning " + options.lambdaFunctionName + " unassigned versions");
    })).catch((err) => console.log(err.message));
  }

  grunt.registerMultiTask('lambda_versions_clean', 'Clean versions that are not assigned to any alias', function () {
    var options = this.options({
      lambdaFunctionName: null,
      region: "eu-west-1"
    });
    let done = this.async();
    lambda_versions_clean_for(options).then(() => done()).catch(done)
  });

};
