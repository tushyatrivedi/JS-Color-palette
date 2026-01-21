import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let notificationDeclared = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'VariableDeclaration') {
                        statement.declarations.forEach(declarator => {
                            if (declarator.id.name === 'notification') {
                                notificationDeclared = true;  // Check if 'notification' is declared
                            }
                        });
                    }
                });
            }
        });
    }
});



let createElementUsed = false;
let correctElementCreated = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'VariableDeclaration') {
                        statement.declarations.forEach(declarator => {
                            if (declarator.id.name === 'notification' && declarator.init) {
                                if (declarator.init.type === 'CallExpression' &&
                                    declarator.init.callee.type === 'MemberExpression' &&
                                    declarator.init.callee.object.name === 'document' &&
                                    declarator.init.callee.property.name === 'createElement') {
                                    createElementUsed = true;  // Check usage of createElement
                                    if (declarator.init.arguments.length === 1 &&
                                        declarator.init.arguments[0].type === 'Literal' &&
                                        declarator.init.arguments[0].value === 'div') {
                                        correctElementCreated = true;  // Check if 'div' element is being created
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    }
});

let classNameAssigned = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    // Check for assignments within the function
                    if (statement.type === 'ExpressionStatement' && statement.expression.type === 'AssignmentExpression') {
                        let left = statement.expression.left;
                        let right = statement.expression.right;
                        // Check if className of notification is being set
                        if (left.type === 'MemberExpression' && left.object.name === 'notification' && left.property.name === 'className') {
                            if (right.type === 'Literal' && right.value === 'notification') {
                                classNameAssigned = true;
                            }
                        }
                    }
                });
            }
        });
    }
});

describe('Setting className in showNotification Function', () => {
    it('tests_4_1', () => {
        assert(notificationDeclared, "The variable 'notification' must be declared within the showNotification function.");
        assert(createElementUsed, "document.createElement must be used to create an element.");
        assert(correctElementCreated, "The element created should be a 'div'.");
        assert(classNameAssigned, "The className 'notification' must be assigned to the 'notification' element.");
    });
});
