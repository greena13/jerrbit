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

/**
 * @class Client for Errbit or Airbrake monitoring service, capable of reporting
 * errors and the context in which they occur, when they happen.
 */
class Client {
  /**
   * Creates a new instance of Client
   *
   * @param {Object} options A configuration hash
   * @param {String} [options.host='https://api.airbrake.io'] The host url to send
   *        all exception reports to.
   * @param {String} [options.projectId] The id of the project registered in Airbrake
   *        or Errbit. If unspecified, the projectKey is used instead.
   * @param {String} [options.projectKey] The key of the project registered in
   *        Airbrake or Errbit. This value is only used if projectId is not specified.
   * @param {String[]} [options.ignoredEnvironments=['development', 'test']] List of
   *        environments where errors should ignored service.
   */
  constructor(options) {
    this.host = options.host || DEFAULT_AIRBRAKE_URL;
    delete options.host;

    this.projectKey = options.projectId || options.projectKey;
    delete options.projectId;
    delete options.projectKey;

    this.ignoredEnvironments = options.ignoredEnvironments || ['development', 'test'];
    delete options.ignoredEnvironments;

    this.reportFactory = new ReportFactory(options);
  }

  /**
   * Sends an error report to the monitoring service if the environment is
   * not listed in ignoredEnvironments
   *
   * @param {Error} exception The error object to be reports to the error service
   * @param {Object} [context={}] Object containing information about the
   *        circumstances under which the error occurred.
   * @param {String} [context.context.url] The url on which the error occurred. This is
   *        automatically set, if left unspecified.
   * @param {Object} [context.params] An object containing the current url's query
   *        parameters. This is automatically set, if left unspecified.
   * @param {Object} [context.session] An object containing the contents of the user's
   *        current session. This is automatically set, if left unspecified.
   */
  notify(exception, context = {}) {
    if (!includesItem(this.ignoredEnvironments, this.reportFactory.environment)) {
      const report = this.reportFactory.build(exception, context);
      sendReport(serverUrl(this.host, this.projectKey), report);
    }
  }
}

export default Client;
