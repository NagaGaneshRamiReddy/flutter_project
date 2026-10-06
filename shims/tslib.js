/**
 * tslib interop shim for Expo Web / Metro bundler.
 *
 * Some packages compiled with TypeScript's `esModuleInterop: true` import tslib
 * as a default import and then access helpers via `tslib.default.__extends`.
 * The real `tslib` package has no `default` export, so we add one here by making
 * `default` point back to the tslib module itself.
 */
const tslib = require('../node_modules/tslib/tslib.js');

// Spread all named helpers and add `.default` pointing to the same object
// so that both `tslib.__extends` and `tslib.default.__extends` work.
const shim = Object.assign({}, tslib, {
    default: tslib,
    __esModule: true,
});

module.exports = shim;
