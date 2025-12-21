import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { createWriteStream, createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';

const isDevelopment = process.env.BUILD === 'development';

// Plugin to create gzipped version for better performance
const gzipPlugin = () => ({
  name: 'gzip',
  writeBundle(options, bundle) {
    if (!isDevelopment) {
      const outputFile = options.file;
      const gzipFile = `${outputFile}.gz`;
      
      const source = createReadStream(outputFile);
      const destination = createWriteStream(gzipFile);
      const gzip = createGzip({ level: 9 });
      
      pipeline(source, gzip, destination, (err) => {
        if (err) {
          console.error('Error creating gzip file:', err);
        } else {
          console.log(`Created ${gzipFile}`);
        }
      });
    }
  }
});

export default {
  input: 'src/index.ts',
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
    }),
    !isDevelopment && gzipPlugin()
  ].filter(Boolean),
  external: [],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};