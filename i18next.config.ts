import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'sv'],
  extract: {
    input: ['./web/src/**/*.{js,jsx,ts,tsx}', './src/server/**/*.{js,ts}', './src/client/**/*.{js,ts}'],
    output: 'locales/{{language}}/{{namespace}}.json',
    defaultNS: 'default',
    keySeparator: false,
    // Disable namespace separators so plain English keys work (e.g. "Status: Loading...")
    nsSeparator: false,
    contextSeparator: '_',
    removeUnusedKeys: true,
    sort: true,
    indentation: 2,
    // Localazy manages other locales; extract only seeds en/sv.
    defaultValue: (key, _namespace, language) => (language === 'en' ? key : ''),
    functions: ['t', '*.t'],
    transComponents: ['Trans'],
  },
});
