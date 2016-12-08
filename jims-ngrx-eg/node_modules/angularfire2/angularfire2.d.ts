import * as firebase from 'firebase';
import { FirebaseAppConfig } from './interfaces';
import { AuthConfiguration } from './auth';
import { WindowLocation } from './tokens';
import { ModuleWithProviders } from '@angular/core';
import { FirebaseSdkAuthBackend, AngularFireAuth, firebaseAuthConfig, FirebaseAuth, AuthMethods, AuthProviders, FirebaseAuthState } from './auth/index';
import { FirebaseListObservable, FirebaseObjectObservable, FirebaseListFactory, FirebaseObjectFactory, AngularFireDatabase, FirebaseDatabase } from './database/index';
export declare class AngularFire {
    private firebaseConfig;
    auth: AngularFireAuth;
    database: AngularFireDatabase;
    constructor(firebaseConfig: string, auth: AngularFireAuth, database: AngularFireDatabase);
}
export declare function _getFirebase(config: FirebaseAppConfig): firebase.app.App;
export declare function _getWindowLocation(): Location;
export declare function _getAuthBackend(app: firebase.app.App): FirebaseSdkAuthBackend;
export declare function _getDefaultFirebase(config: any): any;
export declare const COMMON_PROVIDERS: any[];
export declare const FIREBASE_PROVIDERS: any[];
export declare const defaultFirebase: (config: FirebaseAppConfig) => any;
export declare class AngularFireModule {
    static initializeApp(config: FirebaseAppConfig, authConfig?: AuthConfiguration): ModuleWithProviders;
}
export { AngularFireAuth, AngularFireDatabase, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseObjectObservable, FirebaseListFactory, FirebaseObjectFactory, firebaseAuthConfig, FirebaseAuthState, AuthMethods, AuthProviders, WindowLocation };
export { FirebaseConfig, FirebaseApp, FirebaseAuthConfig, FirebaseRef, FirebaseUrl, FirebaseUserConfig } from './tokens';
export { FirebaseAppConfig } from './interfaces';
