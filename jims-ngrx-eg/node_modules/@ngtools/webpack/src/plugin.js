"use strict";
var fs = require('fs');
var path = require('path');
var ts = require('typescript');
var core_1 = require('@angular/core');
var ngCompiler = require('@angular/compiler-cli');
var tsc_1 = require('@angular/tsc-wrapped/src/tsc');
var reflector_host_1 = require('./reflector_host');
var resource_loader_1 = require('./resource_loader');
var utils_1 = require('./utils');
var compiler_host_1 = require('./compiler_host');
var entry_resolver_1 = require('./entry_resolver');
var compiler_cli_1 = require('@angular/compiler-cli');
var paths_plugin_1 = require('./paths-plugin');
var ModuleRoute = (function () {
    function ModuleRoute(path, className) {
        if (className === void 0) { className = null; }
        this.path = path;
        this.className = className;
    }
    ModuleRoute.prototype.toString = function () {
        return this.path + "#" + this.className;
    };
    ModuleRoute.fromString = function (entry) {
        var split = entry.split('#');
        return new ModuleRoute(split[0], split[1]);
    };
    return ModuleRoute;
}());
exports.ModuleRoute = ModuleRoute;
var AotPlugin = (function () {
    function AotPlugin(options) {
        this._compiler = null;
        this._compilation = null;
        this._typeCheck = true;
        this._skipCodeGeneration = false;
        this._setupOptions(options);
    }
    Object.defineProperty(AotPlugin.prototype, "basePath", {
        get: function () { return this._basePath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "compilation", {
        get: function () { return this._compilation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "compilerHost", {
        get: function () { return this._compilerHost; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "compilerOptions", {
        get: function () { return this._compilerOptions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "done", {
        get: function () { return this._donePromise; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "entryModule", {
        get: function () { return this._entryModule; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "genDir", {
        get: function () { return this._genDir; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "program", {
        get: function () { return this._program; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "skipCodeGeneration", {
        get: function () { return this._skipCodeGeneration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AotPlugin.prototype, "typeCheck", {
        get: function () { return this._typeCheck; },
        enumerable: true,
        configurable: true
    });
    AotPlugin.prototype._setupOptions = function (options) {
        // Fill in the missing options.
        if (!options.hasOwnProperty('tsConfigPath')) {
            throw new Error('Must specify "tsConfigPath" in the configuration of @ngtools/webpack.');
        }
        this._tsConfigPath = options.tsConfigPath;
        // Check the base path.
        var maybeBasePath = path.resolve(process.cwd(), this._tsConfigPath);
        var basePath = maybeBasePath;
        if (fs.statSync(maybeBasePath).isFile()) {
            basePath = path.dirname(basePath);
        }
        if (options.hasOwnProperty('basePath')) {
            basePath = path.resolve(process.cwd(), options.basePath);
        }
        var tsConfig = tsc_1.tsc.readConfiguration(this._tsConfigPath, basePath);
        this._rootFilePath = tsConfig.parsed.fileNames
            .filter(function (fileName) { return !/\.spec\.ts$/.test(fileName); });
        // Check the genDir.
        var genDir = basePath;
        if (tsConfig.ngOptions.hasOwnProperty('genDir')) {
            genDir = tsConfig.ngOptions.genDir;
        }
        this._compilerOptions = tsConfig.parsed.options;
        this._angularCompilerOptions = Object.assign({}, tsConfig.ngOptions, { basePath: basePath, genDir: genDir });
        this._basePath = basePath;
        this._genDir = genDir;
        if (options.hasOwnProperty('typeChecking')) {
            this._typeCheck = options.typeChecking;
        }
        if (options.hasOwnProperty('skipCodeGeneration')) {
            this._skipCodeGeneration = options.skipCodeGeneration;
        }
        this._compilerHost = new compiler_host_1.WebpackCompilerHost(this._compilerOptions, this._basePath);
        this._program = ts.createProgram(this._rootFilePath, this._compilerOptions, this._compilerHost);
        if (options.entryModule) {
            this._entryModule = ModuleRoute.fromString(options.entryModule);
        }
        else {
            if (options.mainPath) {
                var entryModuleString = entry_resolver_1.resolveEntryModuleFromMain(options.mainPath, this._compilerHost, this._program);
                this._entryModule = ModuleRoute.fromString(entryModuleString);
            }
            else {
                this._entryModule = ModuleRoute.fromString(tsConfig.ngOptions.entryModule);
            }
        }
        this._reflectorHost = new ngCompiler.ReflectorHost(this._program, this._compilerHost, this._angularCompilerOptions);
        this._reflector = new ngCompiler.StaticReflector(this._reflectorHost);
    };
    // registration hook for webpack plugin
    AotPlugin.prototype.apply = function (compiler) {
        var _this = this;
        this._compiler = compiler;
        compiler.plugin('context-module-factory', function (cmf) {
            cmf.plugin('before-resolve', function (request, callback) {
                if (!request) {
                    return callback();
                }
                request.request = _this.skipCodeGeneration ? _this.basePath : _this.genDir;
                request.recursive = true;
                request.dependencies.forEach(function (d) { return d.critical = false; });
                return callback(null, request);
            });
            cmf.plugin('after-resolve', function (result, callback) {
                if (!result) {
                    return callback();
                }
                _this.done.then(function () {
                    result.resource = _this.skipCodeGeneration ? _this.basePath : _this.genDir;
                    result.recursive = true;
                    result.dependencies.forEach(function (d) { return d.critical = false; });
                    result.resolveDependencies = utils_1.createResolveDependenciesFromContextMap(function (_, cb) { return cb(null, _this._lazyRoutes); });
                    return callback(null, result);
                }).catch(function (err) { return callback(err); });
            });
        });
        compiler.plugin('make', function (compilation, cb) { return _this._make(compilation, cb); });
        compiler.plugin('after-emit', function (compilation, cb) {
            _this._donePromise = null;
            _this._compilation = null;
            compilation._ngToolsWebpackPluginInstance = null;
            cb();
        });
        // Virtual file system.
        compiler.resolvers.normal.plugin('resolve', function (request, cb) {
            if (request.request.match(/\.ts$/)) {
                _this.done.then(function () { return cb(); });
            }
            else {
                cb();
            }
        });
        compiler.resolvers.normal.apply(new paths_plugin_1.PathsPlugin({
            tsConfigPath: this._tsConfigPath,
            compilerOptions: this._compilerOptions,
            compilerHost: this._compilerHost
        }));
    };
    AotPlugin.prototype._make = function (compilation, cb) {
        var _this = this;
        this._compilation = compilation;
        if (this._compilation._ngToolsWebpackPluginInstance) {
            cb(new Error('An @ngtools/webpack plugin already exist for this compilation.'));
        }
        this._compilation._ngToolsWebpackPluginInstance = this;
        this._resourceLoader = new resource_loader_1.WebpackResourceLoader(compilation);
        var i18nOptions = {
            i18nFile: undefined,
            i18nFormat: undefined,
            locale: undefined,
            basePath: this.basePath
        };
        var promise = Promise.resolve();
        if (!this._skipCodeGeneration) {
            // Create the Code Generator.
            var codeGenerator_1 = ngCompiler.CodeGenerator.create(this._angularCompilerOptions, i18nOptions, this._program, this._compilerHost, new ngCompiler.NodeReflectorHostContext(this._compilerHost), this._resourceLoader);
            // We need to temporarily patch the CodeGenerator until either it's patched or allows us
            // to pass in our own ReflectorHost.
            // TODO: remove this.
            reflector_host_1.patchReflectorHost(codeGenerator_1);
            promise = promise.then(function () { return codeGenerator_1.codegen({
                transitiveModules: true
            }); });
        }
        this._donePromise = promise
            .then(function () {
            // Create a new Program, based on the old one. This will trigger a resolution of all
            // transitive modules, which include files that might just have been generated.
            // This needs to happen after the code generator has been created for generated files
            // to be properly resolved.
            _this._program = ts.createProgram(_this._rootFilePath, _this._compilerOptions, _this._compilerHost, _this._program);
        })
            .then(function () {
            var diagnostics = _this._program.getGlobalDiagnostics();
            if (diagnostics.length > 0) {
                var message = diagnostics
                    .map(function (diagnostic) {
                    var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                    var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    return diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message + ")";
                })
                    .join('\n');
                throw new Error(message);
            }
        })
            .then(function () {
            // Populate the file system cache with the virtual module.
            _this._compilerHost.populateWebpackResolver(_this._compiler.resolvers.normal);
        })
            .then(function () {
            // Process the lazy routes
            _this._lazyRoutes = {};
            var allLazyRoutes = _this._processNgModule(_this._entryModule, null);
            Object.keys(allLazyRoutes)
                .forEach(function (k) {
                var lazyRoute = allLazyRoutes[k];
                if (_this.skipCodeGeneration) {
                    _this._lazyRoutes[k] = lazyRoute.absolutePath + '.ts';
                }
                else {
                    _this._lazyRoutes[k + '.ngfactory'] = lazyRoute.absoluteGenDirPath + '.ngfactory.ts';
                }
            });
        })
            .then(function () { return cb(); }, function (err) { cb(err); });
    };
    AotPlugin.prototype._resolveModulePath = function (module, containingFile) {
        if (module.path.startsWith('.')) {
            return path.join(path.dirname(containingFile), module.path);
        }
        return module.path;
    };
    AotPlugin.prototype._processNgModule = function (module, containingFile) {
        var _this = this;
        var modulePath = containingFile ? module.path : ('./' + path.basename(module.path));
        if (containingFile === null) {
            containingFile = module.path + '.ts';
        }
        var relativeModulePath = this._resolveModulePath(module, containingFile);
        var staticSymbol = this._reflectorHost
            .findDeclaration(modulePath, module.className, containingFile);
        var entryNgModuleMetadata = this.getNgModuleMetadata(staticSymbol);
        var loadChildrenRoute = this.extractLoadChildren(entryNgModuleMetadata)
            .map(function (route) {
            var moduleRoute = ModuleRoute.fromString(route);
            var resolvedModule = ts.resolveModuleName(moduleRoute.path, relativeModulePath, _this._compilerOptions, _this._compilerHost);
            if (!resolvedModule.resolvedModule) {
                throw new Error("Could not resolve route \"" + route + "\" from file \"" + relativeModulePath + "\".");
            }
            var relativePath = path.relative(_this.basePath, resolvedModule.resolvedModule.resolvedFileName).replace(/\.ts$/, '');
            var absolutePath = path.join(_this.basePath, relativePath);
            var absoluteGenDirPath = path.join(_this._genDir, relativePath);
            return {
                moduleRoute: moduleRoute,
                absoluteGenDirPath: absoluteGenDirPath,
                absolutePath: absolutePath
            };
        });
        var resultMap = loadChildrenRoute
            .reduce(function (acc, curr) {
            var key = curr.moduleRoute.path;
            if (acc[key]) {
                if (acc[key].absolutePath != curr.absolutePath) {
                    throw new Error(("Duplicated path in loadChildren detected: \"" + key + "\" is used in 2 ") +
                        'loadChildren, but they point to different modules. Webpack cannot distinguish ' +
                        'between the two based on context and would fail to load the proper one.');
                }
            }
            else {
                acc[key] = curr;
            }
            return acc;
        }, {});
        // Also concatenate every child of child modules.
        var _loop_1 = function(lazyRoute) {
            var mr = lazyRoute.moduleRoute;
            var children = this_1._processNgModule(mr, relativeModulePath);
            Object.keys(children).forEach(function (p) {
                var child = children[p];
                var key = child.moduleRoute.path;
                if (resultMap[key]) {
                    if (resultMap[key].absolutePath != child.absolutePath) {
                        throw new Error(("Duplicated path in loadChildren detected: \"" + key + "\" is used in 2 ") +
                            'loadChildren, but they point to different modules. Webpack cannot distinguish ' +
                            'between the two based on context and would fail to load the proper one.');
                    }
                }
                else {
                    resultMap[key] = child;
                }
            });
        };
        var this_1 = this;
        for (var _i = 0, loadChildrenRoute_1 = loadChildrenRoute; _i < loadChildrenRoute_1.length; _i++) {
            var lazyRoute = loadChildrenRoute_1[_i];
            _loop_1(lazyRoute);
        }
        return resultMap;
    };
    AotPlugin.prototype.getNgModuleMetadata = function (staticSymbol) {
        var ngModules = this._reflector.annotations(staticSymbol).filter(function (s) { return s instanceof core_1.NgModule; });
        if (ngModules.length === 0) {
            throw new Error(staticSymbol.name + " is not an NgModule");
        }
        return ngModules[0];
    };
    AotPlugin.prototype.extractLoadChildren = function (ngModuleDecorator) {
        var _this = this;
        var routes = (ngModuleDecorator.imports || []).reduce(function (mem, m) {
            return mem.concat(_this.collectRoutes(m.providers));
        }, this.collectRoutes(ngModuleDecorator.providers));
        return this.collectLoadChildren(routes)
            .concat((ngModuleDecorator.imports || [])
            .map(function (staticSymbol) {
            if (staticSymbol instanceof compiler_cli_1.StaticSymbol) {
                var entryNgModuleMetadata = _this.getNgModuleMetadata(staticSymbol);
                return _this.extractLoadChildren(entryNgModuleMetadata);
            }
            else {
                return [];
            }
        })
            .reduce(function (acc, i) { return acc.concat(i); }, []))
            .filter(function (x) { return !!x; });
    };
    AotPlugin.prototype.collectRoutes = function (providers) {
        var _this = this;
        if (!providers) {
            return [];
        }
        var ROUTES = this._reflectorHost.findDeclaration('@angular/router/src/router_config_loader', 'ROUTES', undefined);
        return providers.reduce(function (m, p) {
            if (p.provide === ROUTES) {
                return m.concat(p.useValue);
            }
            else if (Array.isArray(p)) {
                return m.concat(_this.collectRoutes(p));
            }
            else {
                return m;
            }
        }, []);
    };
    AotPlugin.prototype.collectLoadChildren = function (routes) {
        var _this = this;
        if (!routes) {
            return [];
        }
        return routes.reduce(function (m, r) {
            if (r.loadChildren) {
                return m.concat(r.loadChildren);
            }
            else if (Array.isArray(r)) {
                return m.concat(_this.collectLoadChildren(r));
            }
            else if (r.children) {
                return m.concat(_this.collectLoadChildren(r.children));
            }
            else {
                return m;
            }
        }, []);
    };
    return AotPlugin;
}());
exports.AotPlugin = AotPlugin;
//# sourceMappingURL=/Users/hansl/Sources/angular-cli/packages/webpack/src/plugin.js.map