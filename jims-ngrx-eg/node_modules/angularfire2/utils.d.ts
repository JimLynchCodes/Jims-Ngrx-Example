import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';
import { AFUnwrappedDataSnapshot } from './interfaces';
export declare function isPresent(obj: any): boolean;
export declare function isString(value: any): boolean;
export declare function isFirebaseRef(value: any): boolean;
export declare function isFirebaseDataSnapshot(value: any): boolean;
export declare function isAFUnwrappedSnapshot(value: any): boolean;
export declare function isFirebaseQuery(value: any): boolean;
export declare function isEmptyObject(obj: Object): boolean;
export interface CheckUrlRef {
    isUrl: () => any;
    isRef: () => any;
    isQuery?: () => any;
}
export declare function unwrapMapFn(snapshot: firebase.database.DataSnapshot): AFUnwrappedDataSnapshot;
export declare function checkForUrlOrFirebaseRef(urlOrRef: string | firebase.database.Reference | firebase.database.Query, cases: CheckUrlRef): any;
export declare function stripTrailingSlash(value: string): string;
export declare function stripLeadingSlash(value: string): string;
export declare class ZoneScheduler {
    zone: Zone;
    constructor(zone: Zone);
    schedule(...args: any[]): Subscription;
}
