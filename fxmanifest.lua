fx_version "cerulean"
game "gta5"
lua54 'yes'

name 'pefcl'
description "Financing resource. Accounts, Cash, Invoices, Transactions."
author "Project Error"
version '2.5.0'


ui_page 'web/dist/index.html'

client_script {
  "src/dist/client.js",
  "src/client/lua/interaction.lua"
}

server_script {
  "src/server/lua/ox_logger.lua",
  "src/server/lua/framework/init.lua",
  "src/dist/server.js"
}

files {
  'web/dist/index.html',
  'web/dist/**/*',
  'web/media/**/*',
  'config.json'
}