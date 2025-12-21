import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const isDevelopment = process.env.BUILD === 'development';

export default {
  input: 'src/ring-alarm-card.ts',
  output: {
    file: 'dist/ring-alarm-card.js',
    format: 'es',
    sourcemap: isDevelopment,
    inlineDynamicImports: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: isDevelopment,
      inlineSources: isDevelopment,
      declaration: false,
      declarationMap: false
    }),
    !isDevelopment && terser({
      format: {
        comments: false
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ].filter(Boolean),
  external: [],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};