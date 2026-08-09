# Framework integration

PEFCL can run **standalone** or integrate with a framework so cash, bank sync, player load/unload, and (optionally) inventory cards come from that framework.

Built-in adapters ship for **QBCore**, **QBox**, and **ESX**. You can still point PEFCL at a **custom/third-party bridge resource** when you want to.

## Quick setup

In `config.json`:

```json
"frameworkIntegration": {
  "enabled": true,
  "resource": "auto",
  "syncInitialBankBalance": true,
  "isCardsEnabled": true,
  "maxPlayerDistance": 10.0,
  "cardItem": "visa",
  "businessAccounts": {}
}
```

| `enabled` | `resource` | Behavior |
|-----------|------------|----------|
| `false` | ignored | Standalone PEFCL (own cash DB, join/leave handlers) |
| `true` | `"auto"` or `"builtin"` | Detect `qbx_core` → `qb-core` → `es_extended` and load the matching **built-in** bridge |
| `true` | `"my-bridge"` | Use **only** that resource’s exports (must be started before/with PEFCL) |

Detection order for `"auto"` / `"builtin"`:

1. `qbx_core` → built-in QBox bridge  
2. `qb-core` → built-in QBCore bridge  
3. `es_extended` → built-in ESX bridge  
4. nothing found → warning + standalone fallback  

PEFCL does **not** auto-pick third-party bridges like `qb-pefcl`. Configure them explicitly with `"resource": "qb-pefcl"` (etc.) if you want them.

## Folder layout

```
src/server/lua/framework/
  init.lua           # reads config, resolves mode, loads bridge
  shared.lua         # helpers shared by built-in bridges
  bridges/
    qb.lua           # QBCore
    qbx.lua          # QBox (qbx_core)
    esx.lua          # ESX
```

## Built-in bridges

Each built-in bridge:

- Loads/unloads players into PEFCL on framework login/logout  
- Implements cash get/add/remove via the framework (QBox prefers `ox_inventory` money when present)  
- Implements `getBank` for initial bank balance sync when `syncInitialBankBalance` is true  
- Optionally implements card get/give when `isCardsEnabled` is true  
- Mirrors framework bank money changes into PEFCL accounts  

| Bridge | Framework resource | Default card item | Notes |
|--------|--------------------|-------------------|--------|
| `qb` | `qb-core` | `visa` | Uses QB inventory APIs for cards |
| `qbx` | `qbx_core` | `visa` | Uses `ox_inventory` for cash/cards when started |
| `esx` | `es_extended` | `mastercard` | Cards require `ox_inventory` |

Built-in money/card exports are registered as `pefclBridge_*` on the PEFCL resource so they do not clash with PEFCL’s own public `addCash` / `getCash` exports.

## External / custom bridges

Set:

```json
"frameworkIntegration": {
  "enabled": true,
  "resource": "qb-pefcl"
}
```

That resource must export:

| Export | Required | Purpose |
|--------|----------|---------|
| `getCash(source)` | yes | Current cash |
| `addCash(source, amount)` | yes | Add cash |
| `removeCash(source, amount)` | yes | Remove cash (`false` = insufficient funds) |
| `getBank(source)` | yes | Framework bank balance (initial sync) |
| `giveCard(source, card)` | if cards enabled | Give inventory card |
| `getCards(source)` | if cards enabled | List inventory cards |

The bridge must also call PEFCL:

- `exports.pefcl:loadPlayer(src, { source, identifier, name })`  
- `exports.pefcl:unloadPlayer(src)`  

Optional community bridges (use only if you set `resource` to them):

- [qb-pefcl](https://github.com/project-error/qb-pefcl)  
- [qbx_pefcl](https://github.com/DevX32/qbx_pefcl)  
- [pefcl-esx](https://github.com/project-error/pefcl-esx)  

## Config reference

| Key | Type | Description |
|-----|------|-------------|
| `enabled` | `boolean` \| `"auto"` | Master switch / auto mode |
| `resource` | `string` | `"auto"` / `"builtin"` or an external resource name |
| `syncInitialBankBalance` | `boolean` | Seed first PEFCL account from framework `getBank` |
| `isCardsEnabled` | `boolean` | Require/use card exports + ATM card flow |
| `maxPlayerDistance` | `number` | Nearby players for give-cash / invoices |
| `cardItem` | `string` | Inventory item name (`visa`, `mastercard`, …) |
| `businessAccounts` | `object` | Optional job → shared account rules |

### `businessAccounts` example

```json
"businessAccounts": {
  "police": {
    "AccountName": "Police Department",
    "AdminRole": 3,
    "ContributorRole": 1
  }
}
```

Jobs listed here get a PEFCL unique/shared account when the player loads (built-in QB/QBX/ESX bridges).

## Start order

1. Framework core (`qbx_core` / `qb-core` / `es_extended`)  
2. Inventory (`ox_inventory`) if you use cards / QBox cash items  
3. External bridge resource **only if** `resource` points at one  
4. `pefcl`  

## Standalone mode

```json
"frameworkIntegration": {
  "enabled": false,
  "resource": "auto"
}
```

PEFCL manages its own cash rows and loads players on join.
