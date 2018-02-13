'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/jerrbit.production.min.js');
} else {
  module.exports = require('./cjs/jerrbit.development.js');
}
