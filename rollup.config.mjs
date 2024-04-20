import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'

export default {
	input: 'src/index.mjs',
	output: [
    { format: 'es', file: 'dist/index.mjs' },
    { format: 'cjs', file: 'dist/index.cjs' },
    {
      format: 'umd',
      sourcemap: true,
      name: 'StoneConfig',
      plugins: [terser()],
      file: 'dist/index.min.js',
    }
  ],
  plugins: [
    json(),
    nodeExternals({ deps: false }), // Must always be before `nodeResolve()`.
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    del({ targets: 'dist/*', runOnce: true }),
  ]
};