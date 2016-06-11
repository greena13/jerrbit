'use strict';

import objectMerge from 'object-merge';
import jerrbitDetails from '../../package.json';
import platform from 'platform';

import stackTrace from 'stack-trace';
import queryString from 'query-string';
import cookie from 'cookie';

const DEFAULT_STATIC_PROPERTIES = {
  context: {
    environment: 'development',
    os: platform.os.toString(),
    notifier: {
      name: jerrbitDetails.name,
      version: jerrbitDetails.version,
      url: jerrbitDetails.repository.url.slice(4)
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

class ReportFactory {
  constructor(customOptions = {}){
    this._sharedReportData = objectMerge(DEFAULT_STATIC_PROPERTIES, customOptions);
    this.environment = this._sharedReportData.context.environment;
  }

  build(error, reportContext = {}){
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

    return objectMerge(
        this._sharedReportData,
        generateRunTimeProperties(),
        { errors: [errorDescription] },
        reportContext
    );
  }
}

export default ReportFactory;
