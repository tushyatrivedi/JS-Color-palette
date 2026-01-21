import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

const source = fs.readFileSync('./src/script.js', 'utf8');

let addEventListenerFound = false;
let getElementByIdUsed = false;
let correctIdUsed = false;
let variableCorrectlyDeclared = false;

// Parse the JavaScript source code
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'CallExpression' && 
        node.callee && 
        node.callee.property && 
        node.callee.property.name === 'addEventListener') {
        const eventType = node.arguments[0].value;
        if (eventType === 'click') {
            addEventListenerFound = true;  // Verify 'click' event listener is added
            const eventFunction = node.arguments[1];
            if (eventFunction && eventFunction.type === 'FunctionExpression') {
                eventFunction.body.body.forEach(statement => {
                    if (statement.type === 'VariableDeclaration') {
                        statement.declarations.forEach(declaration => {
                            if (declaration.id.name === 'palette') {
                                variableCorrectlyDeclared = true;  // Check variable declaration
                                if (declaration.init && 
                                    declaration.init.type === 'CallExpression' && 
                                    declaration.init.callee.property.name === 'getElementById') {
                                    getElementByIdUsed = true;  // Check use of 'getElementById'
                                    if (declaration.init.arguments[0].value === 'palette') {
                                        correctIdUsed = true;  // Check if ID 'palette' is used correctly
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    }
});

describe('Event Listener Implementation Test', () => {
    it('tests_2_1', () => {
        assert(addEventListenerFound, "The 'click' event listener is not added.");
        if (addEventListenerFound) {
            assert(variableCorrectlyDeclared, "The variable `palette` is not declared or assigned correctly.");
            if (variableCorrectlyDeclared) {
                assert(getElementByIdUsed, "The method `document.getElementById` is not used within variable declaration.");
                assert(correctIdUsed, "The ID 'palette' is not passed correctly to `getElementById`.");
            }
        }
    });
});
