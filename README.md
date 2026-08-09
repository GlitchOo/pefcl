# PEFCL

Financing resource for FiveM: accounts, cash, invoices, transactions, cards — with desktop NUI plus LB Phone / LB Tablet apps.

## Screenshots

### Desktop banking

| | |
|:---:|:---:|
| ![Desktop 1](https://s3.glitchd.app/pefcl/desk_1.png) | ![Desktop 2](https://s3.glitchd.app/pefcl/desk_2.png) |
| ![Desktop 3](https://s3.glitchd.app/pefcl/desk_3.png) | ![Desktop 4](https://s3.glitchd.app/pefcl/desk_4.png) |
| ![Desktop 5](https://s3.glitchd.app/pefcl/desk_5.png) | ![Desktop 6](https://s3.glitchd.app/pefcl/desk_6.png) |
| ![Desktop 7](https://s3.glitchd.app/pefcl/desk_7.png) | ![Desktop 8](https://s3.glitchd.app/pefcl/desk_8.png) |
| ![Desktop 9](https://s3.glitchd.app/pefcl/desk_9.png) | |

### ATM

| | |
|:---:|:---:|
| ![ATM 1](https://s3.glitchd.app/pefcl/atm_1.png) | ![ATM 2](https://s3.glitchd.app/pefcl/atm_2.png) |

### LB Phone

| | | | |
|:---:|:---:|:---:|:---:|
| ![Phone 1](https://s3.glitchd.app/pefcl/phone_1.png) | ![Phone 2](https://s3.glitchd.app/pefcl/phone_2.png) | ![Phone 3](https://s3.glitchd.app/pefcl/phone_3.png) | ![Phone 4](https://s3.glitchd.app/pefcl/phone_4.png) |
| ![Phone 5](https://s3.glitchd.app/pefcl/phone_5.png) | ![Phone 6](https://s3.glitchd.app/pefcl/phone_6.png) | ![Phone 7](https://s3.glitchd.app/pefcl/phone_7.png) | |

### LB Tablet

| | |
|:---:|:---:|
| ![Tablet 1](https://s3.glitchd.app/pefcl/tablet_1.png) | ![Tablet 2](https://s3.glitchd.app/pefcl/tablet_2.png) |
| ![Tablet 3](https://s3.glitchd.app/pefcl/tablet_3.png) | ![Tablet 4](https://s3.glitchd.app/pefcl/tablet_4.png) |
| ![Tablet 5](https://s3.glitchd.app/pefcl/tablet_5.png) | ![Tablet 6](https://s3.glitchd.app/pefcl/tablet_6.png) |

## Framework integration

PEFCL includes **built-in** bridges for QBCore, QBox, and ESX, and still supports **external** bridge resources when you configure them.

```json
"frameworkIntegration": {
  "enabled": true,
  "resource": "auto"
}
```

- `"resource": "auto"` — detect `qbx_core` / `qb-core` / `es_extended` and use the built-in adapter  
- `"resource": "qb-pefcl"` (or any custom resource) — use that bridge only; nothing is auto-probed  

Full guide: [docs/framework-integration.md](docs/framework-integration.md)

## LB Phone / LB Tablet

Custom banking app registration ships in the client. App store screenshots live under `web/media/appstore/` (`phone_*` / `tablet_*`).

## Installation

1. Import `import.sql` (tables use the `pefcl_` prefix)  
2. Ensure `mysql_connection_string` is set  
3. Configure `config.json` (framework section above)  
4. `ensure pefcl` after your framework (and optional external bridge)

Upstream docs: https://projecterror.dev/docs/pefcl/installation

## Development

Requires **Node 22+** (LTS). From the repo root:

```bash
# Install root, src, and web dependencies
npm run install:all

# Build server, client, and web UI
npm run build
```

`npm run build` alone is enough after dependencies are installed — it builds `src` (server + client) and `web` (NUI).

### Useful scripts

| Script | What it does |
| --- | --- |
| `npm run install:all` | Install deps in root, `src/`, and `web/` |
| `npm run build` | Production build of everything |
| `npm run dev` | Watch server/client + Vite UI |
| `npm run dev:ingame` | In-game NUI / client watch mode |
| `npm run lint` / `npm run tsc` | Lint and typecheck src + web |
| `npm run setup` | `install:all` plus Crowdin translation pull (needs `CROWDIN_*` env) |

## License

Credits to the Project Error team and contributors.

[Upstream PEFCL](https://github.com/project-error/pefcl) · [License: CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
