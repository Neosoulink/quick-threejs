"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../utils/ast");
const misc_1 = require("../utils/misc");
function isAssertionCall(node, additionalAssertFunctionNames) {
    return ((0, ast_1.isExpectCall)(node) ||
        additionalAssertFunctionNames.find((name) => (0, ast_1.isIdentifier)(node.callee, name)));
}
exports.default = {
    create(context) {
        const unchecked = [];
        const additionalAssertFunctionNames = (0, misc_1.getAdditionalAssertFunctionNames)(context);
        function checkExpressions(nodes) {
            for (const node of nodes) {
                const index = node.type === 'CallExpression' ? unchecked.indexOf(node) : -1;
                if (index !== -1) {
                    unchecked.splice(index, 1);
                    break;
                }
            }
        }
        return {
            CallExpression(node) {
                if ((0, ast_1.isTest)(node, ['fixme', 'only', 'skip'])) {
                    unchecked.push(node);
                }
                else if (isAssertionCall(node, additionalAssertFunctionNames)) {
                    checkExpressions(context.getAncestors());
                }
            },
            'Program:exit'() {
                unchecked.forEach((node) => {
                    context.report({ messageId: 'noAssertions', node });
                });
            },
        };
    },
    meta: {
        docs: {
            category: 'Best Practices',
            description: 'Enforce assertion to be made in a test body',
            recommended: true,
            url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md',
        },
        messages: {
            noAssertions: 'Test has no assertions',
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    additionalAssertFunctionNames: {
                        items: [{ type: 'string' }],
                        type: 'array',
                    },
                },
                type: 'object',
            },
        ],
        type: 'problem',
    },
};
