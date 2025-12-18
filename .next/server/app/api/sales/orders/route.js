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
exports.id = "app/api/sales/orders/route";
exports.ids = ["app/api/sales/orders/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fsales%2Forders%2Froute&page=%2Fapi%2Fsales%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsales%2Forders%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fsales%2Forders%2Froute&page=%2Fapi%2Fsales%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsales%2Forders%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Sites_portalWeb_src_app_api_sales_orders_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/sales/orders/route.ts */ \"(rsc)/./src/app/api/sales/orders/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/sales/orders/route\",\n        pathname: \"/api/sales/orders\",\n        filename: \"route\",\n        bundlePath: \"app/api/sales/orders/route\"\n    },\n    resolvedPagePath: \"D:\\\\Sites\\\\portalWeb\\\\src\\\\app\\\\api\\\\sales\\\\orders\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Sites_portalWeb_src_app_api_sales_orders_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/sales/orders/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZzYWxlcyUyRm9yZGVycyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGc2FsZXMlMkZvcmRlcnMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZzYWxlcyUyRm9yZGVycyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDU2l0ZXMlNUNwb3J0YWxXZWIlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUQlM0ElNUNTaXRlcyU1Q3BvcnRhbFdlYiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDWTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2NtbXMtY2FydG9uaWZpY2lvLz9jNDllIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFNpdGVzXFxcXHBvcnRhbFdlYlxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxzYWxlc1xcXFxvcmRlcnNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NhbGVzL29yZGVycy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NhbGVzL29yZGVyc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc2FsZXMvb3JkZXJzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcU2l0ZXNcXFxccG9ydGFsV2ViXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXHNhbGVzXFxcXG9yZGVyc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvc2FsZXMvb3JkZXJzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fsales%2Forders%2Froute&page=%2Fapi%2Fsales%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsales%2Forders%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/sales/orders/route.ts":
/*!*******************************************!*\
  !*** ./src/app/api/sales/orders/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\n\n\nasync function GET(request) {\n    try {\n        const url = new URL(request.url);\n        const doc = url.searchParams.get(\"doc\") || undefined;\n        const data = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.salesOrder.findMany({\n            where: doc ? {\n                customerDoc: doc\n            } : undefined,\n            include: {\n                items: {\n                    include: {\n                        inventoryItem: {\n                            include: {\n                                commercialFamily: true\n                            }\n                        }\n                    }\n                }\n            },\n            orderBy: {\n                createdAt: \"desc\"\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(Array.isArray(data) ? data : []);\n    } catch (err) {\n        const message = err?.message || \"Erro ao listar pedidos\";\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: message\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    const body = await request.json();\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n    const createdById = session?.user ? Number(session.user.id) : undefined;\n    const { customerName, customerDoc, paymentTerms, carrier, deliveryDate, notes, items } = body || {};\n    if (!customerName || !Array.isArray(items) || items.length === 0) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"customerName e items s\\xe3o obrigat\\xf3rios\"\n        }, {\n            status: 400\n        });\n    }\n    const normalizedItems = items.map((it)=>{\n        const qty = Number(it.quantity || 1);\n        const price = Number(it.unitPrice || 0);\n        const disc = Number(it.discountPct || 0);\n        const lineTotal = qty * price * (1 - disc / 100);\n        return {\n            inventoryItemId: it.inventoryItemId ? Number(it.inventoryItemId) : undefined,\n            sku: it.sku || undefined,\n            name: String(it.name || it.productName || \"Produto\"),\n            quantity: qty,\n            unit: it.unit || undefined,\n            unitPrice: price,\n            discountPct: disc,\n            lineTotal\n        };\n    });\n    const subtotal = normalizedItems.reduce((acc, i)=>acc + i.quantity * i.unitPrice, 0);\n    const discountTotal = normalizedItems.reduce((acc, i)=>acc + i.quantity * i.unitPrice * (i.discountPct || 0) / 100, 0);\n    const total = normalizedItems.reduce((acc, i)=>acc + i.lineTotal, 0);\n    const code = `ORD-${Date.now()}`;\n    const created = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.salesOrder.create({\n        data: {\n            code,\n            customerName,\n            customerDoc: customerDoc || undefined,\n            paymentTerms: paymentTerms || undefined,\n            carrier: carrier || undefined,\n            deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,\n            notes: notes || undefined,\n            createdById: createdById,\n            subtotal,\n            discountTotal,\n            total,\n            items: {\n                create: normalizedItems\n            }\n        },\n        include: {\n            items: true\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(created, {\n        status: 201\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixnQkFBZ0JpQixNQUFNLENBQUMsQ0FBQ0MsS0FBYUMsSUFBV0QsTUFBTUMsRUFBRVYsU0FBUyxFQUFFO0lBRWpGLE1BQU1hLE9BQU8sQ0FBQyxJQUFJLEVBQUVDLEtBQUtDLEdBQUcsR0FBRyxDQUFDO0lBRWhDLE1BQU1DLFVBQVUsTUFBTW5FLCtDQUFNQSxDQUFDWSxVQUFVLENBQUN3RCxNQUFNLENBQUM7UUFDN0N6RCxNQUFNO1lBQ0pxRDtZQUNBNUI7WUFDQXJCLGFBQWFBLGVBQWVMO1lBQzVCMkIsY0FBY0EsZ0JBQWdCM0I7WUFDOUI0QixTQUFTQSxXQUFXNUI7WUFDcEI2QixjQUFjQSxlQUFlLElBQUkwQixLQUFLMUIsZ0JBQWdCN0I7WUFDdEQ4QixPQUFPQSxTQUFTOUI7WUFDaEJzQixhQUFhQTtZQUNiMEI7WUFDQUk7WUFDQUM7WUFDQTlDLE9BQU87Z0JBQUVtRCxRQUFRMUI7WUFBZ0I7UUFDbkM7UUFDQTFCLFNBQVM7WUFBRUMsT0FBTztRQUFLO0lBQ3pCO0lBRUEsT0FBT2xCLHFEQUFZQSxDQUFDdUIsSUFBSSxDQUFDNkMsU0FBUztRQUFFdkMsUUFBUTtJQUFJO0FBQ2xEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY21tcy1jYXJ0b25pZmljaW8vLi9zcmMvYXBwL2FwaS9zYWxlcy9vcmRlcnMvcm91dGUudHM/NTlmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICcuLi8uLi8uLi8uLi9saWIvcHJpc21hJztcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9saWIvYXV0aCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGRvYyA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdkb2MnKSB8fCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcHJpc21hLnNhbGVzT3JkZXIuZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IGRvYyA/IHsgY3VzdG9tZXJEb2M6IGRvYyB9IDogdW5kZWZpbmVkLFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICAgIGludmVudG9yeUl0ZW06IHtcbiAgICAgICAgICAgICAgaW5jbHVkZTogeyBjb21tZXJjaWFsRmFtaWx5OiB0cnVlIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogJ2Rlc2MnIH1cbiAgICB9KTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSk7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGVycj8ubWVzc2FnZSB8fCAnRXJybyBhbyBsaXN0YXIgcGVkaWRvcyc7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IG1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICBjb25zdCBjcmVhdGVkQnlJZCA9IHNlc3Npb24/LnVzZXIgPyBOdW1iZXIoKHNlc3Npb24udXNlciBhcyBhbnkpLmlkKSA6IHVuZGVmaW5lZDtcblxuICBjb25zdCB7XG4gICAgY3VzdG9tZXJOYW1lLFxuICAgIGN1c3RvbWVyRG9jLFxuICAgIHBheW1lbnRUZXJtcyxcbiAgICBjYXJyaWVyLFxuICAgIGRlbGl2ZXJ5RGF0ZSxcbiAgICBub3RlcyxcbiAgICBpdGVtcyxcbiAgfSA9IGJvZHkgfHwge307XG5cbiAgaWYgKCFjdXN0b21lck5hbWUgfHwgIUFycmF5LmlzQXJyYXkoaXRlbXMpIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnY3VzdG9tZXJOYW1lIGUgaXRlbXMgc8OjbyBvYnJpZ2F0w7NyaW9zJyB9LCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZEl0ZW1zID0gaXRlbXMubWFwKChpdDogYW55KSA9PiB7XG4gICAgY29uc3QgcXR5ID0gTnVtYmVyKGl0LnF1YW50aXR5IHx8IDEpO1xuICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGl0LnVuaXRQcmljZSB8fCAwKTtcbiAgICBjb25zdCBkaXNjID0gTnVtYmVyKGl0LmRpc2NvdW50UGN0IHx8IDApO1xuICAgIGNvbnN0IGxpbmVUb3RhbCA9IHF0eSAqIHByaWNlICogKDEgLSBkaXNjIC8gMTAwKTtcbiAgICByZXR1cm4ge1xuICAgICAgaW52ZW50b3J5SXRlbUlkOiBpdC5pbnZlbnRvcnlJdGVtSWQgPyBOdW1iZXIoaXQuaW52ZW50b3J5SXRlbUlkKSA6IHVuZGVmaW5lZCxcbiAgICAgIHNrdTogaXQuc2t1IHx8IHVuZGVmaW5lZCxcbiAgICAgIG5hbWU6IFN0cmluZyhpdC5uYW1lIHx8IGl0LnByb2R1Y3ROYW1lIHx8ICdQcm9kdXRvJyksXG4gICAgICBxdWFudGl0eTogcXR5LFxuICAgICAgdW5pdDogaXQudW5pdCB8fCB1bmRlZmluZWQsXG4gICAgICB1bml0UHJpY2U6IHByaWNlLFxuICAgICAgZGlzY291bnRQY3Q6IGRpc2MsXG4gICAgICBsaW5lVG90YWwsXG4gICAgfTtcbiAgfSk7XG5cbiAgY29uc3Qgc3VidG90YWwgPSBub3JtYWxpemVkSXRlbXMucmVkdWNlKChhY2M6IG51bWJlciwgaTogYW55KSA9PiBhY2MgKyBpLnF1YW50aXR5ICogaS51bml0UHJpY2UsIDApO1xuICBjb25zdCBkaXNjb3VudFRvdGFsID0gbm9ybWFsaXplZEl0ZW1zLnJlZHVjZSgoYWNjOiBudW1iZXIsIGk6IGFueSkgPT4gYWNjICsgKGkucXVhbnRpdHkgKiBpLnVuaXRQcmljZSAqIChpLmRpc2NvdW50UGN0IHx8IDApIC8gMTAwKSwgMCk7XG4gIGNvbnN0IHRvdGFsID0gbm9ybWFsaXplZEl0ZW1zLnJlZHVjZSgoYWNjOiBudW1iZXIsIGk6IGFueSkgPT4gYWNjICsgaS5saW5lVG90YWwsIDApO1xuXG4gIGNvbnN0IGNvZGUgPSBgT1JELSR7RGF0ZS5ub3coKX1gO1xuXG4gIGNvbnN0IGNyZWF0ZWQgPSBhd2FpdCBwcmlzbWEuc2FsZXNPcmRlci5jcmVhdGUoe1xuICAgIGRhdGE6IHtcbiAgICAgIGNvZGUsXG4gICAgICBjdXN0b21lck5hbWUsXG4gICAgICBjdXN0b21lckRvYzogY3VzdG9tZXJEb2MgfHwgdW5kZWZpbmVkLFxuICAgICAgcGF5bWVudFRlcm1zOiBwYXltZW50VGVybXMgfHwgdW5kZWZpbmVkLFxuICAgICAgY2FycmllcjogY2FycmllciB8fCB1bmRlZmluZWQsXG4gICAgICBkZWxpdmVyeURhdGU6IGRlbGl2ZXJ5RGF0ZSA/IG5ldyBEYXRlKGRlbGl2ZXJ5RGF0ZSkgOiB1bmRlZmluZWQsXG4gICAgICBub3Rlczogbm90ZXMgfHwgdW5kZWZpbmVkLFxuICAgICAgY3JlYXRlZEJ5SWQ6IGNyZWF0ZWRCeUlkLFxuICAgICAgc3VidG90YWwsXG4gICAgICBkaXNjb3VudFRvdGFsLFxuICAgICAgdG90YWwsXG4gICAgICBpdGVtczogeyBjcmVhdGU6IG5vcm1hbGl6ZWRJdGVtcyB9LFxuICAgIH0sXG4gICAgaW5jbHVkZTogeyBpdGVtczogdHJ1ZSB9LFxuICB9KTtcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oY3JlYXRlZCwgeyBzdGF0dXM6IDIwMSB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJHRVQiLCJyZXF1ZXN0IiwidXJsIiwiVVJMIiwiZG9jIiwic2VhcmNoUGFyYW1zIiwiZ2V0IiwidW5kZWZpbmVkIiwiZGF0YSIsInNhbGVzT3JkZXIiLCJmaW5kTWFueSIsIndoZXJlIiwiY3VzdG9tZXJEb2MiLCJpbmNsdWRlIiwiaXRlbXMiLCJpbnZlbnRvcnlJdGVtIiwiY29tbWVyY2lhbEZhbWlseSIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJqc29uIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyIiwibWVzc2FnZSIsImVycm9yIiwic3RhdHVzIiwiUE9TVCIsImJvZHkiLCJzZXNzaW9uIiwiY3JlYXRlZEJ5SWQiLCJ1c2VyIiwiTnVtYmVyIiwiaWQiLCJjdXN0b21lck5hbWUiLCJwYXltZW50VGVybXMiLCJjYXJyaWVyIiwiZGVsaXZlcnlEYXRlIiwibm90ZXMiLCJsZW5ndGgiLCJub3JtYWxpemVkSXRlbXMiLCJtYXAiLCJpdCIsInF0eSIsInF1YW50aXR5IiwicHJpY2UiLCJ1bml0UHJpY2UiLCJkaXNjIiwiZGlzY291bnRQY3QiLCJsaW5lVG90YWwiLCJpbnZlbnRvcnlJdGVtSWQiLCJza3UiLCJuYW1lIiwiU3RyaW5nIiwicHJvZHVjdE5hbWUiLCJ1bml0Iiwic3VidG90YWwiLCJyZWR1Y2UiLCJhY2MiLCJpIiwiZGlzY291bnRUb3RhbCIsInRvdGFsIiwiY29kZSIsIkRhdGUiLCJub3ciLCJjcmVhdGVkIiwiY3JlYXRlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/sales/orders/route.ts\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fsales%2Forders%2Froute&page=%2Fapi%2Fsales%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsales%2Forders%2Froute.ts&appDir=D%3A%5CSites%5CportalWeb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSites%5CportalWeb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();