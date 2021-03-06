/**
 * Create and export configuration variables
 */


const environments = {};

// Staging (default) environment

environments.staging = {
    "httpPort": 3000,
    "httpsPort": 3001,
    "envName": "staging"
}

// Production environment


environments.production = {
   "httpPort": 5000,
   "httpsPort": 5001,
   "envName": "production"
}

const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport;
