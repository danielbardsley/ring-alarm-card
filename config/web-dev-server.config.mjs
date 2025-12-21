import { fromRollup } from '@web/dev-server-rollup';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupTypescript from '@rollup/plugin-typescript';

const resolve = fromRollup(rollupResolve);
const commonjs = fromRollup(rollupCommonjs);
const typescript = fromRollup(rollupTypescript);

export default {
  port: 8000,
  nodeResolve: true,
  open: true,
  watch: true,
  appIndex: 'demo/index.html',
  rootDir: '.',
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true
    })
  ],
  middleware: [
    function rewriteIndex(context, next) {
      if (context.url === '/' || context.url === '/index.html') {
        context.url = '/demo/index.html';
      }
      return next();
    }
  ]
};