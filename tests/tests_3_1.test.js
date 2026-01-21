import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let colorDeclared = false;
let correctColorAssigned = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'CallExpression' &&
                statement.expression.callee.property.name === 'addEventListener' &&
                statement.expression.callee.object.callee.property.name === 'getElementById' &&
                statement.expression.callee.object.arguments[0].value === 'generate') {
                const eventHandlerFunction = statement.expression.arguments[1];
                if (eventHandlerFunction && eventHandlerFunction.type === 'FunctionExpression') {
                    eventHandlerFunction.body.body.forEach(innerStatement => {
                        if (innerStatement.type === 'ForStatement') {
                            innerStatement.body.body.forEach(forStatementNode => {
                                if (forStatementNode.type === 'VariableDeclaration') {
                                    forStatementNode.declarations.forEach(declarator => {
                                        if (declarator.id.name === 'color') {
                                            colorDeclared = true; // Check if 'color' is declared
                                            if (declarator.init &&
                                                declarator.init.type === 'BinaryExpression' &&
                                                declarator.init.operator === '+' &&
                                                declarator.init.left.type === 'Literal' &&
                                                declarator.init.left.value === '#' &&
                                                declarator.init.right.type === 'CallExpression' &&
                                                declarator.init.right.callee.property.name === 'toString' &&
                                                declarator.init.right.callee.object.type === 'CallExpression' &&
                                                declarator.init.right.callee.object.callee.name === 'floor' &&
                                                declarator.init.right.callee.object.arguments[0] &&
                                                declarator.init.right.callee.object.arguments[0].type === 'BinaryExpression' &&
                                                declarator.init.right.callee.object.arguments[0].left.callee.name === 'random' &&
                                                declarator.init.right.callee.object.arguments[0].right.type === 'Literal' &&
                                                declarator.init.right.callee.object.arguments[0].right.value === 16777215) {
                                                correctColorAssigned = true; // Check if correct color is assigned
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

describe('Random Color Generation Validation', () => {
    it('tests_3_1', () => {
        assert(colorDeclared, "The variable 'color' must be declared within the for loop.");
        //assert(correctColorAssigned, "The color assignment expression is incorrect or does not use the expected methods for generating a random color.");
    });
});
