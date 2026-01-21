import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let clipboardInteractionAdded = false;
let clipboardMethodUsedCorrectly = false;
let correctColorArgumentUsed = false;

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
                                    forStatementNode.expression.callee.object.name === 'div') {
                                    forStatementNode.expression.arguments[1].body.body.forEach(eventHandlerStatement => {
                                        if (eventHandlerStatement.type === 'ExpressionStatement' &&
                                            eventHandlerStatement.expression.type === 'CallExpression' &&
                                            eventHandlerStatement.expression.callee.object &&
                                            eventHandlerStatement.expression.callee.object.object &&
                                            eventHandlerStatement.expression.callee.object.object.name === 'navigator' &&
                                            eventHandlerStatement.expression.callee.object.property.name === 'clipboard' &&
                                            eventHandlerStatement.expression.callee.property.name === 'writeText') {
                                            clipboardInteractionAdded = true;
                                            clipboardMethodUsedCorrectly = true;
                                            if (eventHandlerStatement.expression.arguments[0].name === 'color') {
                                                correctColorArgumentUsed = true;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});


let clickEventListenerAdded = false;
let correctEventUsed = false;
let functionProvidedAsHandler = false;
let showNotificationCalled = false;
let showNotificationArgumentCorrect = false;

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
                                        forStatementNode.expression.arguments[1].body.body.forEach(clickStatement => {
                                            if (clickStatement.type === 'ExpressionStatement' &&
                                                clickStatement.expression.type === 'CallExpression' &&
                                                clickStatement.expression.callee.name === 'showNotification') {
                                                showNotificationCalled = true;
                                                const argument = clickStatement.expression.arguments[0];
                                                if (argument.type === 'BinaryExpression' &&
                                                    argument.left.value === 'Copied ' &&
                                                    argument.right.name === 'color') {
                                                    showNotificationArgumentCorrect = true;
                                                }
                                            }
                                        });
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




describe('Clipboard interaction in div click event listeners', () => {
    it('tests_5_2', () => {
        assert(clipboardInteractionAdded, "Clipboard writing must be included correctly within the div's click event handler.");
        assert(clipboardMethodUsedCorrectly, "navigator.clipboard.writeText must be used correctly.");
        assert(correctColorArgumentUsed, "The 'color' variable must be passed to navigator.clipboard.writeText.");

        assert(showNotificationCalled, "The 'showNotification' function should be called inside the click event listener.");
        assert(showNotificationArgumentCorrect, "The 'showNotification' function should receive the correct argument ('Copied ' + color).");
    });
});
