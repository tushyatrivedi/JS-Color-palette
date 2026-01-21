import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let clickEventListenerAdded = false;
let correctEventUsed = false;
let functionProvidedAsHandler = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'ExpressionStatement' &&
                functionNode.expression.type === 'CallExpression' &&
                functionNode.expression.callee.property &&
                functionNode.expression.callee.property.name === 'addEventListener' &&
                functionNode.expression.callee.object &&
                functionNode.expression.callee.object.callee &&
                functionNode.expression.callee.object.callee.property &&
                functionNode.expression.callee.object.callee.property.name === 'getElementById' &&
                functionNode.expression.callee.object.arguments &&
                functionNode.expression.callee.object.arguments[0].value === 'generate') {
                const eventHandlerFunction = functionNode.expression.arguments[1];
                if (eventHandlerFunction && eventHandlerFunction.type === 'FunctionExpression') {
                    eventHandlerFunction.body.body.forEach(statement => {
                        if (statement.type === 'ForStatement') {
                            statement.body.body.forEach(forStatementNode => {
                                if (forStatementNode.type === 'ExpressionStatement' &&
                                    forStatementNode.expression.type === 'CallExpression' &&
                                    forStatementNode.expression.callee.property.name === 'addEventListener' &&
                                    forStatementNode.expression.callee.object.name === 'div' &&
                                    forStatementNode.expression.arguments[0].value === 'click') {
                                    clickEventListenerAdded = true;
                                    correctEventUsed = true;
                                    if (forStatementNode.expression.arguments[1].type === 'FunctionExpression') {
                                        functionProvidedAsHandler = true;
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

describe('Adding click event listeners to div elements', () => {
    it('tests_5_1', () => {
        assert(clickEventListenerAdded, "An event listener must be added to each 'div' element.");
        assert(correctEventUsed, "The event type for the listener should be 'click'.");
        assert(functionProvidedAsHandler, "A function must be provided as the event handler.");
    });
});
