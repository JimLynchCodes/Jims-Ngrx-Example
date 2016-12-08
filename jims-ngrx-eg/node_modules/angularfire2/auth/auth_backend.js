export var AuthBackend = (function () {
    function AuthBackend() {
    }
    return AuthBackend;
}());
export var AuthProviders;
(function (AuthProviders) {
    AuthProviders[AuthProviders["Github"] = 0] = "Github";
    AuthProviders[AuthProviders["Twitter"] = 1] = "Twitter";
    AuthProviders[AuthProviders["Facebook"] = 2] = "Facebook";
    AuthProviders[AuthProviders["Google"] = 3] = "Google";
    AuthProviders[AuthProviders["Password"] = 4] = "Password";
    AuthProviders[AuthProviders["Anonymous"] = 5] = "Anonymous";
    AuthProviders[AuthProviders["Custom"] = 6] = "Custom";
})(AuthProviders || (AuthProviders = {}));
;
export var AuthMethods;
(function (AuthMethods) {
    AuthMethods[AuthMethods["Popup"] = 0] = "Popup";
    AuthMethods[AuthMethods["Redirect"] = 1] = "Redirect";
    AuthMethods[AuthMethods["Anonymous"] = 2] = "Anonymous";
    AuthMethods[AuthMethods["Password"] = 3] = "Password";
    AuthMethods[AuthMethods["OAuthToken"] = 4] = "OAuthToken";
    AuthMethods[AuthMethods["CustomToken"] = 5] = "CustomToken";
})(AuthMethods || (AuthMethods = {}));
;
export function authDataToAuthState(authData, providerData) {
    if (!authData)
        return null;
    var providerId;
    var uid = authData.uid;
    var authState = { auth: authData, uid: uid, provider: null };
    if (authData.isAnonymous) {
        providerId = 'anonymous';
        authState.provider = AuthProviders.Anonymous;
        authState.anonymous = true;
        return authState;
    }
    else if (authData.providerData[0] === undefined || authData.providerData[0] === null) {
        providerId = 'custom';
        authState.provider = AuthProviders.Custom;
        return authState;
    }
    else {
        providerId = authData.providerData[0].providerId;
    }
    switch (providerId) {
        case 'github.com':
            authState.github = providerData;
            authState.provider = AuthProviders.Github;
            break;
        case 'twitter.com':
            authState.twitter = providerData;
            authState.provider = AuthProviders.Twitter;
            break;
        case 'facebook.com':
            authState.facebook = providerData;
            authState.provider = AuthProviders.Facebook;
            break;
        case 'google.com':
            authState.google = providerData;
            authState.provider = AuthProviders.Google;
            break;
        case 'password':
            authState.provider = AuthProviders.Password;
            break;
        case 'custom':
            authState.provider = AuthProviders.Custom;
            break;
        default:
            throw new Error("Unsupported firebase auth provider " + providerId);
    }
    return authState;
}
export function stripProviderId(providerId) {
    var providerStripped = /(.*)\.com$/.exec(providerId);
    if (providerStripped && providerStripped.length === 2) {
        return providerStripped[1];
    }
    return null;
}
//# sourceMappingURL=auth_backend.js.map