"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../utils/ast");
exports.default = {
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== 'MemberExpression')
                    return;
                const method = (0, ast_1.getStringValue)(node.callee.property);
                if ((0, ast_1.isPageMethod)(node, 'locator') || method === 'locator') {
                    context.report({ messageId: 'noRawLocator', node });
                }
            },
        };
    },
    meta: {
        docs: {
            category: 'Best Practices',
            description: 'Disallows the usage of raw locators',
            recommended: false,
            url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-raw-locators.md',
        },
        messages: {
            noRawLocator: 'Usage of raw locator detected. Use methods like .getByRole() or .getByText() instead of raw locators.',
        },
        type: 'suggestion',
    },
};
