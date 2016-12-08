import * as firebase from 'firebase';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AuthBackend, EmailPasswordCredentials, AuthConfiguration, FirebaseAuthState } from './auth_backend';
export declare const firebaseAuthConfig: (config: AuthConfiguration) => any;
export declare class AngularFireAuth extends ReplaySubject<FirebaseAuthState> {
    private _authBackend;
    private _config;
    private _credentialCache;
    constructor(_authBackend: AuthBackend, loc: any, _config?: AuthConfiguration);
    login(config?: AuthConfiguration): firebase.Promise<FirebaseAuthState>;
    login(credentials?: EmailPasswordCredentials | firebase.auth.AuthCredential | string): firebase.Promise<FirebaseAuthState>;
    login(credentials: EmailPasswordCredentials | firebase.auth.AuthCredential | string, config?: AuthConfiguration): firebase.Promise<FirebaseAuthState>;
    logout(): void;
    getAuth(): FirebaseAuthState;
    createUser(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState>;
    private _mergeConfigs(config);
    private _reject(msg);
    private _scrubConfig(config, scrubProvider?);
    private _emitAuthData(authData);
}
export declare class FirebaseAuth extends AngularFireAuth {
}
