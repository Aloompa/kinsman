module.exports = function (wallaby) {

    const path = require('path');

    process.env.NODE_PATH +=
        path.delimiter +
        path.join(__dirname, 'node_modules');

    return {
        hints: {
            ignoreCoverage: /istanbul ignore next/
        },
    
        files: [
            'src/**/*.ts',
            '!src/**/__tests__/*.spec.ts'
        ],

        tests: [
            'src/**/__tests__/*.spec.ts'
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest',

        compilers: {
            '**/*.ts': wallaby.compilers.typeScript(require('./tsconfig.json'))
        }
    };
};