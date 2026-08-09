--[[
  Shared helpers for built-in framework bridges.
  Loaded by init.lua before the selected bridge file.
]]

PefclFramework = PefclFramework or {}

-- Reason used when pushing PEFCL → framework bank so OnMoneyChange does not loop.
PefclFramework.AVOID_SYNC = 'pefcl-sync'

function PefclFramework.resourceName()
  return GetCurrentResourceName()
end

function PefclFramework.hasResource(name)
  return GetResourceState(name) == 'started'
end

--- Load a player into PEFCL (identifier is framework character id).
function PefclFramework.loadPlayer(src, identifier, name)
  exports[PefclFramework.resourceName()]:loadPlayer(src, {
    source = src,
    identifier = identifier,
    name = name,
  })
end

function PefclFramework.unloadPlayer(src)
  exports[PefclFramework.resourceName()]:unloadPlayer(src)
end

--- Sync framework bank money mutations into PEFCL.
function PefclFramework.syncBankChange(playerSrc, moneyType, amount, action, reason)
  if moneyType ~= 'bank' then
    return
  end

  -- Ignore PEFCL → framework echo
  if reason == PefclFramework.AVOID_SYNC or reason == 'pefcl' then
    return
  end

  local res = PefclFramework.resourceName()
  local data = { amount = amount, message = reason }

  if action == 'add' then
    exports[res]:addBankBalance(playerSrc, data)
  elseif action == 'remove' then
    exports[res]:removeBankBalance(playerSrc, data)
  elseif action == 'set' then
    exports[res]:setBankBalance(playerSrc, data)
  end
end

--- Push PEFCL default-account balance onto a QB/QBX player object (HUD / money.bank).
function PefclFramework.applyQbBankBalance(player, balance)
  if not player or not player.Functions or not player.Functions.SetMoney then
    return
  end
  if type(balance) ~= 'number' then
    return
  end
  local current = player.PlayerData and player.PlayerData.money and player.PlayerData.money.bank
  if current == balance then
    return
  end
  player.Functions.SetMoney('bank', balance, PefclFramework.AVOID_SYNC)
end

--- Sync PEFCL default account → framework PlayerData.money.bank (NBRP SyncBank / ESX pattern).
function PefclFramework.syncQbBankFromAccount(account)
  if not account or not account.isDefault or not account.ownerIdentifier then
    return
  end

  local balance = tonumber(account.balance)
  if balance == nil then
    return
  end

  local player = nil
  if PefclFramework.hasResource('qbx_core') then
    player = exports.qbx_core:GetPlayerByCitizenId(account.ownerIdentifier)
  end
  if not player and PefclFramework.hasResource('qb-core') then
    local QBCore = exports['qb-core']:GetCoreObject()
    if QBCore and QBCore.Functions.GetPlayerByCitizenId then
      player = QBCore.Functions.GetPlayerByCitizenId(account.ownerIdentifier)
    end
  end

  PefclFramework.applyQbBankBalance(player, balance)
end

--- On load: force framework bank to match PEFCL (PEFCL is source of truth after initial migrate).
function PefclFramework.syncQbBankFromPefcl(player)
  if not player or not player.PlayerData then
    return
  end
  local src = player.PlayerData.source
  local result = exports[PefclFramework.resourceName()]:getDefaultAccountBalance(src)
  local balance = result
  if type(result) == 'table' then
    balance = result.data
  end
  PefclFramework.applyQbBankBalance(player, tonumber(balance))
end

--- Register the contract PEFCL JS calls for built-in bridges (prefixed to avoid clashing with PEFCL public exports).
function PefclFramework.registerExports(api)
  exports('pefclBridge_addCash', api.addCash)
  exports('pefclBridge_removeCash', api.removeCash)
  exports('pefclBridge_getCash', api.getCash)
  exports('pefclBridge_getBank', api.getBank)
  exports('pefclBridge_giveCard', api.giveCard)
  exports('pefclBridge_getCards', api.getCards)
end

--- QB / QBX shared-account helper driven by config.frameworkIntegration.businessAccounts
---@param player table QB/QBX player object with PlayerData
function PefclFramework.syncQbUniqueAccounts(player)
  if not player or not player.PlayerData then
    return
  end

  local businessAccounts = PefclBridge.businessAccounts or {}
  local citizenid = player.PlayerData.citizenid
  local playerSrc = player.PlayerData.source
  local job = player.PlayerData.job
  if not job or not job.name then
    return
  end

  local cfg = businessAccounts[job.name]
  if not cfg then
    return
  end

  local res = PefclFramework.resourceName()
  local existing = exports[res]:getUniqueAccount(playerSrc, job.name)
  if not existing or not existing.data then
    exports[res]:createUniqueAccount(playerSrc, {
      name = tostring(cfg.AccountName or job.label or job.name),
      type = 'shared',
      identifier = job.name,
    })
  end

  local role = false
  local grade = job.grade and job.grade.level or 0
  if cfg.AdminRole and grade >= cfg.AdminRole then
    role = 'admin'
  elseif cfg.ContributorRole and grade >= cfg.ContributorRole then
    role = 'contributor'
  end

  if role then
    exports[res]:addUserToUniqueAccount(playerSrc, {
      role = role,
      accountIdentifier = job.name,
      userIdentifier = citizenid,
      source = playerSrc,
    })
  end
end

function PefclFramework.qbDisplayName(player)
  local charInfo = player.PlayerData.charinfo
  return ('%s %s'):format(charInfo.firstname, charInfo.lastname)
end
