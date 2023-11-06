import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";

export default {
    input: 'src/index.js',
    output: [{file: 'dist/index.js', format: 'es'},],
    plugins: [resolve(), commonjs(), babel(),json()],
    external: ['react'] // react为外部引入,所系不需要打包进去
}