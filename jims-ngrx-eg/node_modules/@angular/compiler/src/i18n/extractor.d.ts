import { StaticReflector, StaticReflectorHost } from '../aot/static_reflector';
import { AotSummaryResolverHost } from '../aot/summary_resolver';
import { CompileMetadataResolver } from '../metadata_resolver';
import { MessageBundle } from './message_bundle';
export interface ExtractorOptions {
    includeFilePattern?: RegExp;
    excludeFilePattern?: RegExp;
}
/**
 * The host of the Extractor disconnects the implementation from TypeScript / other language
 * services and from underlying file systems.
 */
export interface ExtractorHost extends StaticReflectorHost, AotSummaryResolverHost {
    /**
     * Loads a resource (e.g. html / css)
     */
    loadResource(path: string): Promise<string>;
}
export declare class Extractor {
    private options;
    host: ExtractorHost;
    private staticReflector;
    private messageBundle;
    private metadataResolver;
    constructor(options: ExtractorOptions, host: ExtractorHost, staticReflector: StaticReflector, messageBundle: MessageBundle, metadataResolver: CompileMetadataResolver);
    extract(rootFiles: string[]): Promise<MessageBundle>;
    static create(host: ExtractorHost, options: ExtractorOptions): {
        extractor: Extractor;
        staticReflector: StaticReflector;
    };
}
