export declare const getWebpackDevConfigPartial: (projectRoot: string, appConfig: any) => {
    devtool: string;
    output: {
        path: any;
        filename: string;
        sourceMapFilename: string;
        chunkFilename: string;
    };
    module: {
        rules: {
            include: any;
            test: RegExp;
            loaders: string[];
        }[];
    };
};
