--[[
  Framework bridge resolver.

  Modes (config.frameworkIntegration):
    enabled = false                     → standalone PEFCL (no framework)
    enabled = true, resource = "auto"   → detect qbx_core / qb-core / es_extended and load built-in
    enabled = true, resource = "<name>" → use that external bridge resource only (must be started)

  See docs/framework-integration.md
]]

local RESOURCE = GetCurrentResourceName()

PefclBridge = {
  active = false,
  kind = 'none', -- external | builtin | none
  framework = nil, -- qbx | qb | esx
  resource = nil,
  cardItem = 'visa',
  businessAccounts = {},
}

local function loadConfig()
  local raw = LoadResourceFile(RESOURCE, 'config.json')
  if not raw then
    return {}
  end
  local ok, decoded = pcall(json.decode, raw)
  if not ok or type(decoded) ~= 'table' then
    return {}
  end
  return decoded
end

local function isStarted(name)
  return GetResourceState(name) == 'started'
end

local function isAutoResource(resource)
  return resource == nil
    or resource == ''
    or resource == 'auto'
    or resource == 'builtin'
    or resource == 'your-resource'
end

local function loadLuaFile(relativePath)
  local chunk = LoadResourceFile(RESOURCE, relativePath)
  if not chunk then
    return false, ('missing file %s'):format(relativePath)
  end
  local fn, err = load(chunk, ('@@%s/%s'):format(RESOURCE, relativePath))
  if not fn then
    return false, err
  end
  local ok, runtimeErr = pcall(fn)
  if not ok then
    return false, runtimeErr
  end
  return true
end

---@param cfg table
local function resolve(cfg)
  local fi = cfg.frameworkIntegration or {}
  local enabled = fi.enabled
  local resource = fi.resource

  PefclBridge.cardItem = fi.cardItem or 'visa'
  PefclBridge.businessAccounts = type(fi.businessAccounts) == 'table' and fi.businessAccounts or {}

  if enabled == false or enabled == nil then
    return
  end

  -- Explicit external / custom bridge
  if type(resource) == 'string' and not isAutoResource(resource) then
    if not isStarted(resource) then
      print(('^1[pefcl]^7 Framework bridge resource "%s" is not started'):format(resource))
      return
    end
    PefclBridge.active = true
    PefclBridge.kind = 'external'
    PefclBridge.resource = resource
    return
  end

  -- Built-in: detect framework core only
  if not (enabled == true or enabled == 'auto' or isAutoResource(resource)) then
    return
  end

  if isStarted('qbx_core') then
    PefclBridge.active = true
    PefclBridge.kind = 'builtin'
    PefclBridge.framework = 'qbx'
    PefclBridge.resource = RESOURCE
    return
  end

  if isStarted('qb-core') then
    PefclBridge.active = true
    PefclBridge.kind = 'builtin'
    PefclBridge.framework = 'qb'
    PefclBridge.resource = RESOURCE
    return
  end

  if isStarted('es_extended') then
    PefclBridge.active = true
    PefclBridge.kind = 'builtin'
    PefclBridge.framework = 'esx'
    PefclBridge.resource = RESOURCE
    if not fi.cardItem then
      PefclBridge.cardItem = 'mastercard'
    end
    return
  end

  if enabled == true then
    print('^3[pefcl]^7 frameworkIntegration.enabled is true but no framework was detected; running standalone')
  end
end

local config = loadConfig()
resolve(config)

GlobalState:set('pefcl:frameworkActive', PefclBridge.active, true)
GlobalState:set('pefcl:frameworkBridge', PefclBridge.resource or '', true)

exports('getFrameworkBridge', function()
  return {
    active = PefclBridge.active,
    kind = PefclBridge.kind,
    framework = PefclBridge.framework,
    resource = PefclBridge.resource,
    cardItem = PefclBridge.cardItem,
  }
end)

if PefclBridge.active and PefclBridge.kind == 'builtin' then
  local okShared, sharedErr = loadLuaFile('src/server/lua/framework/shared.lua')
  if not okShared then
    print(('^1[pefcl]^7 Failed to load framework shared helpers: %s'):format(sharedErr))
    PefclBridge.active = false
    GlobalState:set('pefcl:frameworkActive', false, true)
  else
    local bridgePath = ('src/server/lua/framework/bridges/%s.lua'):format(PefclBridge.framework)
    local okBridge, bridgeErr = loadLuaFile(bridgePath)
    if not okBridge then
      print(('^1[pefcl]^7 Failed to load built-in %s bridge: %s'):format(PefclBridge.framework, bridgeErr))
      PefclBridge.active = false
      GlobalState:set('pefcl:frameworkActive', false, true)
    else
      print(('^2[pefcl]^7 Built-in %s framework bridge active'):format(PefclBridge.framework))
    end
  end
elseif PefclBridge.active and PefclBridge.kind == 'external' then
  print(('^2[pefcl]^7 Using configured framework bridge resource: %s'):format(PefclBridge.resource))
end
