// Type definitions for Jerrbit
// Project: jerrbit

/**
 * Client for Errbit or Airbrake monitoring service, capable of reporting
 * errors and the context in which they occur, when they happen.
 */
export default class Client {
    /**
     * Creates a new instance of Client
     */
    constructor(options: {

        /**
         * The host url to send all exception reports to.
         */
        host: string,

        /**
         * The id of the project registered in Airbrake or Errbit. If unspecified, the
         * projectKey is used instead.
         */
        projectId?: string,

        /**
         * The key of the project registered in Airbrake or Errbit. This value is only
         * used if projectId is not specified.
         */
        projectKey?: string,

        /**
         * List of environments where errors should ignored service.
         */
        ignoredEnvironments?: Array<string>
    } = { host: 'https://api.airbrake.io', ignoredEnvironments: ['development', 'test'] });

    /**
     * Sends an error report to the monitoring service if the environment is
     * not listed in ignoredEnvironments
     */
    notify(exception: Error, context?: {
        context?: {
            /**
             * The url on which the error occurred. This is automatically set, if left
             * unspecified.
             */
            url: string,
        },

        /**
         * An object containing the current url's query parameters. This is
         * automatically set, if left unspecified.
         */
        params?: object,

        /**
         * An object containing the contents of the user's current session. This is
         * automatically set, if left unspecified.
         */
        session?: object,
    });
}
