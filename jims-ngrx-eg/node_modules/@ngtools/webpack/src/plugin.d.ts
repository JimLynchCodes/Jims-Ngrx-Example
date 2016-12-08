import * as ts from 'typescript';
import { WebpackCompilerHost } from './compiler_host';
import { Tapable } from './webpack';
/**
 * Option Constants
 */
export interface AotPluginOptions {
    tsConfigPath: string;
    basePath?: string;
    entryModule?: string;
    mainPath?: string;
    typeChecking?: boolean;
    skipCodeGeneration?: boolean;
}
export interface LazyRoute {
    moduleRoute: ModuleRoute;
    absolutePath: string;
    absoluteGenDirPath: string;
}
export interface LazyRouteMap {
    [path: string]: LazyRoute;
}
export declare class ModuleRoute {
    readonly path: string;
    readonly className: string;
    constructor(path: string, className?: string);
    toString(): string;
    static fromString(entry: string): ModuleRoute;
}
export declare class AotPlugin implements Tapable {
    private _entryModule;
    private _compilerOptions;
    private _angularCompilerOptions;
    private _program;
    private _reflector;
    private _reflectorHost;
    private _rootFilePath;
    private _compilerHost;
    private _resourceLoader;
    private _lazyRoutes;
    private _tsConfigPath;
    private _donePromise;
    private _compiler;
    private _compilation;
    private _typeCheck;
    private _skipCodeGeneration;
    private _basePath;
    private _genDir;
    constructor(options: AotPluginOptions);
    readonly basePath: string;
    readonly compilation: any;
    readonly compilerHost: WebpackCompilerHost;
    readonly compilerOptions: ts.CompilerOptions;
    readonly done: Promise<void>;
    readonly entryModule: ModuleRoute;
    readonly genDir: string;
    readonly program: ts.Program;
    readonly skipCodeGeneration: boolean;
    readonly typeCheck: boolean;
    private _setupOptions(options);
    apply(compiler: any): void;
    private _make(compilation, cb);
    private _resolveModulePath(module, containingFile);
    private _processNgModule(module, containingFile);
    private getNgModuleMetadata(staticSymbol);
    private extractLoadChildren(ngModuleDecorator);
    private collectRoutes(providers);
    private collectLoadChildren(routes);
}
