--[[
  Built-in ESX bridge.

  Detected when frameworkIntegration.resource is "auto"/"builtin" and es_extended is started.
  Cards require ox_inventory (skipped cleanly when it is not running).
]]

local cardItem = PefclBridge.cardItem or 'mastercard'
local businessAccounts = PefclBridge.businessAccounts or {}
local hasOxInventory = PefclFramework.hasResource('ox_inventory')
local AVOID_SYNC = ('pefcl_%s'):format(math.random(100000, 999999))

local ESX

local function initEsx()
  if ESX then
    return ESX
  end

  local ok, obj = pcall(function()
    return exports['es_extended']:getSharedObject()
  end)
  if ok and obj then
    ESX = obj
    return ESX
  end

  TriggerEvent('esx:getSharedObject', function(shared)
    ESX = shared
  end)
  return ESX
end

CreateThread(function()
  local deadline = GetGameTimer() + 10000
  while not initEsx() and GetGameTimer() < deadline do
    Wait(100)
  end
  if not ESX then
    print('^1[pefcl]^7 Built-in ESX bridge could not obtain ESX shared object')
  end
end)

local function getXPlayer(src)
  initEsx()
  return ESX and ESX.GetPlayerFromId(src) or nil
end

local function addCash(src, amount)
  local xPlayer = getXPlayer(src)
  if not xPlayer then
    return false
  end
  xPlayer.addMoney(amount)
  return true
end

local function removeCash(src, amount)
  local xPlayer = getXPlayer(src)
  if not xPlayer then
    return false
  end
  if xPlayer.getMoney() < amount then
    return false
  end
  xPlayer.removeMoney(amount)
  return true
end

local function getCash(src)
  local xPlayer = getXPlayer(src)
  if not xPlayer then
    return 0
  end
  return xPlayer.getMoney() or 0
end

local function getBank(src)
  local xPlayer = getXPlayer(src)
  if not xPlayer then
    return 0
  end
  local account = xPlayer.getAccount('bank')
  return account and account.money or 0
end

local function getCards(src)
  local retval = {}
  if not hasOxInventory then
    return retval
  end

  local cards = exports.ox_inventory:Search(src, 'slots', cardItem) or {}
  for _, v in pairs(cards) do
    local meta = v.metadata or {}
    retval[#retval + 1] = {
      id = meta.id,
      holder = meta.holder,
      number = meta.number,
    }
  end
  return retval
end

local function giveCard(src, card)
  if not hasOxInventory then
    return
  end
  exports.ox_inventory:AddItem(src, cardItem, 1, {
    id = card.id,
    holder = card.holder,
    number = card.number,
    description = ('Card Number: %s'):format(card.number),
  })
end

local function syncBankBalance(account)
  if not account or not account.isDefault then
    return
  end
  initEsx()
  if not ESX then
    return
  end
  local xPlayer = ESX.GetPlayerFromIdentifier(account.ownerIdentifier)
  if not xPlayer then
    return
  end
  xPlayer.setAccountMoney('bank', account.balance, AVOID_SYNC)
end

local function uniqueAccounts(xPlayer, job, lastJob)
  if not xPlayer or not job then
    return
  end

  local cfg = businessAccounts[job.name]
  if not cfg then
    return
  end

  local res = PefclFramework.resourceName()
  local playerSrc = xPlayer.source
  local identifier = xPlayer.getIdentifier()

  if lastJob and lastJob.name then
    exports[res]:removeUserFromUniqueAccount(playerSrc, {
      userIdentifier = identifier,
      accountIdentifier = lastJob.name,
    })
  end

  local existing = exports[res]:getUniqueAccount(playerSrc, job.name)
  if not existing or not existing.data then
    exports[res]:createUniqueAccount(playerSrc, {
      name = tostring(cfg.AccountName or job.label or job.name),
      type = 'shared',
      identifier = job.name,
    })
  end

  local role = false
  local grade = job.grade or 0
  if cfg.AdminRole and grade >= cfg.AdminRole then
    role = 'admin'
  elseif cfg.ContributorRole and grade >= cfg.ContributorRole then
    role = 'contributor'
  elseif job.grade_name == 'boss' then
    role = 'admin'
  end

  if role then
    exports[res]:addUserToUniqueAccount(playerSrc, {
      role = role,
      accountIdentifier = job.name,
      userIdentifier = identifier,
      source = playerSrc,
    })
  end
end

PefclFramework.registerExports({
  addCash = addCash,
  removeCash = removeCash,
  getCash = getCash,
  getBank = getBank,
  giveCard = giveCard,
  getCards = getCards,
})

AddEventHandler('esx:playerLoaded', function(playerSrc, xPlayer)
  if not xPlayer then
    return
  end
  PefclFramework.loadPlayer(playerSrc, xPlayer.getIdentifier(), xPlayer.getName())
  uniqueAccounts(xPlayer, xPlayer.getJob())
end)

AddEventHandler('esx:playerLogout', function(playerId)
  PefclFramework.unloadPlayer(playerId)
end)

AddEventHandler('playerDropped', function()
  PefclFramework.unloadPlayer(source)
end)

AddEventHandler('esx:addAccountMoney', function(playerSrc, accountName, amount, message)
  if accountName ~= 'bank' or message == AVOID_SYNC then
    return
  end
  exports[PefclFramework.resourceName()]:addBankBalance(playerSrc, { amount = amount, message = message })
end)

AddEventHandler('esx:removeAccountMoney', function(playerSrc, accountName, amount, message)
  if accountName ~= 'bank' or message == AVOID_SYNC then
    return
  end
  exports[PefclFramework.resourceName()]:removeBankBalance(playerSrc, { amount = amount, message = message })
end)

AddEventHandler('esx:setAccountMoney', function(playerSrc, accountName, amount, message)
  if accountName ~= 'bank' or message == AVOID_SYNC then
    return
  end
  exports[PefclFramework.resourceName()]:setBankBalance(playerSrc, { amount = amount, message = message })
end)

AddEventHandler('esx:setJob', function(playerSrc, job, lastJob)
  local xPlayer = getXPlayer(playerSrc)
  if not xPlayer then
    return
  end
  uniqueAccounts(xPlayer, job, lastJob)
end)

AddEventHandler('pefcl:newAccountBalance', syncBankBalance)
AddEventHandler('pefcl:changedDefaultAccount', syncBankBalance)

AddEventHandler('onServerResourceStart', function(resName)
  if resName ~= PefclFramework.resourceName() then
    return
  end
  initEsx()
  if not ESX or not ESX.GetExtendedPlayers then
    return
  end

  for _, xPlayer in pairs(ESX.GetExtendedPlayers()) do
    local identifier = xPlayer.identifier or xPlayer.getIdentifier()
    PefclFramework.loadPlayer(xPlayer.source, identifier, xPlayer.getName())
    uniqueAccounts(xPlayer, xPlayer.getJob())
  end
end)
