ORCID = {};

OAuth.registerService('orcid', 2, null, function (query) {

    var response = getTokens(query);
    var accessToken = response.accessToken;
    var orcid = response.orcid;

    var serviceData = {
        id: response.orcid,
        accessToken: OAuth.sealSecret(accessToken),
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    var whiteListed = ['access_token', 'token_type', 'refresh_token', 'expires_in', 'scope', 'orcid'];

    return {
        serviceData: serviceData,
	options: {
	}
    };
});

/* checks whether a string parses as JSON */
var isJSON = function (str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

/* returns an object containing:
 *     - accessToken
 *         - expiresIn: lifetime of token in seconds
 *         */
var getTokens = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'orcid'});
    if (!config)
        throw new ServiceConfiguration.ConfigError('Service not configured');

    var responseContent;
    try {
        /* Request an access token */
        responseContent = HTTP.post(
            'https://pub.orcid.org/oauth/token', {
                params: {
 		    client_id: config.clientId,
		    client_secret: config.secret,
                    grant_type: 'authorization_code',
                    redirect_uri: OAuth._redirectUri('orcid', config),
		    code: query.code
                }
            }).content;
    } catch (err) {
        throw new Error('Failed to complete OAuth handshake with ORCID. ' + err.message);
    }

    /* If 'responseContent' does not parse as JSON, it is an error. */
    if (!isJSON(responseContent)) {
        throw new Error('Failed to complete OAuth handshake with ORCID. ' + responseContent);
    }

    /* Success! Extract response elements */
    var parsedResponse = JSON.parse(responseContent);
    var accessToken = parsedResponse.access_token;
    var tokenType = parsedResponse.token_type;
    var refreshToken = parsedResponse.refresh_token;
    var expiresIn = parsedResponse.expires_in;
    var scope = parsedResponse.scope;
    var orcid = parsedResponse.orcid;

    if (!accessToken) {
        throw new Error("Failed to complete OAuth handshake with ORCID " +
            "-- can't find access token in HTTP response. " + responseContent);
    }

    return {
        accessToken: accessToken,
	tokenType: tokenType,
	refreshToken: refreshToken,
        expiresIn: expiresIn,
	score: scope,
	orcid: orcid
    };
};

ORCID.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret)
};

