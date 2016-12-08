import { FirebaseObjectObservable } from './index';
import * as firebase from 'firebase';
import { FirebaseObjectFactoryOpts } from '../interfaces';
export declare function FirebaseObjectFactory(absoluteUrlOrDbRef: string | firebase.database.Reference, {preserveSnapshot, query}?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
