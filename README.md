# 🛠️ Monorepo template

A template that provides a straightforward and flexible way to use the benefits of tRPC in your React projects. It emphasizes the use of absolute paths and a monorepo approach that significantly improves the developer experience. If you're looking for a clean setup with pure React and modularization, this template is an excellent place to start!

| [Stack](#-stack) | [Highlights](#-highlights) | [Quick start](#-quick-start) | [Challenge](#-the-challenge) | [Scripts](#-scripts) | [Env](#-envs) | [Ports](#-ports) | [License](#-license) |
| ---------------- | -------------------------- | ---------------------------- | ---------------------------- | -------------------- | ------------- | ---------------- | -------------------- |

## 🔧 Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=Vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=fff)
![tRPC](https://img.shields.io/badge/tRPC-2596BE.svg?style=for-the-badge&logo=tRPC&logoColor=white)
[![Vitest](https://img.shields.io/badge/Vitest-%2314151B.svg?style=for-the-badge&logo=vitest&logoColor=white&color=green)](https://vitest.dev/)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444.svg?style=for-the-badge&logo=Turborepo&logoColor=white)

## 🌟 Highlights

| Global                                                                                                                                                                                                                                                                                                       | Server                                                                                                                                                                                                                                                                                                                                                           | Web                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul> <li>✅ Envs validation with `envalid` </li> <li>✨ `prettier` + `eslint`</li> <li>➡️ Auto sorting imports with `@trivago/prettier-plugin-sort-imports`</li> <li>📦 Bundling local packages with `tsup`</li> <li>⚙️ `pm2` for running server as a background process (i.e. for test coverage)</li> </ul> | <ul> <li>🖧 `Hono` + `tRPC`</li> <li>✅ `vitest` (unit / integration / e2e tests) + test coverage (`istanbul`)</li> <li>🔑 separated `.env` files for development and testing</li> <li>🛠️ Absolute paths set up with `module-alias`</li> <li>⚡ Server compilation with `swc`</li> <li>🔄 `nodemon` autoreload based on source code and local packages</li> </ul> | <ul> <li>⚛️ `React` + `Vite`</li> <li>🏗️ `Feature-Driven Development` architecture</li> <li>💅 `styled-components` + `stylelint`</li> <li>🛤️ Routing with `@tanstack/router`</li> <li>✅ `vitest` (unit / integration) + test coverage (`istanbul`) </li> <li>🌐 `cypress` (e2e)</li> </ul> |

## 🧩 The challenge

This setup faced a challenge while importing the `AppRouter` from the server folder to the client folder, which resulted in Typescript server errors related to imports from the 'trpc' path on the server side.

The solution leverages Typescript references to allow importing the `AppRouter` on the client side while using absolute paths on the server side.

```js
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "outDir": "dist",
  },
  "references": [{ "path": "../server" }] <~ fixes the /server references on the /web
}

// apps/web/package.json
{
  "scripts": {
    "ts:check": "tsc -b", <~ the -b flag is crucial when building an app that has references in its tsconfig.json
    "build": "pnpm ts:check && vite build"
  }
}

// packages/api/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "outDir": "dist", <~ required, sets the build destination folder
    "composite": true <~ required to make TS references work
  },
  "ts-node": { "swc": true }
}
```

## ⌨ Scripts

| command                      | description                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm start`                 | Runs the production build of the server (`/server`)                                             |
| `pnpm pm2:start`             | Runs the server production build as a background process, using pm2 (`/server`)                 |
| `pnpm pm2:delete`            | Deletes all pm2 processes (`/server`)                                                           |
| `pnpm pm2:logs`              | Shows logs for pm2 (`/server`)                                                                  |
| `pnpm dev`                   | Launches apps and bundles all packages in watch mode                                            |
| `pnpm lint`                  | Performs an eslint check through all workspaces                                                 |
| `pnpm lint:fix`              | Performs an eslint fix through all workspaces                                                   |
| `pnpm ts:check`              | Performs a TypeScript check through all workspaces                                              |
| `pnpm ts:references`         | Syncs TypeScript references in all `tsconfig.json` files + updates `nodemon.json` `watch` array |
| `pnpm stylelint`             | Performs an stylelint check through all workspaces                                              |
| `pnpm check`                 | Performs eslint, TypeScript, and stylelint checks through all workspaces                        |
| `pnpm build`                 | Builds all apps                                                                                 |
| `pnpm build:lib`             | Bundles all packages                                                                            |
| `pnpm test:unit`             | Runs unit tests in watch mode                                                                   |
| `pnpm test:unit:run`         | Runs unit tests once                                                                            |
| `pnpm test:integration`      | Runs integration tests in watch mode                                                            |
| `pnpm test:integration:run`  | Runs integration tests once                                                                     |
| `pnpm test:e2e`              | Runs e2e tests in watch mode                                                                    |
| `pnpm test:e2e:run`          | Runs e2e tests once                                                                             |
| `pnpm test:coverage`         | Generates test coverage reports                                                                 |
| `pnpm test:coverage:preview` | Generates test coverage reports and opens preview                                               |
| `pnpm cypress`               | Opens the Cypress UI (`/web`)                                                                   |
| `pnpm cypress:install`       | Installs the Cypress (`/web`)                                                                   |
| `pnpm postinstall`           | Ensures that local or CI environment is ready after installing packages                         |

## 🔒 Envs

Envs are validated with the package `envalid`. Check out `.env-example` & `.env.test-example` files

If the `pnpm dev` script is executed without the required environment variables, the application will output similar details in the console:

```js
================================
Missing environment variables:
PORT: Port the Express server is running on (eg. "3001"). See https://expressjs.com/en/starter/hello-world.html
================================
```

## 🌐 Ports

-   🌐 :3000 - Web
-   🖥️ :3001 - Server

## 📜 License

[The MIT License (MIT)](https://github.com/kuubson/react-vite-trpc/blob/main/LICENSE)
