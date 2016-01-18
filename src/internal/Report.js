'use strict';

import fetch from 'fetchival';
import objectMerge from 'object-merge';
import stackTrace from 'stack-trace';
import queryString from 'query-string';
import cookie from 'cookie';

function generateRunTimeProperties(){
  return({
    context: {
      url: window.location.href
    },

    session: cookie.parse(document.cookie),
    params: queryString.parse(window.location.search)
  })
}

const Report = function(error, options){
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

  return objectMerge(objectMerge(generateRunTimeProperties(), options, {
      errors: [errorDescription]
    })
  );
};

export default Report;
