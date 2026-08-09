-- Optional PEFCL JS → ox_lib logger bridge (fivemanage / datadog / etc.).
-- No ox_lib dependency required; silently no-ops when ox_lib isn't available.
-- JS cannot reliably call same-resource Lua exports, so we also listen on an event.

local function resolveLogger()
  if GetResourceState('ox_lib') ~= 'started' then
    return nil
  end

  if lib and type(lib.logger) == 'function' then
    return lib.logger
  end

  local ok, fn = pcall(function()
    return exports.ox_lib.logger
  end)
  if ok and type(fn) == 'function' then
    return fn
  end

  return nil
end

local function logBanking(src, message, level, metadata)
  local logger = resolveLogger()
  if not logger then
    return
  end

  metadata = type(metadata) == 'table' and metadata or {}
  level = level or 'info'
  message = message or 'Banking transaction'

  local logSource = -1

  if type(src) == 'string' and src ~= '' then
    logSource = src
  elseif type(src) == 'number' and src > 0 then
    logSource = src
    metadata.playerId = metadata.playerId or src
    metadata.playerName = metadata.playerName or GetPlayerName(src)
  elseif metadata.identifier then
    logSource = metadata.identifier
  elseif metadata.citizenid then
    logSource = metadata.citizenid
  elseif metadata.uuid then
    logSource = metadata.uuid
  end

  pcall(logger, logSource, 'banking', message, level, metadata)
end

exports('logBanking', logBanking)

AddEventHandler('pefcl:internal:logBanking', function(src, message, level, metadata)
  logBanking(src, message, level, metadata)
end)
