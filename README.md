# Jerrbit

Report client-side, browser events and exceptions to an Errbit or Airbrake service

## Usage

```javascript
var Client = require('jerrbit').Client;

var errbitClient = new Client({
  host: 'http://errbit.your-service.com',
  projectKey: 'ProjectAPIKey',
  environment: 'production'
});

try {
  // Your application code here

} catch(error){
  errbitClient.notify(error, {
    version: '1.1.1'  
  });
  
  throw(error);
}
```

## Options

`Jerrbit.Client` requires the following options to configure which Errbit server to use.

- `host`: The URL of the Errbit server
- `projectKey`: The API key for the project you wish log the errors against


### Airbrake Options

Jerrbit supports all of the [Airbrake V3 API properties](https://airbrake.io/docs/#create-notice-v3) and a lot of them Jerrbit sets for you, but all values can be overwritten if you need.

| Field | Required | Supplied by Errbit | Default value is set in | Description |
| ----- | -------- | ------------------ | ----------- |
| errors| Yes | Yes | `notify` | An array of objects describing the error that occurred. |
| errors/{i}/type | Yes| Yes | `notify` |  The class name or type of error that occurred. |
| errors/{i}/message| No | Yes | `notify` | A short message describing the error that occurred. |
| errors/{i}/backtrace| Yes| Yes | `notify` | 	An array of objects describing each line of the error’s backtrace. |
| errors/{i}/backtrace/{i}/file | Yes| Yes | `notify` | 	The full path of the file in this entry of the backtrace. |
| errors/{i}/backtrace/{i}/line | No | Yes | `notify` | The file’s line number in this entry of the backtrace. |
| errors/{i}/backtrace/{i}/column | No | Yes | `notify` | The line’s column number in this entry of the backtrace. |
| errors/{i}/backtrace/{i}/function | No | Yes | `notify` | When available, the function or method name in this entry of the backtrace. |
| context | No | No |  | An object describing additional context for this error. |
| context/notifier| Yes| No |  | An object describing the notifier client library. |
| context/notifier/name | Yes| Yes | `new` | he name of the notifier client submitting the request, e.g. “airbrake-js”. |
| context/notifier/version| Yes| Yes | `new` | 	The version number of the notifier client submitting the request, e.g. “1.2.3”. |
| context/notifier/url| Yes| Yes | `new` | 	A URL at which more information can be obtained concerning the notifier client. |
| context/environment | No | 'development' | `new` |  The name of the server environment in which the error occurred, e.g. “staging”, “production”, etc. |
| context/component	 | No| No |  | 	The component or module in which the error occurred. In MVC frameworks like Rails, this should be set to the controller. Otherwise, this can be set to a route or other request category. |
| context/action| No | No |  |  The action in which the error occurred. If each request is routed to a controller action, this should be set here. Otherwise, this can be set to a method or other request subcategory. |
| context/os| No | Yes |  `new` |  Details of the operating system on which the error occurred. |
| context/language| No | 'JavaScript' |  `new` | Describe the language on which the error occurred, e.g. “Ruby 2.1.1”. |
| context/version | No | No |  | Describe the application version, e.g. “v1.2.3”. |
| context/url | No | Yes | `notify` | The application’s URL. |
| context/userAgent | No | Yes | `new` | The requesting browser’s full user-agent string. |
| context/rootDirectory | No | No |  | The application’s root directory path. |
| context/user/id | No | No |   | If applicable, the current user’s ID. |
| context/user/name | No | No |  |  If applicable, the current user’s username. |
| context/user/email| No | No |  |  If applicable, the current user’s email address. |
| environment | No | No |  |  An object containing the current environment variables. Where the key is the variable name, e.g. { "PORT": "443", "CODE_NAME": "gorilla" }. |
| session | No | Yes | `notify` | An object containing the current session variables. Where the key is the variable name, e.g. { "basket_total": "1234", "user_id": "123" }. |
| params| No | Yes | `notify` | An object containing the request parameters. Where the key is the parameter name, e.g. { "page": "3", "sort": "desc" }. |

### Overwriting the default context values

You can overwrite the default values by either specifying them when instantiating `Client` or when calling `notify`. Values that are not expected to change over the course of your application should be specified when instantiating `Client`. 

```javascript
var errbitClient = new Client({
  host: 'http://errbit.your-service.com',
  projectKey: 'ProjectAPIKey',
  environment: 'production',
  context: {
    language: 'JavaScript & XML'
  }
});
```

Those values that can change should be set using `notify`. These values must be specified each time `notify` is called or they may be overwritten with the default values.

```javascript
errbitClient.notify(error, {
  context: {
    user: window.user
  }
});
```
