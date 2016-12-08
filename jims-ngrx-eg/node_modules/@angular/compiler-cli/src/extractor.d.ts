/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Extract i18n messages from source code
 */
import 'reflect-metadata';
import * as compiler from '@angular/compiler';
import * as tsc from '@angular/tsc-wrapped';
import * as ts from 'typescript';
import { CompilerHost } from './compiler_host';
export declare class Extractor {
    private ngExtractor;
    private ngCompilerHost;
    private program;
    constructor(ngExtractor: compiler.Extractor, ngCompilerHost: CompilerHost, program: ts.Program);
    extract(): Promise<compiler.MessageBundle>;
    static create(options: tsc.AngularCompilerOptions, translationsFormat: string, program: ts.Program, moduleResolverHost: ts.ModuleResolutionHost, ngCompilerHost?: CompilerHost): Extractor;
}
