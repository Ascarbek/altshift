import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/content.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    dir: 'dist'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: css => {
        css.write('dist/bundle.css');
      }
    }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    //
    copy({
      targets: [
        {
          src: 'src/icomoon/fonts/*',
          dest: 'dist/fonts',
        },
        {
          src: 'src/icomoon/icomoon.css',
          dest: 'dist/fonts',
        },
        {
          src: 'src/img/*',
          dest: 'dist/img',
        },
        {
          src: 'src/manifest.json',
          dest: 'dist',
        },
        {
          src: 'src/background.js',
          dest: 'dist',
        },
      ]
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    // production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

