var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as firebase from 'firebase';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from '../tokens';
import { ZoneScheduler } from '../utils';
import { authDataToAuthState, AuthBackend, AuthProviders } from './auth_backend';
var _a = firebase.auth, FacebookAuthProvider = _a.FacebookAuthProvider, GithubAuthProvider = _a.GithubAuthProvider, GoogleAuthProvider = _a.GoogleAuthProvider, TwitterAuthProvider = _a.TwitterAuthProvider;
import { map } from 'rxjs/operator/map';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { observeOn } from 'rxjs/operator/observeOn';
export var FirebaseSdkAuthBackend = (function (_super) {
    __extends(FirebaseSdkAuthBackend, _super);
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
        var stateChange = Observable.create(function (observer) {
            return _this._fbAuth.onAuthStateChanged(observer);
        });
        var authState = map.call(stateChange, function (user) {
            if (!user)
                return null;
            return authDataToAuthState(user, user.providerData[0]);
        });
        return observeOn.call(authState, new ZoneScheduler(Zone.current));
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
        return fromPromise(castPromise(this._fbAuth.getRedirectResult()));
    };
    FirebaseSdkAuthBackend.prototype._enumToAuthProvider = function (providerId) {
        switch (providerId) {
            case AuthProviders.Github:
                return new GithubAuthProvider();
            case AuthProviders.Twitter:
                return new TwitterAuthProvider();
            case AuthProviders.Facebook:
                return new FacebookAuthProvider();
            case AuthProviders.Google:
                return new GoogleAuthProvider();
            default:
                throw new Error("Unsupported firebase auth provider " + providerId);
        }
    };
    FirebaseSdkAuthBackend.decorators = [
        { type: Injectable },
    ];
    FirebaseSdkAuthBackend.ctorParameters = [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseApp,] },] },
        null,
    ];
    return FirebaseSdkAuthBackend;
}(AuthBackend));
function castPromise(promiseLike) {
    return Promise.resolve(promiseLike);
}
//# sourceMappingURL=firebase_sdk_auth_backend.js.map