import * as firebase from 'firebase';
import { FirebaseListObservable } from './firebase_list_observable';
import { FirebaseListFactoryOpts } from '../interfaces';
export declare function FirebaseListFactory(absoluteUrlOrDbRef: string | firebase.database.Reference | firebase.database.Query, {preserveSnapshot, query}?: FirebaseListFactoryOpts): FirebaseListObservable<any>;
export declare function onChildAdded(arr: any[], child: any, prevKey: string): any[];
export declare function onChildChanged(arr: any[], child: any, prevKey: string): any[];
export declare function onChildRemoved(arr: any[], child: any): any[];
export declare function onChildUpdated(arr: any[], child: any, prevKey: string): any[];
