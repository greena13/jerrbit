'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/jerrbit.min.js');
} else {
  module.exports = require('./cjs/jerrbit.js');
}
