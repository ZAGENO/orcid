ORCID = {};

/* Request ORCID credentials */
ORCID.requestCredential = function (options, credentialRequestCompleteCallback) {
    /* support a callback without options */
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({
        service: 'orcid'
    });
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle('orcid', config, options);

    var loginUrl =
        'https://www.orcid.org/oauth/authorize?' +
	    'state=' + OAuth._stateParam(loginStyle, credentialToken) +
	    '&client_id=' + config.clientId +
	    '&response_type=code&' + 
            '&scope=/authenticate' +
	    '&show_login=true' +  
	    '&redirect_uri=' + OAuth._redirectUri('orcid', config);

    OAuth.launchLogin({
        loginService: 'orcid',
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};
