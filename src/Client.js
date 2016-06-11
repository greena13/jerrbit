'use strict';

import 'whatwg-fetch';
import ReportFactory from './internal/ReportFactory';

const DEFAULT_AIRBRAKE_URL = 'https://api.airbrake.io';

function sendReport(destination, report){
  fetch(destination, {
    method: 'POST',
    body: JSON.stringify(report)
  })
}

function includesItem(array, item) {
  return array.indexOf(item) >= 0;
}

function endsWith(string, suffix){
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function hasTrailingSlash(string){
  endsWith(string, '/')
}

function serverUrl(base, identifier){
  base = hasTrailingSlash(base) ? base : base + '/';
  return base + 'api/v3/projects/' + identifier + '/notices';
}

class Client {
  constructor(options) {
    this.host = options.host || DEFAULT_AIRBRAKE_URL;
    delete options.host;

    this.projectKey = options.projectId || options.projectKey;
    delete options.projectId;
    delete options.projectKey;

    this.ignoredEnvironments = options.ignoredEnvironments || ['development', 'test'];
    delete options.ignoredEnvironments;

    this.reportFactory = new ReportFactory(options);

    const isIgnoredEnvironment = (environment)=>{
      return includesItem(this.ignoredEnvironments, environment);
    };

    if(isIgnoredEnvironment(this.reportFactory.environment)){
      this.notify = function(exception, context = {}){
        // Do nothing
      }
    } else {
      this.notify = function(exception, context = {}){
        const report = this.reportFactory.build(exception, context);
        sendReport(serverUrl(this.host, this.projectKey), report);
      };
    }
  }
}

export default Client;
