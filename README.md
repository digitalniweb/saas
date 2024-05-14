# Digitalni web - SaaS

## Installation

If you see errors (`npm ERR! code ERESOLVE` etc.) while installing it might be because of this dependency:

    "@tinymce/tinymce-vue": "^5.1.1"

Remove this package from `package.json` and install it afterwards:

    npm i @tinymce/tinymce-vue

## Migrations

Use following code to compile .ts to .js files for migrations for Sequelize

```bash
npm run buildMigrations
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Update Nuxt

```
npx nuxi upgrade
```

## Icons

List of [mdi icons](https://pictogrammers.com/library/mdi/) to use

## Communication between Apps and Services

```mermaid
    graph TB
    Apps <-->|"microserviceCall()"| Microservices
    subgraph Apps
        direction LR
        subgraph HostApp
            direction TB
            webHost([web]) <-->|"useApiCall()"| HostServer
        end
        subgraph TenantsApp
            direction TB
            webTenants([web]) <-->|"useApiCall()"| TenantsServer
        end
        HostApp <--> |"appCall()"| TenantsApp
    end
    subgraph Microservices
    end
    classDef dashed stroke-dasharray: 10;
    class Microservices,HostApp,TenantsApp dashed;
```
