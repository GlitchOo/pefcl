const esbuild = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');

const args = process.argv.slice(2);

const modeArg = args.find((arg) => {
  const [key] = arg.split('=');
  return key === '--mode';
});

const mode = modeArg?.split('=')[1];
const NODE_ENV = mode === 'ingame' ? 'ingame' : 'mocking';

const sequelizeOptionalExternals = [
  'pg',
  'pg-hstore',
  'pg-native',
  'sqlite3',
  'tedious',
  'mariadb',
  'oracledb',
  'ibm_db',
  'snowflake-sdk',
];

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    watch: {
      onRebuild(error) {
        if (error) console.error('watch build failed:', error);
        else console.log('watch build succeeded:');
      },
    },
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    external: sequelizeOptionalExternals,
    define: {
      'process.env.NODE_ENV': `"${NODE_ENV}"`,
    },
    plugins: [
      esbuildPluginTsc({
        tsconfigPath: 'server/tsconfig.json',
      }),
    ],
  })
  .then(() => {
    console.log('Watching server');
  });
