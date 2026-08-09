--[[
  Built-in QBox (qbx_core) bridge.

  Detected when frameworkIntegration.resource is "auto"/"builtin" and qbx_core is started.
  Prefers ox_inventory for cash/cards when that resource is running.

  Bank sync mirrors qb.lua (QB events + PEFCL → framework money.bank).
]]

local cardItem = PefclBridge.cardItem or 'visa'
local hasOxInventory = PefclFramework.hasResource('ox_inventory')

local function getPlayer(src)
  return exports.qbx_core:GetPlayer(src)
end

local function addCash(src, amount)
  if hasOxInventory then
    return exports.ox_inventory:AddItem(src, 'money', amount) and true or false
  end
  local player = getPlayer(src)
  if not player then
    return false
  end
  return player.Functions.AddMoney('cash', amount, 'pefcl') == true
end

local function removeCash(src, amount)
  if hasOxInventory then
    return exports.ox_inventory:RemoveItem(src, 'money', amount) and true or false
  end
  local player = getPlayer(src)
  if not player then
    return false
  end
  return player.Functions.RemoveMoney('cash', amount, 'pefcl') == true
end

local function getCash(src)
  if hasOxInventory then
    return exports.ox_inventory:GetItemCount(src, 'money') or 0
  end
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

  if hasOxInventory then
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

  local player = getPlayer(src)
  if not player or not player.Functions.GetItemsByName then
    return retval
  end

  local cards = player.Functions.GetItemsByName(cardItem)
  if cards then
    for _, v in pairs(cards) do
      local info = v.info or v.metadata or {}
      retval[#retval + 1] = {
        id = info.id,
        holder = info.holder,
        number = info.number,
      }
    end
  end
  return retval
end

local function giveCard(src, card)
  if hasOxInventory then
    exports.ox_inventory:AddItem(src, cardItem, 1, {
      id = card.id,
      holder = card.holder,
      number = card.number,
      description = ('Card Number: %s'):format(card.number),
    })
    return
  end

  local player = getPlayer(src)
  if player then
    player.Functions.AddItem(cardItem, 1, nil, {
      id = card.id,
      holder = card.holder,
      number = card.number,
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

AddEventHandler('QBCore:Server:OnMoneyChange', function(playerSrc, moneyType, amount, action, reason)
  PefclFramework.syncBankChange(playerSrc, moneyType, amount, action, reason)
end)

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

  local players = exports.qbx_core:GetQBPlayers() or {}
  for _, player in pairs(players) do
    PefclFramework.loadPlayer(player.PlayerData.source, player.PlayerData.citizenid, PefclFramework.qbDisplayName(player))
    PefclFramework.syncQbUniqueAccounts(player)
    PefclFramework.syncQbBankFromPefcl(player)
  end
end)
