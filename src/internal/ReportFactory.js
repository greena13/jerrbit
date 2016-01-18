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

const ReportFactory = function(customContext = {}){
  this.sharedReportData = objectMerge(DEFAULT_STATIC_PROPERTIES, {context: customContext});

  this.build = function(error, reportContext = {}){
    return new Report(error, objectMerge(this.sharedReportData, reportContext));
  }
};

export default ReportFactory;
