import * as firebase from 'firebase';
import * as utils from './utils';
import { FirebaseConfig, FirebaseApp, WindowLocation, FirebaseUserConfig, FirebaseAuthConfig } from './tokens';
import { Inject, Injectable, NgModule } from '@angular/core';
import { FirebaseSdkAuthBackend, AngularFireAuth, firebaseAuthConfig, FirebaseAuth, AuthBackend, AuthMethods, AuthProviders } from './auth/index';
import { FirebaseListObservable, FirebaseObjectObservable, FirebaseListFactory, FirebaseObjectFactory, AngularFireDatabase, FirebaseDatabase } from './database/index';
export var AngularFire = (function () {
    function AngularFire(firebaseConfig, auth, database) {
        this.firebaseConfig = firebaseConfig;
        this.auth = auth;
        this.database = database;
    }
    AngularFire.decorators = [
        { type: Injectable },
    ];
    AngularFire.ctorParameters = [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseConfig,] },] },
        { type: AngularFireAuth, },
        { type: AngularFireDatabase, },
    ];
    return AngularFire;
}());
export function _getFirebase(config) {
    try {
        return firebase.initializeApp(config);
    }
    catch (e) {
        return firebase.app(null);
    }
}
export function _getWindowLocation() {
    return window.location;
}
export function _getAuthBackend(app) {
    return new FirebaseSdkAuthBackend(app, false);
}
export function _getDefaultFirebase(config) {
    config.databaseURL = utils.stripTrailingSlash(config.databaseURL);
    return config;
}
export var COMMON_PROVIDERS = [
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
    AngularFireDatabase
];
export var FIREBASE_PROVIDERS = [
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
export var defaultFirebase = function (config) {
    return [
        { provide: FirebaseUserConfig, useValue: config },
        { provide: FirebaseConfig, useFactory: _getDefaultFirebase, deps: [FirebaseUserConfig] }
    ];
};
export var AngularFireModule = (function () {
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
        { type: NgModule, args: [{
                    providers: FIREBASE_PROVIDERS
                },] },
    ];
    AngularFireModule.ctorParameters = [];
    return AngularFireModule;
}());
export { AngularFireAuth, AngularFireDatabase, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseObjectObservable, FirebaseListFactory, FirebaseObjectFactory, firebaseAuthConfig, AuthMethods, AuthProviders, WindowLocation };
export { FirebaseConfig, FirebaseApp, FirebaseAuthConfig, FirebaseRef, FirebaseUrl, FirebaseUserConfig } from './tokens';
//# sourceMappingURL=angularfire2.js.map