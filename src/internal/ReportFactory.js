import { os } from 'platform';

import stackTrace from 'stack-trace';
import queryString from 'query-string';
import cookie from 'cookie';
import merge from 'merge';

const DEFAULT_STATIC_PROPERTIES = {
  context: {
    environment: 'development',
    os: os.toString(),
    notifier: {
      name: 'jerrbit',
      version: 'JERBIT_VERSION',
      url: 'https://github.com/greena13/jerrbit.git'
    },

    userAgent: navigator.userAgent
  },

  language: 'JavaScript',
  environment: {}
};

function generateRunTimeProperties(){
  return({
    context: {
      url: window.location.href
    },

    session: cookie.parse(document.cookie),
    params: queryString.parse(window.location.search)
  })
}

/**
 * @typedef {Object} ErrorContext contains information about the context in which an
 * error occurred.
 *
 * @attribute {String} environment The name of the current environment
 * @attribute {String} os The operating system the app is running on.
 * @attribute {String} userAgent The user agent the current app is running on.
 * @attribute {String} language The language the current app is written in.
 * @attribute {Object} notifier Object describing the utility used to report errors.
 * @attribute {String} url The url on which the error occurred.
 */

/**
 * @typedef {Object} ErrorObject contains information about the error that has occurred.
 *
 * @attribute {String} type the type of exception that has occurred
 * @attribute {String} message a description of the error
 * @attribute {Array.<StackTraceLine>} backtrace list of points in the stack trace
 *            for the error that occurred
 */

/**
 * @typedef {Object} StackTraceLine contains information about a particular point
 *          in a stack trace
 *
 * @attribute {String} file name of the file the stack trace point is in
 * @attribute {Number} line line number the stack trace point is on
 * @attribute {String} function function the stack trace point is in
 */

/**
 * @typedef {Object} ErrorReport contains all of the information sent to the
 * error monitoring service that describe the error and the context in which it
 * occurred.
 *
 * @attribute {ErrorContext} context Describes the context in which an error occurs.
 * @attribute {Object} params An object containing the current url's query parameters.
 * @attribute {Object} session An object containing the contents of the user's cookies.
 * @attribute {ErrorObject[]} errors list of errors to be reported to the monitoring
 *            service
 */

/**
 * @classdesc Class for generating error reports
 */
class ReportFactory {
  /**
   * Creates a new ReportFactory instance
   *
   * @param {Object} options Hash of options to override the defaults automatically
   *        set by Jerrbit
   * @param {Object} [options.context] Hash of options that describe the current
   *        app's context. This information is considered to remain constant between
   *        error reports.
   * @param {String} [options.context.environment='development'] The name of the
   *        current environment, which is compared with the list of
   *        ignoredEnvironments to determine whether to send the error to the
   *        monitoring service or not. By default, the development environment is used.
   * @param {String} [options.context.os] The operating system the app is running on.
   *        This is automatically populated for you, if it not set.
   * @param {String} [options.context.userAgent] Describes the user agent the current
   *        app is running on.
   * @param {String} [options.context.language='JavaScript'] Describes the language
   *        the current app is written in.
   * @param {Object} [options.context.notifier] Object describing the utility used
   *        to report errors. This is automatically set by Jerrbit to describe itself.
   */
  constructor(options = {}){
    this._sharedReportData = merge.recursive({}, DEFAULT_STATIC_PROPERTIES, options);
    this.environment = this._sharedReportData.context.environment;
  }

  /**
   * Creates a new error report object with the values set at the time the ReportFactory
   * was created, merged in with those gathered when the error occurred.
   *
   * @param {Error} error the error to report to the monitoring service
   * @param {Object} [context={}] Object containing information about the
   *        circumstances under which the error occurred.
   * @param {String} [context.context.url] The url on which the error occurred. This is
   *        automatically set, if left unspecified.
   * @param {Object} [context.params] An object containing the current url's query
   *        parameters. This is automatically set, if left unspecified.
   * @param {Object} [context.session] An object containing the contents of the user's
   *        current session. This is automatically set, if left unspecified.
   * @return {ErrorReport} Error report object
   */
  build(error, context = {}){
    const errorDescription = {
      type: error.type || error.constructor.name || 'Error',
      message: error.message || '',
      backtrace: []
    };

    stackTrace.parse(error).forEach((stackTracePosition)=>{
      errorDescription.backtrace.push({
        file: stackTracePosition.getFileName() || '',
        line: stackTracePosition.getLineNumber() || '',
        function: stackTracePosition.getFunctionName() || ''
      })
    });

    return merge.recursive({},
        this._sharedReportData,
        generateRunTimeProperties(),
        { errors: [errorDescription] },
        context
    );
  }
}

export default ReportFactory;
