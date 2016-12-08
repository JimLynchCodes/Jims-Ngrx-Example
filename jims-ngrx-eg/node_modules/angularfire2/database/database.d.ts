import * as firebase from 'firebase';
import { FirebaseAppConfig } from '../angularfire2';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from '../interfaces';
import { FirebaseListObservable, FirebaseObjectObservable } from './index';
export declare class AngularFireDatabase {
    private fbConfig;
    private fbApp;
    constructor(fbConfig: FirebaseAppConfig, fbApp: any);
    list(urlOrRef: string | firebase.database.Reference, opts?: FirebaseListFactoryOpts): FirebaseListObservable<any[]>;
    object(urlOrRef: string | firebase.database.Reference, opts?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
}
export declare class FirebaseDatabase extends AngularFireDatabase {
}
