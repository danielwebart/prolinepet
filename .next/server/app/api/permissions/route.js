"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/permissions/route";
exports.ids = ["app/api/permissions/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpermissions%2Froute&page=%2Fapi%2Fpermissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpermissions%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpermissions%2Froute&page=%2Fapi%2Fpermissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpermissions%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Sites_portalWeb_src_app_api_permissions_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/permissions/route.ts */ \"(rsc)/./src/app/api/permissions/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/permissions/route\",\n        pathname: \"/api/permissions\",\n        filename: \"route\",\n        bundlePath: \"app/api/permissions/route\"\n    },\n    resolvedPagePath: \"D:\\\\Sites\\\\portalWeb\\\\src\\\\app\\\\api\\\\permissions\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Sites_portalWeb_src_app_api_permissions_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/permissions/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwZXJtaXNzaW9ucyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcGVybWlzc2lvbnMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwZXJtaXNzaW9ucyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDU2l0ZXMlNUNwb3J0YWxXZWIlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUQlM0ElNUNTaXRlcyU1Q3BvcnRhbFdlYiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDVTtBQUN2RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2NtbXMtY2FydG9uaWZpY2lvLz8wNjNkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFNpdGVzXFxcXHBvcnRhbFdlYlxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxwZXJtaXNzaW9uc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcGVybWlzc2lvbnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9wZXJtaXNzaW9uc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcGVybWlzc2lvbnMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxTaXRlc1xcXFxwb3J0YWxXZWJcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccGVybWlzc2lvbnNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3Blcm1pc3Npb25zL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpermissions%2Froute&page=%2Fapi%2Fpermissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpermissions%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/permissions/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/permissions/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nasync function GET() {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        const uid = session?.user ? Number(session.user.id) : undefined;\n        const activeEntityId = session?.activeEntityId ?? null;\n        if (!uid) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"N\\xe3o autenticado\"\n        }, {\n            status: 401\n        });\n        // Entidades do usuário (usar Prisma para evitar incompatibilidades de SQL)\n        const entities = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.entity.findMany({\n            where: {\n                isActive: true,\n                userEntities: {\n                    some: {\n                        userId: uid\n                    }\n                }\n            },\n            select: {\n                id: true,\n                cnpj: true,\n                name: true\n            },\n            orderBy: {\n                name: \"asc\"\n            }\n        });\n        // Módulos e programas permitidos na entidade ativa\n        let modules = [];\n        if (activeEntityId) {\n            // Carregar módulos vinculados à entidade\n            const mods = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.$queryRawUnsafe(`\n        SELECT m.\"id\", m.\"code\", m.\"name\"\n        FROM \"Module\" m\n        JOIN \"EntityModule\" em ON em.\"moduleId\"=m.\"id\"\n        WHERE em.\"entityId\"=${activeEntityId} AND m.\"isActive\"=true\n        ORDER BY m.\"name\"\n      `);\n            // Checar permissão do usuário por módulo\n            for (const m of mods){\n                const um = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.$queryRawUnsafe(`\n          SELECT uem.\"allowed\" FROM \"UserEntityModule\" uem\n          JOIN \"UserEntity\" ue ON ue.\"id\"=uem.\"userEntityId\"\n          WHERE ue.\"userId\"=${uid} AND ue.\"entityId\"=${activeEntityId} AND uem.\"moduleId\"=${m.id}\n        `);\n                const moduleAllowed = um.length === 0 ? true : um.some((r)=>Number(r.allowed) === 1);\n                if (!moduleAllowed) continue;\n                // Programas liberados por entidade/módulo\n                const progs = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.$queryRawUnsafe(`\n          SELECT p.\"id\", p.\"code\", p.\"name\",\n            COALESCE((\n              SELECT emp.\"allowed\"\n              FROM \"EntityModuleProgram\" emp\n              JOIN \"EntityModule\" em ON em.\"id\"=emp.\"entityModuleId\"\n              WHERE em.\"entityId\"=${activeEntityId} AND em.\"moduleId\"=${m.id} AND emp.\"programId\"=p.\"id\"\n              LIMIT 1\n            ), true) AS allowed\n          FROM \"Program\" p\n          WHERE p.\"moduleId\"=${m.id} AND p.\"isActive\"=true AND p.\"showInMenu\"=true\n          ORDER BY p.\"name\"\n        `);\n                const allowedPrograms = [];\n                for (const p of progs){\n                    if (Number(p.allowed) !== 1) continue;\n                    const up = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.$queryRawUnsafe(`\n            SELECT uemp.\"allowed\" FROM \"UserEntityModuleProgram\" uemp\n            JOIN \"UserEntityModule\" uem ON uem.\"id\"=uemp.\"userEntityModuleId\"\n            JOIN \"UserEntity\" ue ON ue.\"id\"=uem.\"userEntityId\"\n            WHERE ue.\"userId\"=${uid} AND ue.\"entityId\"=${activeEntityId} AND uem.\"moduleId\"=${m.id} AND uemp.\"programId\"=${p.id}\n          `);\n                    const programAllowed = up.length === 0 ? true : up.some((r)=>Number(r.allowed) === 1);\n                    if (programAllowed) allowedPrograms.push({\n                        id: p.id,\n                        code: p.code,\n                        name: p.name\n                    });\n                }\n                if (allowedPrograms.length > 0) {\n                    modules.push({\n                        id: m.id,\n                        code: m.code,\n                        name: m.name,\n                        programs: allowedPrograms\n                    });\n                }\n            }\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            activeEntityId,\n            entities,\n            modules\n        });\n    } catch (err) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: String(err?.message || err)\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9wZXJtaXNzaW9ucy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMkM7QUFDRTtBQUNHO0FBQ0g7QUFFdEMsZUFBZUk7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTUosMkRBQWdCQSxDQUFDQyxrREFBV0E7UUFDbEQsTUFBTUksTUFBTUQsU0FBU0UsT0FBT0MsT0FBTyxRQUFTRCxJQUFJLENBQVNFLEVBQUUsSUFBSUM7UUFDL0QsTUFBTUMsaUJBQWlCLFNBQWtCQSxrQkFBa0I7UUFDM0QsSUFBSSxDQUFDTCxLQUFLLE9BQU9OLHFEQUFZQSxDQUFDWSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFrQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtRQUUvRSwyRUFBMkU7UUFDM0UsTUFBTUMsV0FBVyxNQUFNWiwrQ0FBTUEsQ0FBQ2EsTUFBTSxDQUFDQyxRQUFRLENBQUM7WUFDNUNDLE9BQU87Z0JBQUVDLFVBQVU7Z0JBQU1DLGNBQWM7b0JBQUVDLE1BQU07d0JBQUVDLFFBQVFoQjtvQkFBSTtnQkFBRTtZQUFFO1lBQ2pFaUIsUUFBUTtnQkFBRWQsSUFBSTtnQkFBTWUsTUFBTTtnQkFBTUMsTUFBTTtZQUFLO1lBQzNDQyxTQUFTO2dCQUFFRCxNQUFNO1lBQU07UUFDekI7UUFFQSxtREFBbUQ7UUFDbkQsSUFBSUUsVUFBaUIsRUFBRTtRQUN2QixJQUFJaEIsZ0JBQWdCO1lBQ2xCLHlDQUF5QztZQUN6QyxNQUFNaUIsT0FBYyxNQUFNekIsK0NBQU1BLENBQUMwQixlQUFlLENBQUMsQ0FBQzs7Ozs0QkFJNUIsRUFBRWxCLGVBQWU7O01BRXZDLENBQUM7WUFDRCx5Q0FBeUM7WUFDekMsS0FBSyxNQUFNbUIsS0FBS0YsS0FBTTtnQkFDcEIsTUFBTUcsS0FBWSxNQUFNNUIsK0NBQU1BLENBQUMwQixlQUFlLENBQUMsQ0FBQzs7OzRCQUc1QixFQUFFdkIsSUFBSSxtQkFBbUIsRUFBRUssZUFBZSxvQkFBb0IsRUFBRW1CLEVBQUVyQixFQUFFLENBQUM7UUFDekYsQ0FBQztnQkFDRCxNQUFNdUIsZ0JBQWdCRCxHQUFHRSxNQUFNLEtBQUssSUFBSSxPQUFPRixHQUFHVixJQUFJLENBQUMsQ0FBQ2EsSUFBVzFCLE9BQU8wQixFQUFFQyxPQUFPLE1BQU07Z0JBQ3pGLElBQUksQ0FBQ0gsZUFBZTtnQkFDcEIsMENBQTBDO2dCQUMxQyxNQUFNSSxRQUFlLE1BQU1qQywrQ0FBTUEsQ0FBQzBCLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7a0NBTXpCLEVBQUVsQixlQUFlLG1CQUFtQixFQUFFbUIsRUFBRXJCLEVBQUUsQ0FBQzs7Ozs2QkFJaEQsRUFBRXFCLEVBQUVyQixFQUFFLENBQUM7O1FBRTVCLENBQUM7Z0JBQ0QsTUFBTTRCLGtCQUFrQixFQUFFO2dCQUMxQixLQUFLLE1BQU1DLEtBQUtGLE1BQU87b0JBQ3JCLElBQUk1QixPQUFPOEIsRUFBRUgsT0FBTyxNQUFNLEdBQUc7b0JBQzdCLE1BQU1JLEtBQVksTUFBTXBDLCtDQUFNQSxDQUFDMEIsZUFBZSxDQUFDLENBQUM7Ozs7OEJBSTVCLEVBQUV2QixJQUFJLG1CQUFtQixFQUFFSyxlQUFlLG9CQUFvQixFQUFFbUIsRUFBRXJCLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTZCLEVBQUU3QixFQUFFLENBQUM7VUFDdEgsQ0FBQztvQkFDRCxNQUFNK0IsaUJBQWlCRCxHQUFHTixNQUFNLEtBQUssSUFBSSxPQUFPTSxHQUFHbEIsSUFBSSxDQUFDLENBQUNhLElBQVcxQixPQUFPMEIsRUFBRUMsT0FBTyxNQUFNO29CQUMxRixJQUFJSyxnQkFBZ0JILGdCQUFnQkksSUFBSSxDQUFDO3dCQUFFaEMsSUFBSTZCLEVBQUU3QixFQUFFO3dCQUFFaUMsTUFBTUosRUFBRUksSUFBSTt3QkFBRWpCLE1BQU1hLEVBQUViLElBQUk7b0JBQUM7Z0JBQ2xGO2dCQUNBLElBQUlZLGdCQUFnQkosTUFBTSxHQUFHLEdBQUc7b0JBQzlCTixRQUFRYyxJQUFJLENBQUM7d0JBQUVoQyxJQUFJcUIsRUFBRXJCLEVBQUU7d0JBQUVpQyxNQUFNWixFQUFFWSxJQUFJO3dCQUFFakIsTUFBTUssRUFBRUwsSUFBSTt3QkFBRWtCLFVBQVVOO29CQUFnQjtnQkFDakY7WUFDRjtRQUNGO1FBRUEsT0FBT3JDLHFEQUFZQSxDQUFDWSxJQUFJLENBQUM7WUFBRUQ7WUFBZ0JJO1lBQVVZO1FBQVE7SUFDL0QsRUFBRSxPQUFPaUIsS0FBVTtRQUNqQixPQUFPNUMscURBQVlBLENBQUNZLElBQUksQ0FBQztZQUFFQyxPQUFPZ0MsT0FBT0QsS0FBS0UsV0FBV0Y7UUFBSyxHQUFHO1lBQUU5QixRQUFRO1FBQUk7SUFDakY7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2NtbXMtY2FydG9uaWZpY2lvLy4vc3JjL2FwcC9hcGkvcGVybWlzc2lvbnMvcm91dGUudHM/MGRlOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbGliL2F1dGgnO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnLi4vLi4vLi4vbGliL3ByaXNtYSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICAgIGNvbnN0IHVpZCA9IHNlc3Npb24/LnVzZXIgPyBOdW1iZXIoKHNlc3Npb24udXNlciBhcyBhbnkpLmlkKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBhY3RpdmVFbnRpdHlJZCA9IChzZXNzaW9uIGFzIGFueSk/LmFjdGl2ZUVudGl0eUlkID8/IG51bGw7XG4gICAgaWYgKCF1aWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTsOjbyBhdXRlbnRpY2FkbycgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICAgIC8vIEVudGlkYWRlcyBkbyB1c3XDoXJpbyAodXNhciBQcmlzbWEgcGFyYSBldml0YXIgaW5jb21wYXRpYmlsaWRhZGVzIGRlIFNRTClcbiAgICBjb25zdCBlbnRpdGllcyA9IGF3YWl0IHByaXNtYS5lbnRpdHkuZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IHsgaXNBY3RpdmU6IHRydWUsIHVzZXJFbnRpdGllczogeyBzb21lOiB7IHVzZXJJZDogdWlkIH0gfSB9LFxuICAgICAgc2VsZWN0OiB7IGlkOiB0cnVlLCBjbnBqOiB0cnVlLCBuYW1lOiB0cnVlIH0sXG4gICAgICBvcmRlckJ5OiB7IG5hbWU6ICdhc2MnIH0sXG4gICAgfSk7XG5cbiAgICAvLyBNw7NkdWxvcyBlIHByb2dyYW1hcyBwZXJtaXRpZG9zIG5hIGVudGlkYWRlIGF0aXZhXG4gICAgbGV0IG1vZHVsZXM6IGFueVtdID0gW107XG4gICAgaWYgKGFjdGl2ZUVudGl0eUlkKSB7XG4gICAgICAvLyBDYXJyZWdhciBtw7NkdWxvcyB2aW5jdWxhZG9zIMOgIGVudGlkYWRlXG4gICAgICBjb25zdCBtb2RzOiBhbnlbXSA9IGF3YWl0IHByaXNtYS4kcXVlcnlSYXdVbnNhZmUoYFxuICAgICAgICBTRUxFQ1QgbS5cImlkXCIsIG0uXCJjb2RlXCIsIG0uXCJuYW1lXCJcbiAgICAgICAgRlJPTSBcIk1vZHVsZVwiIG1cbiAgICAgICAgSk9JTiBcIkVudGl0eU1vZHVsZVwiIGVtIE9OIGVtLlwibW9kdWxlSWRcIj1tLlwiaWRcIlxuICAgICAgICBXSEVSRSBlbS5cImVudGl0eUlkXCI9JHthY3RpdmVFbnRpdHlJZH0gQU5EIG0uXCJpc0FjdGl2ZVwiPXRydWVcbiAgICAgICAgT1JERVIgQlkgbS5cIm5hbWVcIlxuICAgICAgYCk7XG4gICAgICAvLyBDaGVjYXIgcGVybWlzc8OjbyBkbyB1c3XDoXJpbyBwb3IgbcOzZHVsb1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1vZHMpIHtcbiAgICAgICAgY29uc3QgdW06IGFueVtdID0gYXdhaXQgcHJpc21hLiRxdWVyeVJhd1Vuc2FmZShgXG4gICAgICAgICAgU0VMRUNUIHVlbS5cImFsbG93ZWRcIiBGUk9NIFwiVXNlckVudGl0eU1vZHVsZVwiIHVlbVxuICAgICAgICAgIEpPSU4gXCJVc2VyRW50aXR5XCIgdWUgT04gdWUuXCJpZFwiPXVlbS5cInVzZXJFbnRpdHlJZFwiXG4gICAgICAgICAgV0hFUkUgdWUuXCJ1c2VySWRcIj0ke3VpZH0gQU5EIHVlLlwiZW50aXR5SWRcIj0ke2FjdGl2ZUVudGl0eUlkfSBBTkQgdWVtLlwibW9kdWxlSWRcIj0ke20uaWR9XG4gICAgICAgIGApO1xuICAgICAgICBjb25zdCBtb2R1bGVBbGxvd2VkID0gdW0ubGVuZ3RoID09PSAwID8gdHJ1ZSA6IHVtLnNvbWUoKHI6IGFueSkgPT4gTnVtYmVyKHIuYWxsb3dlZCkgPT09IDEpO1xuICAgICAgICBpZiAoIW1vZHVsZUFsbG93ZWQpIGNvbnRpbnVlO1xuICAgICAgICAvLyBQcm9ncmFtYXMgbGliZXJhZG9zIHBvciBlbnRpZGFkZS9tw7NkdWxvXG4gICAgICAgIGNvbnN0IHByb2dzOiBhbnlbXSA9IGF3YWl0IHByaXNtYS4kcXVlcnlSYXdVbnNhZmUoYFxuICAgICAgICAgIFNFTEVDVCBwLlwiaWRcIiwgcC5cImNvZGVcIiwgcC5cIm5hbWVcIixcbiAgICAgICAgICAgIENPQUxFU0NFKChcbiAgICAgICAgICAgICAgU0VMRUNUIGVtcC5cImFsbG93ZWRcIlxuICAgICAgICAgICAgICBGUk9NIFwiRW50aXR5TW9kdWxlUHJvZ3JhbVwiIGVtcFxuICAgICAgICAgICAgICBKT0lOIFwiRW50aXR5TW9kdWxlXCIgZW0gT04gZW0uXCJpZFwiPWVtcC5cImVudGl0eU1vZHVsZUlkXCJcbiAgICAgICAgICAgICAgV0hFUkUgZW0uXCJlbnRpdHlJZFwiPSR7YWN0aXZlRW50aXR5SWR9IEFORCBlbS5cIm1vZHVsZUlkXCI9JHttLmlkfSBBTkQgZW1wLlwicHJvZ3JhbUlkXCI9cC5cImlkXCJcbiAgICAgICAgICAgICAgTElNSVQgMVxuICAgICAgICAgICAgKSwgdHJ1ZSkgQVMgYWxsb3dlZFxuICAgICAgICAgIEZST00gXCJQcm9ncmFtXCIgcFxuICAgICAgICAgIFdIRVJFIHAuXCJtb2R1bGVJZFwiPSR7bS5pZH0gQU5EIHAuXCJpc0FjdGl2ZVwiPXRydWUgQU5EIHAuXCJzaG93SW5NZW51XCI9dHJ1ZVxuICAgICAgICAgIE9SREVSIEJZIHAuXCJuYW1lXCJcbiAgICAgICAgYCk7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRQcm9ncmFtcyA9IFtdIGFzIGFueVtdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcHJvZ3MpIHtcbiAgICAgICAgICBpZiAoTnVtYmVyKHAuYWxsb3dlZCkgIT09IDEpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IHVwOiBhbnlbXSA9IGF3YWl0IHByaXNtYS4kcXVlcnlSYXdVbnNhZmUoYFxuICAgICAgICAgICAgU0VMRUNUIHVlbXAuXCJhbGxvd2VkXCIgRlJPTSBcIlVzZXJFbnRpdHlNb2R1bGVQcm9ncmFtXCIgdWVtcFxuICAgICAgICAgICAgSk9JTiBcIlVzZXJFbnRpdHlNb2R1bGVcIiB1ZW0gT04gdWVtLlwiaWRcIj11ZW1wLlwidXNlckVudGl0eU1vZHVsZUlkXCJcbiAgICAgICAgICAgIEpPSU4gXCJVc2VyRW50aXR5XCIgdWUgT04gdWUuXCJpZFwiPXVlbS5cInVzZXJFbnRpdHlJZFwiXG4gICAgICAgICAgICBXSEVSRSB1ZS5cInVzZXJJZFwiPSR7dWlkfSBBTkQgdWUuXCJlbnRpdHlJZFwiPSR7YWN0aXZlRW50aXR5SWR9IEFORCB1ZW0uXCJtb2R1bGVJZFwiPSR7bS5pZH0gQU5EIHVlbXAuXCJwcm9ncmFtSWRcIj0ke3AuaWR9XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgY29uc3QgcHJvZ3JhbUFsbG93ZWQgPSB1cC5sZW5ndGggPT09IDAgPyB0cnVlIDogdXAuc29tZSgocjogYW55KSA9PiBOdW1iZXIoci5hbGxvd2VkKSA9PT0gMSk7XG4gICAgICAgICAgaWYgKHByb2dyYW1BbGxvd2VkKSBhbGxvd2VkUHJvZ3JhbXMucHVzaCh7IGlkOiBwLmlkLCBjb2RlOiBwLmNvZGUsIG5hbWU6IHAubmFtZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dlZFByb2dyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBtb2R1bGVzLnB1c2goeyBpZDogbS5pZCwgY29kZTogbS5jb2RlLCBuYW1lOiBtLm5hbWUsIHByb2dyYW1zOiBhbGxvd2VkUHJvZ3JhbXMgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBhY3RpdmVFbnRpdHlJZCwgZW50aXRpZXMsIG1vZHVsZXMgfSk7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFN0cmluZyhlcnI/Lm1lc3NhZ2UgfHwgZXJyKSB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiR0VUIiwic2Vzc2lvbiIsInVpZCIsInVzZXIiLCJOdW1iZXIiLCJpZCIsInVuZGVmaW5lZCIsImFjdGl2ZUVudGl0eUlkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZW50aXRpZXMiLCJlbnRpdHkiLCJmaW5kTWFueSIsIndoZXJlIiwiaXNBY3RpdmUiLCJ1c2VyRW50aXRpZXMiLCJzb21lIiwidXNlcklkIiwic2VsZWN0IiwiY25waiIsIm5hbWUiLCJvcmRlckJ5IiwibW9kdWxlcyIsIm1vZHMiLCIkcXVlcnlSYXdVbnNhZmUiLCJtIiwidW0iLCJtb2R1bGVBbGxvd2VkIiwibGVuZ3RoIiwiciIsImFsbG93ZWQiLCJwcm9ncyIsImFsbG93ZWRQcm9ncmFtcyIsInAiLCJ1cCIsInByb2dyYW1BbGxvd2VkIiwicHVzaCIsImNvZGUiLCJwcm9ncmFtcyIsImVyciIsIlN0cmluZyIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/permissions/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credenciais\",\n            credentials: {\n                email: {\n                    label: \"E-mail\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Senha\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                // Tentar autenticar usuário do banco\n                let user = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                // Se for a credencial TI estática e não existir no banco, criar e usar id numérico\n                if (!user && credentials.email === \"ti@cartonificiovalinhos.com.br\" && credentials.password === \"Carto123\") {\n                    const hash = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().hash(credentials.password, 10);\n                    user = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.create({\n                        data: {\n                            email: credentials.email,\n                            name: \"TI\",\n                            password: hash\n                        }\n                    });\n                }\n                if (!user) return null;\n                if (!user) return null;\n                const valid = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, user.password);\n                if (!valid) return null;\n                return {\n                    id: String(user.id),\n                    name: user.name,\n                    email: user.email\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.uid = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            // Garantir que o id do usuário esteja presente na sessão\n            session.user.id = token.uid ?? session.user.id ?? null;\n            // Carregar entidade ativa (última usada) do usuário\n            try {\n                const uid = token.uid ? String(token.uid) : session.user?.id;\n                if (uid) {\n                    // 1) Priorizar a última entidade selecionada pelo usuário (User.lastEntityId)\n                    const lastRow = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$queryRawUnsafe(`SELECT \"lastEntityId\" FROM \"User\" WHERE \"id\"=${Number(uid)} LIMIT 1`);\n                    let activeEntityId = lastRow[0]?.lastEntityId ?? null;\n                    // Validar que o usuário possui vínculo com a entidade escolhida\n                    if (activeEntityId != null) {\n                        const linkRow = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$queryRawUnsafe(`SELECT \"id\" FROM \"UserEntity\" WHERE \"userId\"=${Number(uid)} AND \"entityId\"=${activeEntityId} LIMIT 1`);\n                        if (linkRow.length === 0) {\n                            // se não houver vínculo, ignorar lastEntityId\n                            activeEntityId = null;\n                        }\n                    }\n                    // 2) Fallback: usar o vínculo mais recente do usuário\n                    if (activeEntityId == null) {\n                        const ueRow = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$queryRawUnsafe(`SELECT \"entityId\" FROM \"UserEntity\" WHERE \"userId\"=${Number(uid)} ORDER BY \"id\" DESC LIMIT 1`);\n                        activeEntityId = ueRow[0]?.entityId ?? null;\n                    }\n                    // 3) Fallback final: entidade 1 se existir\n                    if (activeEntityId == null) {\n                        const eRow = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$queryRawUnsafe(`SELECT id FROM \"Entity\" WHERE id=1 LIMIT 1`);\n                        if (eRow.length > 0) activeEntityId = 1;\n                    }\n                    session.activeEntityId = activeEntityId;\n                } else {\n                    session.activeEntityId = null;\n                }\n            } catch  {\n                session.activeEntityId = null;\n            }\n            return session;\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJQSxrQkFBa0IsTUFBTTt3QkFDMUIsTUFBTUksUUFBZSxNQUFNcEMsMkNBQU1BLENBQUM4QixlQUFlLENBQy9DLENBQUMsbURBQW1ELEVBQUVDLE9BQU9ILEtBQUssMkJBQTJCLENBQUM7d0JBRWhHSSxpQkFBaUJJLEtBQUssQ0FBQyxFQUFFLEVBQUVDLFlBQVk7b0JBQ3pDO29CQUNBLDJDQUEyQztvQkFDM0MsSUFBSUwsa0JBQWtCLE1BQU07d0JBQzFCLE1BQU1NLE9BQWMsTUFBTXRDLDJDQUFNQSxDQUFDOEIsZUFBZSxDQUFDLENBQUMsMENBQTBDLENBQUM7d0JBQzdGLElBQUlRLEtBQUtILE1BQU0sR0FBRyxHQUFHSCxpQkFBaUI7b0JBQ3hDO29CQUNDN0IsUUFBZ0I2QixjQUFjLEdBQUdBO2dCQUNwQyxPQUFPO29CQUNKN0IsUUFBZ0I2QixjQUFjLEdBQUc7Z0JBQ3BDO1lBQ0YsRUFBRSxPQUFNO2dCQUNMN0IsUUFBZ0I2QixjQUFjLEdBQUc7WUFDcEM7WUFDQSxPQUFPN0I7UUFDVDtJQUNGO0FBQ0YsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2NtbXMtY2FydG9uaWZpY2lvLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IENyZWRlbnRpYWxzIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnLi9wcmlzbWEnO1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgc2Vzc2lvbjogeyBzdHJhdGVneTogJ2p3dCcgfSxcbiAgcGFnZXM6IHsgc2lnbkluOiAnL2xvZ2luJyB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBDcmVkZW50aWFscyh7XG4gICAgICBuYW1lOiAnQ3JlZGVuY2lhaXMnLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6ICdFLW1haWwnLCB0eXBlOiAnZW1haWwnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnU2VuaGEnLCB0eXBlOiAncGFzc3dvcmQnIH1cbiAgICAgIH0sXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkgcmV0dXJuIG51bGw7XG4gICAgICAgIC8vIFRlbnRhciBhdXRlbnRpY2FyIHVzdcOhcmlvIGRvIGJhbmNvXG4gICAgICAgIGxldCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9IH0pO1xuICAgICAgICAvLyBTZSBmb3IgYSBjcmVkZW5jaWFsIFRJIGVzdMOhdGljYSBlIG7Do28gZXhpc3RpciBubyBiYW5jbywgY3JpYXIgZSB1c2FyIGlkIG51bcOpcmljb1xuICAgICAgICBpZiAoIXVzZXIgJiYgY3JlZGVudGlhbHMuZW1haWwgPT09ICd0aUBjYXJ0b25pZmljaW92YWxpbmhvcy5jb20uYnInICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSAnQ2FydG8xMjMnKSB7XG4gICAgICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IGJjcnlwdC5oYXNoKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCAxMCk7XG4gICAgICAgICAgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmNyZWF0ZSh7IGRhdGE6IHsgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLCBuYW1lOiAnVEknLCBwYXNzd29yZDogaGFzaCB9IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuICAgICAgICBpZiAoIXZhbGlkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IFN0cmluZyh1c2VyLmlkKSwgbmFtZTogdXNlci5uYW1lLCBlbWFpbDogdXNlci5lbWFpbCB9IGFzIGFueTtcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi51aWQgPSAodXNlciBhcyBhbnkpLmlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIC8vIEdhcmFudGlyIHF1ZSBvIGlkIGRvIHVzdcOhcmlvIGVzdGVqYSBwcmVzZW50ZSBuYSBzZXNzw6NvXG4gICAgICAoc2Vzc2lvbi51c2VyIGFzIGFueSkuaWQgPSB0b2tlbi51aWQgPz8gKHNlc3Npb24udXNlciBhcyBhbnkpLmlkID8/IG51bGw7XG4gICAgICAvLyBDYXJyZWdhciBlbnRpZGFkZSBhdGl2YSAow7psdGltYSB1c2FkYSkgZG8gdXN1w6FyaW9cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVpZCA9IHRva2VuLnVpZCA/IFN0cmluZyh0b2tlbi51aWQpIDogKHNlc3Npb24udXNlciBhcyBhbnkpPy5pZDtcbiAgICAgICAgaWYgKHVpZCkge1xuICAgICAgICAgIC8vIDEpIFByaW9yaXphciBhIMO6bHRpbWEgZW50aWRhZGUgc2VsZWNpb25hZGEgcGVsbyB1c3XDoXJpbyAoVXNlci5sYXN0RW50aXR5SWQpXG4gICAgICAgICAgY29uc3QgbGFzdFJvdzogYW55W10gPSBhd2FpdCBwcmlzbWEuJHF1ZXJ5UmF3VW5zYWZlKFxuICAgICAgICAgICAgYFNFTEVDVCBcImxhc3RFbnRpdHlJZFwiIEZST00gXCJVc2VyXCIgV0hFUkUgXCJpZFwiPSR7TnVtYmVyKHVpZCl9IExJTUlUIDFgXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsZXQgYWN0aXZlRW50aXR5SWQ6IG51bWJlciB8IG51bGwgPSBsYXN0Um93WzBdPy5sYXN0RW50aXR5SWQgPz8gbnVsbDtcbiAgICAgICAgICAvLyBWYWxpZGFyIHF1ZSBvIHVzdcOhcmlvIHBvc3N1aSB2w61uY3VsbyBjb20gYSBlbnRpZGFkZSBlc2NvbGhpZGFcbiAgICAgICAgICBpZiAoYWN0aXZlRW50aXR5SWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbGlua1JvdzogYW55W10gPSBhd2FpdCBwcmlzbWEuJHF1ZXJ5UmF3VW5zYWZlKFxuICAgICAgICAgICAgICBgU0VMRUNUIFwiaWRcIiBGUk9NIFwiVXNlckVudGl0eVwiIFdIRVJFIFwidXNlcklkXCI9JHtOdW1iZXIodWlkKX0gQU5EIFwiZW50aXR5SWRcIj0ke2FjdGl2ZUVudGl0eUlkfSBMSU1JVCAxYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChsaW5rUm93Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAvLyBzZSBuw6NvIGhvdXZlciB2w61uY3VsbywgaWdub3JhciBsYXN0RW50aXR5SWRcbiAgICAgICAgICAgICAgYWN0aXZlRW50aXR5SWQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyAyKSBGYWxsYmFjazogdXNhciBvIHbDrW5jdWxvIG1haXMgcmVjZW50ZSBkbyB1c3XDoXJpb1xuICAgICAgICAgIGlmIChhY3RpdmVFbnRpdHlJZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB1ZVJvdzogYW55W10gPSBhd2FpdCBwcmlzbWEuJHF1ZXJ5UmF3VW5zYWZlKFxuICAgICAgICAgICAgICBgU0VMRUNUIFwiZW50aXR5SWRcIiBGUk9NIFwiVXNlckVudGl0eVwiIFdIRVJFIFwidXNlcklkXCI9JHtOdW1iZXIodWlkKX0gT1JERVIgQlkgXCJpZFwiIERFU0MgTElNSVQgMWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhY3RpdmVFbnRpdHlJZCA9IHVlUm93WzBdPy5lbnRpdHlJZCA/PyBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyAzKSBGYWxsYmFjayBmaW5hbDogZW50aWRhZGUgMSBzZSBleGlzdGlyXG4gICAgICAgICAgaWYgKGFjdGl2ZUVudGl0eUlkID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGVSb3c6IGFueVtdID0gYXdhaXQgcHJpc21hLiRxdWVyeVJhd1Vuc2FmZShgU0VMRUNUIGlkIEZST00gXCJFbnRpdHlcIiBXSEVSRSBpZD0xIExJTUlUIDFgKTtcbiAgICAgICAgICAgIGlmIChlUm93Lmxlbmd0aCA+IDApIGFjdGl2ZUVudGl0eUlkID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgKHNlc3Npb24gYXMgYW55KS5hY3RpdmVFbnRpdHlJZCA9IGFjdGl2ZUVudGl0eUlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIChzZXNzaW9uIGFzIGFueSkuYWN0aXZlRW50aXR5SWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgKHNlc3Npb24gYXMgYW55KS5hY3RpdmVFbnRpdHlJZCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9XG4gIH1cbn07Il0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzIiwicHJpc21hIiwiYmNyeXB0IiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJwYWdlcyIsInNpZ25JbiIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaGFzaCIsImNyZWF0ZSIsImRhdGEiLCJ2YWxpZCIsImNvbXBhcmUiLCJpZCIsIlN0cmluZyIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwidWlkIiwibGFzdFJvdyIsIiRxdWVyeVJhd1Vuc2FmZSIsIk51bWJlciIsImFjdGl2ZUVudGl0eUlkIiwibGFzdEVudGl0eUlkIiwibGlua1JvdyIsImxlbmd0aCIsInVlUm93IiwiZW50aXR5SWQiLCJlUm93Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"error\",\n        \"warn\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQThDO0FBRTlDLE1BQU1DLGtCQUFrQkM7QUFFakIsTUFBTUMsU0FDWEYsZ0JBQWdCRSxNQUFNLElBQUksSUFBSUgsd0RBQVlBLENBQUM7SUFBRUksS0FBSztRQUFDO1FBQVM7S0FBTztBQUFDLEdBQUc7QUFFekUsSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBO0FBRXBFLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY21tcy1jYXJ0b25pZmljaW8vLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsIGFzIHVua25vd24gYXMgeyBwcmlzbWE/OiBQcmlzbWFDbGllbnQgfTtcblxuZXhwb3J0IGNvbnN0IHByaXNtYTogUHJpc21hQ2xpZW50ID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/PyBuZXcgUHJpc21hQ2xpZW50KHsgbG9nOiBbJ2Vycm9yJywgJ3dhcm4nXSB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTsiXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpermissions%2Froute&page=%2Fapi%2Fpermissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpermissions%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();