--[[
  Built-in QBCore bridge.

  Detected when frameworkIntegration.resource is "auto"/"builtin" and qb-core is started.
  Exports are registered as pefclBridge_* (see shared.lua).

  Bank sync:
  - QB AddMoney/RemoveMoney/SetMoney('bank') → PEFCL via OnMoneyChange
  - PEFCL default account changes → QB PlayerData.money.bank (HUD) via pefcl:newAccountBalance
]]

local QBCore = exports['qb-core']:GetCoreObject()
local cardItem = PefclBridge.cardItem or 'visa'

local function getPlayer(src)
  return QBCore.Functions.GetPlayer(src)
end

local function addCash(src, amount)
  local player = getPlayer(src)
  if not player then
    return false
  end
  return player.Functions.AddMoney('cash', amount, 'pefcl') == true
end

local function removeCash(src, amount)
  local player = getPlayer(src)
  if not player then
    return false
  end
  return player.Functions.RemoveMoney('cash', amount, 'pefcl') == true
end

local function getCash(src)
  local player = getPlayer(src)
  if not player then
    return 0
  end
  return player.PlayerData.money.cash or 0
end

local function getBank(src)
  local player = getPlayer(src)
  if not player then
    return 0
  end
  return player.PlayerData.money.bank or 0
end

local function getCards(src)
  local retval = {}
  local player = getPlayer(src)
  if not player then
    return retval
  end

  local cards = player.Functions.GetItemsByName(cardItem)
  if not cards then
    return retval
  end

  for _, v in pairs(cards) do
    local info = v.info or v.metadata or {}
    retval[#retval + 1] = {
      id = info.id,
      holder = info.holder,
      number = info.number,
    }
  end
  return retval
end

local function giveCard(src, card)
  local player = getPlayer(src)
  if not player then
    return
  end
  player.Functions.AddItem(cardItem, 1, nil, {
    id = card.id,
    holder = card.holder,
    number = card.number,
  })
end

PefclFramework.registerExports({
  addCash = addCash,
  removeCash = removeCash,
  getCash = getCash,
  getBank = getBank,
  giveCard = giveCard,
  getCards = getCards,
})

AddEventHandler('QBCore:Server:OnMoneyChange', function(playerSrc, moneyType, amount, action, reason)
  PefclFramework.syncBankChange(playerSrc, moneyType, amount, action, reason)
end)

-- PEFCL → QB HUD / money.bank
AddEventHandler('pefcl:newAccountBalance', function(account)
  PefclFramework.syncQbBankFromAccount(account)
end)

AddEventHandler('pefcl:changedDefaultAccount', function(account)
  PefclFramework.syncQbBankFromAccount(account)
end)

AddEventHandler('QBCore:Server:PlayerLoaded', function(player)
  if not player then
    return
  end
  PefclFramework.loadPlayer(player.PlayerData.source, player.PlayerData.citizenid, PefclFramework.qbDisplayName(player))
  PefclFramework.syncQbUniqueAccounts(player)
  PefclFramework.syncQbBankFromPefcl(player)
end)

AddEventHandler('playerDropped', function()
  PefclFramework.unloadPlayer(source)
end)

AddEventHandler('onServerResourceStart', function(resName)
  if resName ~= PefclFramework.resourceName() then
    return
  end

  local players = QBCore.Functions.GetQBPlayers and QBCore.Functions.GetQBPlayers() or {}
  for _, player in pairs(players) do
    PefclFramework.loadPlayer(player.PlayerData.source, player.PlayerData.citizenid, PefclFramework.qbDisplayName(player))
    PefclFramework.syncQbUniqueAccounts(player)
    PefclFramework.syncQbBankFromPefcl(player)
  end
end)
