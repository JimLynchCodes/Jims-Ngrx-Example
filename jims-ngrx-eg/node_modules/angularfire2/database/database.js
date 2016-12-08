var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, FirebaseConfig } from '../tokens';
import { FirebaseListFactory } from './index';
import * as utils from '../utils';
import { FirebaseObjectFactory } from './index';
export var AngularFireDatabase = (function () {
    function AngularFireDatabase(fbConfig, fbApp) {
        this.fbConfig = fbConfig;
        this.fbApp = fbApp;
    }
    AngularFireDatabase.prototype.list = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return FirebaseListFactory(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return FirebaseListFactory(urlOrRef); }
        });
    };
    AngularFireDatabase.prototype.object = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return FirebaseObjectFactory(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return FirebaseObjectFactory(urlOrRef); }
        });
    };
    AngularFireDatabase.decorators = [
        { type: Injectable },
    ];
    AngularFireDatabase.ctorParameters = [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseConfig,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseApp,] },] },
    ];
    return AngularFireDatabase;
}());
export var FirebaseDatabase = (function (_super) {
    __extends(FirebaseDatabase, _super);
    function FirebaseDatabase() {
        _super.apply(this, arguments);
    }
    return FirebaseDatabase;
}(AngularFireDatabase));
function getAbsUrl(root, url) {
    if (!(/^[a-z]+:\/\/.*/.test(url))) {
        url = root.databaseURL + '/' + utils.stripLeadingSlash(url);
    }
    return url;
}
//# sourceMappingURL=database.js.map