import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
export declare abstract class AuthBackend {
    abstract authWithCustomToken(token: string): Promise<FirebaseAuthState>;
    abstract authAnonymously(options?: any): Promise<FirebaseAuthState>;
    abstract authWithPassword(credentials: EmailPasswordCredentials): Promise<FirebaseAuthState>;
    abstract authWithOAuthPopup(provider: AuthProviders, options?: any): Promise<firebase.auth.UserCredential>;
    abstract authWithOAuthRedirect(provider: AuthProviders, options?: any): Promise<void>;
    abstract authWithOAuthToken(credentialsObj: firebase.auth.AuthCredential, options?: any): Promise<FirebaseAuthState>;
    abstract onAuth(): Observable<FirebaseAuthState>;
    abstract getAuth(): FirebaseAuthState;
    abstract unauth(): void;
    abstract createUser(credentials: EmailPasswordCredentials): Promise<FirebaseAuthState>;
    abstract getRedirectResult(): Observable<firebase.auth.UserCredential>;
}
export declare enum AuthProviders {
    Github = 0,
    Twitter = 1,
    Facebook = 2,
    Google = 3,
    Password = 4,
    Anonymous = 5,
    Custom = 6,
}
export declare enum AuthMethods {
    Popup = 0,
    Redirect = 1,
    Anonymous = 2,
    Password = 3,
    OAuthToken = 4,
    CustomToken = 5,
}
export interface AuthConfiguration {
    method?: AuthMethods;
    provider?: AuthProviders;
    scope?: string[];
}
export interface FirebaseAuthState {
    uid: string;
    provider: AuthProviders;
    auth: firebase.User;
    expires?: number;
    github?: firebase.UserInfo;
    google?: firebase.UserInfo;
    twitter?: firebase.UserInfo;
    facebook?: firebase.UserInfo;
    anonymous?: boolean;
}
export declare function authDataToAuthState(authData: firebase.User, providerData?: firebase.UserInfo): FirebaseAuthState;
export declare function stripProviderId(providerId: string): string;
export interface EmailPasswordCredentials {
    email: string;
    password: string;
}
