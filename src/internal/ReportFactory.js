'use strict';

import Report from './Report';
import objectMerge from 'object-merge';
import jerrbitDetails from '../../package.json';
import platform from 'platform';

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

const ReportFactory = function(customOptions = {}){
  const sharedReportData = objectMerge(DEFAULT_STATIC_PROPERTIES, customOptions);
  this.environment = sharedReportData.context.environment;

  this.build = function(error, reportContext = {}){
    return new Report(error, objectMerge(sharedReportData, reportContext));
  }
};

export default ReportFactory;
