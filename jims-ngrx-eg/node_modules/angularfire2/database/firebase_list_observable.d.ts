import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import { AFUnwrappedDataSnapshot, FirebaseOperationCases } from '../interfaces';
export declare type FirebaseOperation = string | firebase.database.Reference | firebase.database.DataSnapshot | AFUnwrappedDataSnapshot;
export declare class FirebaseListObservable<T> extends Observable<T> {
    $ref: firebase.database.Reference | firebase.database.Query;
    constructor($ref: firebase.database.Reference | firebase.database.Query, subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void);
    lift<T, R>(operator: Operator<T, R>): Observable<R>;
    push(val: any): firebase.database.ThenableReference;
    update(item: FirebaseOperation, value: Object): firebase.Promise<void>;
    remove(item?: FirebaseOperation): firebase.Promise<void>;
    _checkOperationCases(item: FirebaseOperation, cases: FirebaseOperationCases): firebase.Promise<void>;
}
