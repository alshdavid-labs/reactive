const typescript = require('rollup-plugin-typescript2')

const base = (input, outputDir, extension, format) => ({
  input,
  preserveModules: true,
  treeshake: false,
  output: {
    exports: 'named',
    format,
    dir: outputDir,
    entryFileNames: c => {
      const filepath = c.facadeModuleId.split('/')
      const filename = filepath[filepath.length - 1]
      const file = filename.split('.')
      file[file.length - 1] = extension
      return file.join('')
    }
  },
  watch: {
    include: './**',
    exclude: [
      'node_modules',
      '**/*.spec.ts'
    ],
    clearScreen: false
  },
  external: [
    '@alshdavid/rxjs',
    '@alshdavid/rxjs/operators',
    'react',
    'preact/hooks'
  ],
  plugins: [
    typescript({ 
      tsconfig: 'tsconfig.build.json',
      useTsconfigDeclarationDir: true
    }),
  ],
})

module.exports = [
  base('./src/index.ts', './dist','.module.js', 'esm'),
  base('./src/index.ts', './dist', '.commonjs.js', 'commonjs'),
  base('./src/react/index.ts', './dist','.module.js', 'esm'),
  base('./src/react/index.ts', './dist', '.commonjs.js', 'commonjs'),
  base('./src/preact/index.ts', './dist','.module.js', 'esm'),
  base('./src/preact/index.ts', './dist', '.commonjs.js', 'commonjs'),
]
