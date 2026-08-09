const esbuild = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');

// Sequelize optionally pulls dialect drivers we don't ship (MySQL only).
// Without these externals, clean CI installs fail resolving pg-hstore/etc.
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
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    external: sequelizeOptionalExternals,
    plugins: [
      esbuildPluginTsc({
        tsconfigPath: 'server/tsconfig.json',
      }),
    ],
  })
  .catch(() => process.exit(1));
