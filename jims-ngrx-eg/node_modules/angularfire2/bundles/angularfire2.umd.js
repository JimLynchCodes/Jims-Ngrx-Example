(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('firebase'), require('rxjs/scheduler/queue'), require('@angular/core'), require('rxjs/ReplaySubject'), require('rxjs/operator/mergeMap'), require('rxjs/observable/of'), require('rxjs/operator/map'), require('rxjs/Observable'), require('rxjs/observable/fromPromise'), require('rxjs/operator/observeOn'), require('rxjs/operator/combineLatest'), require('rxjs/operator/merge')) :
    typeof define === 'function' && define.amd ? define(['exports', 'firebase', 'rxjs/scheduler/queue', '@angular/core', 'rxjs/ReplaySubject', 'rxjs/operator/mergeMap', 'rxjs/observable/of', 'rxjs/operator/map', 'rxjs/Observable', 'rxjs/observable/fromPromise', 'rxjs/operator/observeOn', 'rxjs/operator/combineLatest', 'rxjs/operator/merge'], factory) :
    (factory((global.angularFire2 = global.angularFire2 || {}),global.firebase,global.Rx.Scheduler,global.ng.core,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,firebase,rxjs_scheduler_queue,_angular_core,rxjs_ReplaySubject,rxjs_operator_mergeMap,rxjs_observable_of,rxjs_operator_map,rxjs_Observable,rxjs_observable_fromPromise,rxjs_operator_observeOn,rxjs_operator_combineLatest,rxjs_operator_merge) { 'use strict';

function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
function isString(value) {
    return typeof value === 'string';
}
function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
function isAFUnwrappedSnapshot(value) {
    return typeof value.$key === 'string';
}
function isFirebaseQuery(value) {
    return typeof value.orderByChild === 'function';
}
function isEmptyObject(obj) {
    if (!isPresent(obj)) {
        return false;
    }
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
function unwrapMapFn(snapshot) {
    var unwrapped = isPresent(snapshot.val()) ? snapshot.val() : { $value: null };
    if ((/string|number|boolean/).test(typeof unwrapped)) {
        unwrapped = {
            $value: unwrapped
        };
    }
    unwrapped.$key = snapshot.ref.key;
    unwrapped.$exists = function () {
        return snapshot.exists();
    };
    return unwrapped;
}
function checkForUrlOrFirebaseRef(urlOrRef, cases) {
    if (isString(urlOrRef)) {
        return cases.isUrl();
    }
    if (isFirebaseRef(urlOrRef)) {
        return cases.isRef();
    }
    if (isFirebaseQuery(urlOrRef)) {
        return cases.isQuery();
    }
    throw new Error('Provide a url or a Firebase database reference');
}
function stripTrailingSlash(value) {
    if (value.substring(value.length - 1, value.length) === '/') {
        return value.substring(0, value.length - 1);
    }
    else {
        return value;
    }
}
function stripLeadingSlash(value) {
    if (value.substring(0, 1) === '/') {
        return value.substring(1, value.length);
    }
    else {
        return value;
    }
}
var ZoneScheduler = (function () {
    function ZoneScheduler(zone) {
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.zone.run(function () { return rxjs_scheduler_queue.queue.schedule.apply(rxjs_scheduler_queue.queue, args); });
    };
    return ZoneScheduler;
}());

var FirebaseConfig = new _angular_core.OpaqueToken('FirebaseUrl');
var FirebaseApp = new _angular_core.OpaqueToken('FirebaseApp');
var FirebaseAuthConfig = new _angular_core.OpaqueToken('FirebaseAuthConfig');
var FirebaseUserConfig = new _angular_core.OpaqueToken('FirebaseUserConfig');
var WindowLocation = new _angular_core.OpaqueToken('WindowLocation');
var FirebaseRef = FirebaseApp;
var FirebaseUrl = FirebaseConfig;

var AuthBackend = (function () {
    function AuthBackend() {
    }
    return AuthBackend;
}());

(function (AuthProviders) {
    AuthProviders[AuthProviders["Github"] = 0] = "Github";
    AuthProviders[AuthProviders["Twitter"] = 1] = "Twitter";
    AuthProviders[AuthProviders["Facebook"] = 2] = "Facebook";
    AuthProviders[AuthProviders["Google"] = 3] = "Google";
    AuthProviders[AuthProviders["Password"] = 4] = "Password";
    AuthProviders[AuthProviders["Anonymous"] = 5] = "Anonymous";
    AuthProviders[AuthProviders["Custom"] = 6] = "Custom";
})(exports.AuthProviders || (exports.AuthProviders = {}));


(function (AuthMethods) {
    AuthMethods[AuthMethods["Popup"] = 0] = "Popup";
    AuthMethods[AuthMethods["Redirect"] = 1] = "Redirect";
    AuthMethods[AuthMethods["Anonymous"] = 2] = "Anonymous";
    AuthMethods[AuthMethods["Password"] = 3] = "Password";
    AuthMethods[AuthMethods["OAuthToken"] = 4] = "OAuthToken";
    AuthMethods[AuthMethods["CustomToken"] = 5] = "CustomToken";
})(exports.AuthMethods || (exports.AuthMethods = {}));

function authDataToAuthState(authData, providerData) {
    if (!authData)
        return null;
    var providerId;
    var uid = authData.uid;
    var authState = { auth: authData, uid: uid, provider: null };
    if (authData.isAnonymous) {
        providerId = 'anonymous';
        authState.provider = exports.AuthProviders.Anonymous;
        authState.anonymous = true;
        return authState;
    }
    else if (authData.providerData[0] === undefined || authData.providerData[0] === null) {
        providerId = 'custom';
        authState.provider = exports.AuthProviders.Custom;
        return authState;
    }
    else {
        providerId = authData.providerData[0].providerId;
    }
    switch (providerId) {
        case 'github.com':
            authState.github = providerData;
            authState.provider = exports.AuthProviders.Github;
            break;
        case 'twitter.com':
            authState.twitter = providerData;
            authState.provider = exports.AuthProviders.Twitter;
            break;
        case 'facebook.com':
            authState.facebook = providerData;
            authState.provider = exports.AuthProviders.Facebook;
            break;
        case 'google.com':
            authState.google = providerData;
            authState.provider = exports.AuthProviders.Google;
            break;
        case 'password':
            authState.provider = exports.AuthProviders.Password;
            break;
        case 'custom':
            authState.provider = exports.AuthProviders.Custom;
            break;
        default:
            throw new Error("Unsupported firebase auth provider " + providerId);
    }
    return authState;
}
function stripProviderId(providerId) {
    var providerStripped = /(.*)\.com$/.exec(providerId);
    if (providerStripped && providerStripped.length === 2) {
        return providerStripped[1];
    }
    return null;
}

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var kBufferSize = 1;
var firebaseAuthConfig = function (config) {
    return { provide: FirebaseAuthConfig, useValue: config };
};
var AngularFireAuth = (function (_super) {
    __extends(AngularFireAuth, _super);
    function AngularFireAuth(_authBackend, loc, _config) {
        var _this = this;
        _super.call(this, kBufferSize);
        this._authBackend = _authBackend;
        this._config = _config;
        this._credentialCache = {};
        var firstPass = true;
        var onAuth = this._authBackend.onAuth();
        rxjs_operator_mergeMap.mergeMap.call(onAuth, function (authState) {
            if (firstPass) {
                firstPass = false;
                if (['http:', 'https:'].indexOf(loc.protocol) > -1) {
                    return rxjs_operator_map.map.call(_this._authBackend.getRedirectResult(), function (userCredential) {
                        if (userCredential && userCredential.credential) {
                            authState = attachCredentialToAuthState(authState, userCredential.credential, userCredential.credential.provider);
                            _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                        }
                        return authState;
                    });
                }
            }
            return rxjs_observable_of.of(authState);
        })
            .subscribe(function (authData) { return _this._emitAuthData(authData); });
    }
    AngularFireAuth.prototype.login = function (obj1, obj2) {
        var _this = this;
        var config = null;
        var credentials = null;
        if (arguments.length > 2) {
            return this._reject('Login only accepts a maximum of two arguments.');
        }
        else if (arguments.length == 2) {
            credentials = obj1;
            config = obj2;
        }
        else if (arguments.length == 1) {
            if (obj1.password && obj1.email) {
                credentials = obj1;
                config = {};
            }
            else {
                config = obj1;
            }
        }
        config = this._mergeConfigs(config);
        if (!isPresent(config.method)) {
            return this._reject('You must provide a login method');
        }
        var providerMethods = [exports.AuthMethods.Popup, exports.AuthMethods.Redirect, exports.AuthMethods.OAuthToken];
        if (providerMethods.indexOf(config.method) != -1) {
            if (!isPresent(config.provider)) {
                return this._reject('You must include a provider to use this auth method.');
            }
        }
        var credentialsMethods = [exports.AuthMethods.Password, exports.AuthMethods.OAuthToken, exports.AuthMethods.CustomToken];
        if (credentialsMethods.indexOf(config.method) != -1) {
            if (!credentials) {
                return this._reject('You must include credentials to use this auth method.');
            }
        }
        switch (config.method) {
            case exports.AuthMethods.Popup:
                return this._authBackend.authWithOAuthPopup(config.provider, this._scrubConfig(config))
                    .then(function (userCredential) {
                    _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                    return authDataToAuthState(userCredential.user, userCredential.credential);
                });
            case exports.AuthMethods.Redirect:
                return this._authBackend.authWithOAuthRedirect(config.provider, this._scrubConfig(config));
            case exports.AuthMethods.Anonymous:
                return this._authBackend.authAnonymously(this._scrubConfig(config));
            case exports.AuthMethods.Password:
                return this._authBackend.authWithPassword(credentials);
            case exports.AuthMethods.OAuthToken:
                return this._authBackend.authWithOAuthToken(credentials, this._scrubConfig(config));
            case exports.AuthMethods.CustomToken:
                return this._authBackend.authWithCustomToken(credentials);
        }
    };
    AngularFireAuth.prototype.logout = function () {
        this._authBackend.unauth();
    };
    AngularFireAuth.prototype.getAuth = function () {
        console.warn("WARNING: the getAuth() API has changed behavior since adding support for Firebase 3.\n    This will return null for the initial value when the page loads, even if the user is actually logged in.\n    Please observe the actual authState asynchronously by subscribing to the auth service: af.auth.subscribe().\n    The getAuth method will be removed in future releases");
        return this._authBackend.getAuth();
    };
    AngularFireAuth.prototype.createUser = function (credentials) {
        return this._authBackend.createUser(credentials);
    };
    AngularFireAuth.prototype._mergeConfigs = function (config) {
        if (this._config == null)
            return config;
        return Object.assign({}, this._config, config);
    };
    AngularFireAuth.prototype._reject = function (msg) {
        return (new Promise(function (res, rej) {
            return rej(msg);
        }));
    };
    AngularFireAuth.prototype._scrubConfig = function (config, scrubProvider) {
        if (scrubProvider === void 0) { scrubProvider = true; }
        var scrubbed = Object.assign({}, config);
        if (scrubProvider) {
            delete scrubbed.provider;
        }
        delete scrubbed.method;
        return scrubbed;
    };
    AngularFireAuth.prototype._emitAuthData = function (authData) {
        if (authData == null) {
            this.next(null);
        }
        else {
            if (authData.auth && authData.auth.providerData && authData.auth.providerData[0]) {
                var providerId = authData.auth.providerData[0].providerId;
                var providerCredential = this._credentialCache[providerId];
                if (providerCredential) {
                    authData = attachCredentialToAuthState(authData, providerCredential, providerId);
                }
            }
            this.next(authData);
        }
    };
    AngularFireAuth.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireAuth.ctorParameters = [
        { type: AuthBackend, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [WindowLocation,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [FirebaseAuthConfig,] },] },
    ];
    return AngularFireAuth;
}(rxjs_ReplaySubject.ReplaySubject));
function attachCredentialToAuthState(authState, credential, providerId) {
    if (!authState)
        return authState;
    authState[stripProviderId(providerId)] = credential;
    return authState;
}
var FirebaseAuth = (function (_super) {
    __extends(FirebaseAuth, _super);
    function FirebaseAuth() {
        _super.apply(this, arguments);
    }
    return FirebaseAuth;
}(AngularFireAuth));

var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _a = firebase.auth;
var FacebookAuthProvider = _a.FacebookAuthProvider;
var GithubAuthProvider = _a.GithubAuthProvider;
var GoogleAuthProvider = _a.GoogleAuthProvider;
var TwitterAuthProvider = _a.TwitterAuthProvider;
var FirebaseSdkAuthBackend = (function (_super) {
    __extends$1(FirebaseSdkAuthBackend, _super);
    function FirebaseSdkAuthBackend(_fbApp, _webWorkerMode) {
        if (_webWorkerMode === void 0) { _webWorkerMode = false; }
        _super.call(this);
        this._webWorkerMode = _webWorkerMode;
        this._fbAuth = _fbApp.auth();
    }
    FirebaseSdkAuthBackend.prototype.createUser = function (creds) {
        return castPromise(this._fbAuth.createUserWithEmailAndPassword(creds.email, creds.password))
            .then(function (user) { return authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.getAuth = function () {
        return authDataToAuthState(this._fbAuth.currentUser);
    };
    FirebaseSdkAuthBackend.prototype.onAuth = function () {
        var _this = this;
        var stateChange = rxjs_Observable.Observable.create(function (observer) {
            return _this._fbAuth.onAuthStateChanged(observer);
        });
        var authState = rxjs_operator_map.map.call(stateChange, function (user) {
            if (!user)
                return null;
            return authDataToAuthState(user, user.providerData[0]);
        });
        return rxjs_operator_observeOn.observeOn.call(authState, new ZoneScheduler(Zone.current));
    };
    FirebaseSdkAuthBackend.prototype.unauth = function () {
        Promise.resolve(this._fbAuth.signOut());
    };
    FirebaseSdkAuthBackend.prototype.authWithCustomToken = function (token) {
        return castPromise((this._fbAuth.signInWithCustomToken(token)))
            .then(function (user) { return authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authAnonymously = function () {
        return castPromise(this._fbAuth.signInAnonymously())
            .then(function (user) { return authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authWithPassword = function (creds) {
        return castPromise(this._fbAuth.signInWithEmailAndPassword(creds.email, creds.password))
            .then(function (user) { return authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthPopup = function (provider, options) {
        var providerFromFirebase = this._enumToAuthProvider(provider);
        if (options.scope) {
            options.scope.forEach(function (scope) { return providerFromFirebase.addScope(scope); });
        }
        return castPromise(this._fbAuth.signInWithPopup(providerFromFirebase));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthRedirect = function (provider, options) {
        return castPromise(this._fbAuth.signInWithRedirect(this._enumToAuthProvider(provider)));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthToken = function (credential) {
        return castPromise(this._fbAuth.signInWithCredential(credential))
            .then(function (user) { return authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.getRedirectResult = function () {
        return rxjs_observable_fromPromise.fromPromise(castPromise(this._fbAuth.getRedirectResult()));
    };
    FirebaseSdkAuthBackend.prototype._enumToAuthProvider = function (providerId) {
        switch (providerId) {
            case exports.AuthProviders.Github:
                return new GithubAuthProvider();
            case exports.AuthProviders.Twitter:
                return new TwitterAuthProvider();
            case exports.AuthProviders.Facebook:
                return new FacebookAuthProvider();
            case exports.AuthProviders.Google:
                return new GoogleAuthProvider();
            default:
                throw new Error("Unsupported firebase auth provider " + providerId);
        }
    };
    FirebaseSdkAuthBackend.decorators = [
        { type: _angular_core.Injectable },
    ];
    FirebaseSdkAuthBackend.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [FirebaseApp,] },] },
        null,
    ];
    return FirebaseSdkAuthBackend;
}(AuthBackend));
function castPromise(promiseLike) {
    return Promise.resolve(promiseLike);
}

var __extends$2 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AngularFireDatabase$$1 = (function () {
    function AngularFireDatabase$$1(fbConfig, fbApp) {
        this.fbConfig = fbConfig;
        this.fbApp = fbApp;
    }
    AngularFireDatabase$$1.prototype.list = function (urlOrRef, opts) {
        var _this = this;
        return checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return FirebaseListFactory(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return FirebaseListFactory(urlOrRef); }
        });
    };
    AngularFireDatabase$$1.prototype.object = function (urlOrRef, opts) {
        var _this = this;
        return checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return FirebaseObjectFactory$$1(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return FirebaseObjectFactory$$1(urlOrRef); }
        });
    };
    AngularFireDatabase$$1.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireDatabase$$1.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [FirebaseConfig,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [FirebaseApp,] },] },
    ];
    return AngularFireDatabase$$1;
}());
var FirebaseDatabase$$1 = (function (_super) {
    __extends$2(FirebaseDatabase$$1, _super);
    function FirebaseDatabase$$1() {
        _super.apply(this, arguments);
    }
    return FirebaseDatabase$$1;
}(AngularFireDatabase$$1));
function getAbsUrl(root, url) {
    if (!(/^[a-z]+:\/\/.*/.test(url))) {
        url = root.databaseURL + '/' + stripLeadingSlash(url);
    }
    return url;
}

var __extends$3 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FirebaseListObservable = (function (_super) {
    __extends$3(FirebaseListObservable, _super);
    function FirebaseListObservable($ref, subscribe) {
        _super.call(this, subscribe);
        this.$ref = $ref;
    }
    FirebaseListObservable.prototype.lift = function (operator) {
        var observable = new FirebaseListObservable(this.$ref);
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    };
    FirebaseListObservable.prototype.push = function (val) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.ref.push(val);
    };
    FirebaseListObservable.prototype.update = function (item, value) {
        var _this = this;
        return this._checkOperationCases(item, {
            stringCase: function () { return _this.$ref.ref.child(item).update(value); },
            firebaseCase: function () { return item.update(value); },
            snapshotCase: function () { return item.ref.update(value); },
            unwrappedSnapshotCase: function () { return _this.$ref.ref.child(item.$key).update(value); }
        });
    };
    FirebaseListObservable.prototype.remove = function (item) {
        var _this = this;
        if (!item) {
            return this.$ref.ref.remove();
        }
        return this._checkOperationCases(item, {
            stringCase: function () { return _this.$ref.ref.child(item).remove(); },
            firebaseCase: function () { return item.remove(); },
            snapshotCase: function () { return item.ref.remove(); },
            unwrappedSnapshotCase: function () { return _this.$ref.ref.child(item.$key).remove(); }
        });
    };
    FirebaseListObservable.prototype._checkOperationCases = function (item, cases) {
        if (isString(item)) {
            return cases.stringCase();
        }
        else if (isFirebaseRef(item)) {
            return cases.firebaseCase();
        }
        else if (isFirebaseDataSnapshot(item)) {
            return cases.snapshotCase();
        }
        else if (isAFUnwrappedSnapshot(item)) {
            return cases.unwrappedSnapshotCase();
        }
        throw new Error("Method requires a key, snapshot, reference, or unwrapped snapshot. Got: " + typeof item);
    };
    return FirebaseListObservable;
}(rxjs_Observable.Observable));

var OrderByOptions;
(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Child"] = 0] = "Child";
    OrderByOptions[OrderByOptions["Key"] = 1] = "Key";
    OrderByOptions[OrderByOptions["Value"] = 2] = "Value";
    OrderByOptions[OrderByOptions["Priority"] = 3] = "Priority";
})(OrderByOptions || (OrderByOptions = {}));
var LimitToOptions;
(function (LimitToOptions) {
    LimitToOptions[LimitToOptions["First"] = 0] = "First";
    LimitToOptions[LimitToOptions["Last"] = 1] = "Last";
})(LimitToOptions || (LimitToOptions = {}));
var QueryOptions;
(function (QueryOptions) {
    QueryOptions[QueryOptions["EqualTo"] = 0] = "EqualTo";
    QueryOptions[QueryOptions["StartAt"] = 1] = "StartAt";
    QueryOptions[QueryOptions["EndAt"] = 2] = "EndAt";
})(QueryOptions || (QueryOptions = {}));

function observeQuery(query) {
    if (!isPresent$1(query)) {
        return rxjs_observable_of.of(null);
    }
    return rxjs_Observable.Observable.create(function (observer) {
        var obs = getOrderObservables(query);
        rxjs_operator_combineLatest.combineLatest.call(obs, getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query))
            .subscribe(function (_a) {
            var orderBy = _a[0], startAt = _a[1], endAt = _a[2], equalTo = _a[3], limitTo = _a[4];
            var serializedOrder = {};
            if (isPresent$1(orderBy) && isPresent$1(orderBy.value)) {
                switch (orderBy.key) {
                    case OrderByOptions.Key:
                        serializedOrder = { orderByKey: orderBy.value };
                        break;
                    case OrderByOptions.Priority:
                        serializedOrder = { orderByPriority: orderBy.value };
                        break;
                    case OrderByOptions.Value:
                        serializedOrder = { orderByValue: orderBy.value };
                        break;
                    case OrderByOptions.Child:
                        serializedOrder = { orderByChild: orderBy.value };
                        break;
                }
            }
            if (isPresent$1(limitTo) && isPresent$1(limitTo.value)) {
                switch (limitTo.key) {
                    case LimitToOptions.First:
                        serializedOrder.limitToFirst = limitTo.value;
                        break;
                    case LimitToOptions.Last: {
                        serializedOrder.limitToLast = limitTo.value;
                        break;
                    }
                }
            }
            if (isPresent$1(startAt)) {
                serializedOrder.startAt = startAt;
            }
            if (isPresent$1(endAt)) {
                serializedOrder.endAt = endAt;
            }
            if (isPresent$1(equalTo)) {
                serializedOrder.equalTo = equalTo;
            }
            observer.next(serializedOrder);
        });
    });
}
function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority']
        .map(function (key, option) {
        return ({ key: key, option: option });
    })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent$1(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToOrderBySelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        return rxjs_operator_merge.merge.call(observables[0], observables.slice(1));
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast']
        .map(function (key, option) { return ({ key: key, option: option }); })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent$1(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToLimitToSelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        var mergedObs = rxjs_operator_merge.merge.call(observables[0], observables.slice(1));
        return mergedObs;
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getStartAtObservable(query) {
    if (query.startAt instanceof rxjs_Observable.Observable) {
        return query.startAt;
    }
    else if (typeof query.startAt !== 'undefined') {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.startAt);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getEndAtObservable(query) {
    if (query.endAt instanceof rxjs_Observable.Observable) {
        return query.endAt;
    }
    else if (typeof query.endAt !== 'undefined') {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.endAt);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getEqualToObservable(query) {
    if (query.equalTo instanceof rxjs_Observable.Observable) {
        return query.equalTo;
    }
    else if (typeof query.equalTo !== 'undefined') {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.equalTo);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function mapToOrderBySelection(value, key) {
    if (value instanceof rxjs_Observable.Observable) {
        return rxjs_operator_map.map
            .call(value, function (value) {
            return ({ value: value, key: key });
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof rxjs_Observable.Observable) {
        return rxjs_operator_map.map
            .call(value, function (value) { return ({ value: value, key: key }); });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function isPresent$1(val) {
    return val !== undefined && val !== null;
}

function FirebaseListFactory(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, _c = _b.query, query = _c === void 0 ? {} : _c;
    var ref;
    checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function () { return ref = firebase.database().refFromURL(absoluteUrlOrDbRef); },
        isRef: function () { return ref = absoluteUrlOrDbRef; },
        isQuery: function () { return ref = absoluteUrlOrDbRef; },
    });
    if ((isFirebaseRef(absoluteUrlOrDbRef) ||
        isString(absoluteUrlOrDbRef)) &&
        isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot: preserveSnapshot });
    }
    var queryObs = observeQuery(query);
    return new FirebaseListObservable(ref, function (subscriber) {
        var sub = rxjs_operator_mergeMap.mergeMap.call(rxjs_operator_map.map.call(queryObs, function (query) {
            var queried = ref;
            if (query.orderByChild) {
                queried = queried.orderByChild(query.orderByChild);
            }
            else if (query.orderByKey) {
                queried = queried.orderByKey();
            }
            else if (query.orderByPriority) {
                queried = queried.orderByPriority();
            }
            else if (query.orderByValue) {
                queried = queried.orderByValue();
            }
            if (isPresent(query.equalTo)) {
                queried = queried.equalTo(query.equalTo);
                if (isPresent(query.startAt) || query.endAt) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (isPresent(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (isPresent(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (isPresent(query.startAt)) {
                queried = queried.startAt(query.startAt);
            }
            if (isPresent(query.endAt)) {
                queried = queried.endAt(query.endAt);
            }
            if (isPresent(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (isPresent(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (isPresent(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        }), function (queryRef, ix) {
            return firebaseListObservable(queryRef, { preserveSnapshot: preserveSnapshot });
        })
            .subscribe(subscriber);
        return function () { return sub.unsubscribe(); };
    });
}
function firebaseListObservable(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var listObs = new FirebaseListObservable(ref, function (obs) {
        var arr = [];
        var hasInitialLoad = false;
        ref.once('value', function (snap) {
            hasInitialLoad = true;
            obs.next(preserveSnapshot ? arr : arr.map(unwrapMapFn));
        }).catch(function (err) {
            obs.error(err);
            obs.complete();
        });
        var addFn = ref.on('child_added', function (child, prevKey) {
            arr = onChildAdded(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var remFn = ref.on('child_removed', function (child) {
            arr = onChildRemoved(arr, child);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var chgFn = ref.on('child_changed', function (child, prevKey) {
            arr = onChildChanged(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () {
            ref.off('child_added', addFn);
            ref.off('child_removed', remFn);
            ref.off('child_changed', chgFn);
        };
    });
    return rxjs_operator_observeOn.observeOn.call(listObs, new ZoneScheduler(Zone.current));
}
function onChildAdded(arr, child, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce(function (accumulator, curr, i) {
        if (!prevKey && i === 0) {
            accumulator.push(child);
        }
        accumulator.push(curr);
        if (prevKey && prevKey === curr.key) {
            accumulator.push(child);
        }
        return accumulator;
    }, []);
}
function onChildChanged(arr, child, prevKey) {
    return arr.reduce(function (accumulator, val, i) {
        if (!prevKey && i == 0) {
            accumulator.push(child);
            if (val.key !== child.key) {
                accumulator.push(val);
            }
        }
        else if (val.key === prevKey) {
            accumulator.push(val);
            accumulator.push(child);
        }
        else if (val.key !== child.key) {
            accumulator.push(val);
        }
        return accumulator;
    }, []);
}
function onChildRemoved(arr, child) {
    return arr.filter(function (c) { return c.key !== child.key; });
}

function FirebaseObjectFactory$$1(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, query = _b.query;
    var ref;
    checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function () { return ref = firebase.database().refFromURL(absoluteUrlOrDbRef); },
        isRef: function () { return ref = absoluteUrlOrDbRef; }
    });
    var objectObservable = new FirebaseObjectObservable(function (obs) {
        var fn = ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off('value', fn); };
    }, ref);
    return rxjs_operator_observeOn.observeOn.call(objectObservable, new ZoneScheduler(Zone.current));
}

var __extends$4 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FirebaseObjectObservable = (function (_super) {
    __extends$4(FirebaseObjectObservable, _super);
    function FirebaseObjectObservable(subscribe, $ref) {
        _super.call(this, subscribe);
        this.$ref = $ref;
    }
    FirebaseObjectObservable.prototype.lift = function (operator) {
        var observable = new FirebaseObjectObservable();
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    };
    FirebaseObjectObservable.prototype.set = function (value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.set(value);
    };
    FirebaseObjectObservable.prototype.update = function (value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.update(value);
    };
    FirebaseObjectObservable.prototype.remove = function () {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.remove();
    };
    return FirebaseObjectObservable;
}(rxjs_Observable.Observable));

var AngularFire = (function () {
    function AngularFire(firebaseConfig, auth$$1, database$$1) {
        this.firebaseConfig = firebaseConfig;
        this.auth = auth$$1;
        this.database = database$$1;
    }
    AngularFire.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFire.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [FirebaseConfig,] },] },
        { type: AngularFireAuth, },
        { type: AngularFireDatabase$$1, },
    ];
    return AngularFire;
}());
function _getFirebase(config) {
    try {
        return firebase.initializeApp(config);
    }
    catch (e) {
        return firebase.app(null);
    }
}
function _getWindowLocation() {
    return window.location;
}
function _getAuthBackend(app$$1) {
    return new FirebaseSdkAuthBackend(app$$1, false);
}
function _getDefaultFirebase(config) {
    config.databaseURL = stripTrailingSlash(config.databaseURL);
    return config;
}
var COMMON_PROVIDERS = [
    { provide: FirebaseAuth,
        useExisting: AngularFireAuth
    },
    {
        provide: FirebaseApp,
        useFactory: _getFirebase,
        deps: [FirebaseConfig]
    },
    AngularFireAuth,
    AngularFire,
    AngularFireDatabase$$1
];
var FIREBASE_PROVIDERS = [
    COMMON_PROVIDERS,
    {
        provide: AuthBackend,
        useFactory: _getAuthBackend,
        deps: [FirebaseApp]
    },
    {
        provide: WindowLocation,
        useFactory: _getWindowLocation
    },
];
var defaultFirebase = function (config) {
    return [
        { provide: FirebaseUserConfig, useValue: config },
        { provide: FirebaseConfig, useFactory: _getDefaultFirebase, deps: [FirebaseUserConfig] }
    ];
};
var AngularFireModule = (function () {
    function AngularFireModule() {
    }
    AngularFireModule.initializeApp = function (config, authConfig) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseUserConfig, useValue: config },
                { provide: FirebaseConfig, useFactory: _getDefaultFirebase, deps: [FirebaseUserConfig] },
                { provide: FirebaseAuthConfig, useValue: authConfig }
            ]
        };
    };
    AngularFireModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: FIREBASE_PROVIDERS
                },] },
    ];
    AngularFireModule.ctorParameters = [];
    return AngularFireModule;
}());

exports.AngularFire = AngularFire;
exports._getFirebase = _getFirebase;
exports._getWindowLocation = _getWindowLocation;
exports._getAuthBackend = _getAuthBackend;
exports._getDefaultFirebase = _getDefaultFirebase;
exports.COMMON_PROVIDERS = COMMON_PROVIDERS;
exports.FIREBASE_PROVIDERS = FIREBASE_PROVIDERS;
exports.defaultFirebase = defaultFirebase;
exports.AngularFireModule = AngularFireModule;
exports.AngularFireAuth = AngularFireAuth;
exports.AngularFireDatabase = AngularFireDatabase$$1;
exports.FirebaseAuth = FirebaseAuth;
exports.FirebaseDatabase = FirebaseDatabase$$1;
exports.FirebaseListObservable = FirebaseListObservable;
exports.FirebaseObjectObservable = FirebaseObjectObservable;
exports.FirebaseListFactory = FirebaseListFactory;
exports.FirebaseObjectFactory = FirebaseObjectFactory$$1;
exports.firebaseAuthConfig = firebaseAuthConfig;
exports.WindowLocation = WindowLocation;
exports.FirebaseConfig = FirebaseConfig;
exports.FirebaseApp = FirebaseApp;
exports.FirebaseAuthConfig = FirebaseAuthConfig;
exports.FirebaseRef = FirebaseRef;
exports.FirebaseUrl = FirebaseUrl;
exports.FirebaseUserConfig = FirebaseUserConfig;

Object.defineProperty(exports, '__esModule', { value: true });

})));
