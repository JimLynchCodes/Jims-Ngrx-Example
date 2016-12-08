import { Observable } from 'rxjs/Observable';
import { Query, ScalarQuery, OrderBySelection, LimitToSelection, Primitive } from '../interfaces';
export declare function observeQuery(query: Query): Observable<ScalarQuery>;
export declare function getOrderObservables(query: Query): Observable<OrderBySelection> | Observable<OrderBySelection | Observable<OrderBySelection>>;
export declare function getLimitToObservables(query: Query): Observable<LimitToSelection> | Observable<LimitToSelection | Observable<LimitToSelection>>;
export declare function getStartAtObservable(query: Query): Observable<Primitive>;
export declare function getEndAtObservable(query: Query): Observable<Primitive>;
export declare function getEqualToObservable(query: Query): Observable<Primitive>;
