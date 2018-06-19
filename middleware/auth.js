/* Authentication middlewares */

/* Auth0 authentication  */
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwtksRsa = require('jwks-rsa');
const process = require('process');

module.exports = {
    checkJwt: jwt({
    // Dynamically provide signing key based on kid in the header and signing key provided by jwks endpoint.
    secret: jwtksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWKS_URI
    }),
  
    // Validate the audience and the issuer
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: process.env.ALGORITHMS
  })
}
