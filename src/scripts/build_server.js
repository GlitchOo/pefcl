const esbuild = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    plugins: [
      esbuildPluginTsc({
        tsconfigPath: 'server/tsconfig.json',
      }),
    ],
  })
  .catch(() => process.exit(1));
