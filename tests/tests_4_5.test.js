import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let setTimeoutDefined = false;
let setTimeoutUsedCorrectly = false;
let correctTimeoutValue = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'CallExpression' &&
                        statement.expression.callee.name === 'setTimeout') {
                        setTimeoutDefined = true;  // Check if setTimeout is defined
                        if (statement.expression.arguments.length === 2) {
                            setTimeoutUsedCorrectly = true;  // Check if setTimeout is used correctly
                            // Check if the timeout value is set to 20000
                            if (statement.expression.arguments[1].type === 'Literal' &&
                                statement.expression.arguments[1].value === 20000) {
                                correctTimeoutValue = true;
                            }
                        }
                    }
                });
            }
        });
    }
});

describe('Usage of setTimeout in showNotification Function', () => {
    it('tests_4_5', () => {
        assert(setTimeoutDefined, "setTimeout must be defined within the function.");
        assert(setTimeoutUsedCorrectly, "setTimeout must be used correctly with two arguments.");
        assert(correctTimeoutValue, "The timeout value should be set to 20000 milliseconds.");
    });
});
