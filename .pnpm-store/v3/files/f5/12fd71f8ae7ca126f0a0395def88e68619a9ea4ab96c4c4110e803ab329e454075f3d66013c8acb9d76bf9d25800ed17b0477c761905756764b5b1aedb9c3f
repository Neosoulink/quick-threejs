"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalAssertFunctionNames = exports.getAmountData = void 0;
const getAmountData = (amount) => ({
    amount: amount.toString(),
    s: amount === 1 ? '' : 's',
});
exports.getAmountData = getAmountData;
function getAdditionalAssertFunctionNames(context) {
    const globalSettings = context.settings.playwright?.additionalAssertFunctionNames ??
        [];
    const ruleSettings = context.options[0]
        ?.additionalAssertFunctionNames ?? [];
    return [...globalSettings, ...ruleSettings];
}
exports.getAdditionalAssertFunctionNames = getAdditionalAssertFunctionNames;
