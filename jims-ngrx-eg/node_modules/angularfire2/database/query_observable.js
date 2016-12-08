import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/operator/combineLatest';
import { merge } from 'rxjs/operator/merge';
import { map } from 'rxjs/operator/map';
import { OrderByOptions, LimitToOptions } from '../interfaces';
export function observeQuery(query) {
    if (!isPresent(query)) {
        return observableOf(null);
    }
    return Observable.create(function (observer) {
        var obs = getOrderObservables(query);
        combineLatest.call(obs, getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query))
            .subscribe(function (_a) {
            var orderBy = _a[0], startAt = _a[1], endAt = _a[2], equalTo = _a[3], limitTo = _a[4];
            var serializedOrder = {};
            if (isPresent(orderBy) && isPresent(orderBy.value)) {
                switch (orderBy.key) {
                    case OrderByOptions.Key:
                        serializedOrder = { orderByKey: orderBy.value };
                        break;
                    case OrderByOptions.Priority:
                        serializedOrder = { orderByPriority: orderBy.value };
                        break;
                    case OrderByOptions.Value:
                        serializedOrder = { orderByValue: orderBy.value };
                        break;
                    case OrderByOptions.Child:
                        serializedOrder = { orderByChild: orderBy.value };
                        break;
                }
            }
            if (isPresent(limitTo) && isPresent(limitTo.value)) {
                switch (limitTo.key) {
                    case LimitToOptions.First:
                        serializedOrder.limitToFirst = limitTo.value;
                        break;
                    case LimitToOptions.Last: {
                        serializedOrder.limitToLast = limitTo.value;
                        break;
                    }
                }
            }
            if (isPresent(startAt)) {
                serializedOrder.startAt = startAt;
            }
            if (isPresent(endAt)) {
                serializedOrder.endAt = endAt;
            }
            if (isPresent(equalTo)) {
                serializedOrder.equalTo = equalTo;
            }
            observer.next(serializedOrder);
        });
    });
}
export function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority']
        .map(function (key, option) {
        return ({ key: key, option: option });
    })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToOrderBySelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        return merge.call(observables[0], observables.slice(1));
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
export function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast']
        .map(function (key, option) { return ({ key: key, option: option }); })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToLimitToSelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        var mergedObs = merge.call(observables[0], observables.slice(1));
        return mergedObs;
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
export function getStartAtObservable(query) {
    if (query.startAt instanceof Observable) {
        return query.startAt;
    }
    else if (typeof query.startAt !== 'undefined') {
        return new Observable(function (subscriber) {
            subscriber.next(query.startAt);
        });
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
export function getEndAtObservable(query) {
    if (query.endAt instanceof Observable) {
        return query.endAt;
    }
    else if (typeof query.endAt !== 'undefined') {
        return new Observable(function (subscriber) {
            subscriber.next(query.endAt);
        });
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
export function getEqualToObservable(query) {
    if (query.equalTo instanceof Observable) {
        return query.equalTo;
    }
    else if (typeof query.equalTo !== 'undefined') {
        return new Observable(function (subscriber) {
            subscriber.next(query.equalTo);
        });
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function mapToOrderBySelection(value, key) {
    if (value instanceof Observable) {
        return map
            .call(value, function (value) {
            return ({ value: value, key: key });
        });
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof Observable) {
        return map
            .call(value, function (value) { return ({ value: value, key: key }); });
    }
    else {
        return new Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function hasObservableProperties(query) {
    if (query.orderByKey instanceof Observable)
        return true;
    return false;
}
function isPresent(val) {
    return val !== undefined && val !== null;
}
//# sourceMappingURL=query_observable.js.map