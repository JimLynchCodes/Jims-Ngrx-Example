import * as firebase from 'firebase';
import { FirebaseListObservable } from './firebase_list_observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { observeQuery } from './query_observable';
import * as utils from '../utils';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { map } from 'rxjs/operator/map';
export function FirebaseListFactory(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, _c = _b.query, query = _c === void 0 ? {} : _c;
    var ref;
    utils.checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function () { return ref = firebase.database().refFromURL(absoluteUrlOrDbRef); },
        isRef: function () { return ref = absoluteUrlOrDbRef; },
        isQuery: function () { return ref = absoluteUrlOrDbRef; },
    });
    if ((utils.isFirebaseRef(absoluteUrlOrDbRef) ||
        utils.isString(absoluteUrlOrDbRef)) &&
        utils.isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot: preserveSnapshot });
    }
    var queryObs = observeQuery(query);
    return new FirebaseListObservable(ref, function (subscriber) {
        var sub = mergeMap.call(map.call(queryObs, function (query) {
            var queried = ref;
            if (query.orderByChild) {
                queried = queried.orderByChild(query.orderByChild);
            }
            else if (query.orderByKey) {
                queried = queried.orderByKey();
            }
            else if (query.orderByPriority) {
                queried = queried.orderByPriority();
            }
            else if (query.orderByValue) {
                queried = queried.orderByValue();
            }
            if (utils.isPresent(query.equalTo)) {
                queried = queried.equalTo(query.equalTo);
                if (utils.isPresent(query.startAt) || query.endAt) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (utils.isPresent(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (utils.isPresent(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (utils.isPresent(query.startAt)) {
                queried = queried.startAt(query.startAt);
            }
            if (utils.isPresent(query.endAt)) {
                queried = queried.endAt(query.endAt);
            }
            if (utils.isPresent(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (utils.isPresent(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (utils.isPresent(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        }), function (queryRef, ix) {
            return firebaseListObservable(queryRef, { preserveSnapshot: preserveSnapshot });
        })
            .subscribe(subscriber);
        return function () { return sub.unsubscribe(); };
    });
}
function firebaseListObservable(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var listObs = new FirebaseListObservable(ref, function (obs) {
        var arr = [];
        var hasInitialLoad = false;
        ref.once('value', function (snap) {
            hasInitialLoad = true;
            obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
        }).catch(function (err) {
            obs.error(err);
            obs.complete();
        });
        var addFn = ref.on('child_added', function (child, prevKey) {
            arr = onChildAdded(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var remFn = ref.on('child_removed', function (child) {
            arr = onChildRemoved(arr, child);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var chgFn = ref.on('child_changed', function (child, prevKey) {
            arr = onChildChanged(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () {
            ref.off('child_added', addFn);
            ref.off('child_removed', remFn);
            ref.off('child_changed', chgFn);
        };
    });
    return observeOn.call(listObs, new utils.ZoneScheduler(Zone.current));
}
export function onChildAdded(arr, child, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce(function (accumulator, curr, i) {
        if (!prevKey && i === 0) {
            accumulator.push(child);
        }
        accumulator.push(curr);
        if (prevKey && prevKey === curr.key) {
            accumulator.push(child);
        }
        return accumulator;
    }, []);
}
export function onChildChanged(arr, child, prevKey) {
    return arr.reduce(function (accumulator, val, i) {
        if (!prevKey && i == 0) {
            accumulator.push(child);
            if (val.key !== child.key) {
                accumulator.push(val);
            }
        }
        else if (val.key === prevKey) {
            accumulator.push(val);
            accumulator.push(child);
        }
        else if (val.key !== child.key) {
            accumulator.push(val);
        }
        return accumulator;
    }, []);
}
export function onChildRemoved(arr, child) {
    return arr.filter(function (c) { return c.key !== child.key; });
}
export function onChildUpdated(arr, child, prevKey) {
    return arr.map(function (v, i, arr) {
        if (!prevKey && !i) {
            return child;
        }
        else if (i > 0 && arr[i - 1].key === prevKey) {
            return child;
        }
        else {
            return v;
        }
    });
}
//# sourceMappingURL=firebase_list_factory.js.map