/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileTypeSummary } from '../compile_metadata';
import { SummaryResolver } from '../summary_resolver';
import { GeneratedFile } from './generated_file';
import { StaticReflector } from './static_reflector';
import { StaticSymbol } from './static_symbol';
export interface AotSummaryResolverHost {
    /**
     * Loads an NgModule/Directive/Pipe summary file
     */
    loadSummary(filePath: string): string;
    /**
     * Returns the output file path of a source file.
     * E.g.
     * `some_file.ts` -> `some_file.d.ts`
     */
    getOutputFileName(sourceFilePath: string): string;
}
export interface AotSummaryResolverOptions {
    includeFilePattern?: RegExp;
    excludeFilePattern?: RegExp;
}
export declare class AotSummaryResolver implements SummaryResolver {
    private host;
    private staticReflector;
    private options;
    private summaryCache;
    constructor(host: AotSummaryResolverHost, staticReflector: StaticReflector, options: AotSummaryResolverOptions);
    serializeSummaries(srcFileUrl: string, summaries: CompileTypeSummary[]): GeneratedFile;
    private _cacheKey(symbol);
    resolveSummary(staticSymbol: StaticSymbol): any;
}
