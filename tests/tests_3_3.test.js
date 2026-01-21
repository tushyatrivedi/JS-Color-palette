import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
let source = fs.readFileSync('./src/script.js', 'utf8');

let spanDeclared = false;
let getElementByIdUsed = false;
let correctIdUsed = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'VariableDeclaration') {
                statement.declarations.forEach(declarator => {
                    if (declarator.id.name === 'span') {
                        spanDeclared = true;  // Check if 'span' is declared
                        if (declarator.init && declarator.init.type === 'CallExpression' &&
                            declarator.init.callee.property.name === 'createElement') {
                            getElementByIdUsed = true;  // Check usage of getElementById
                            if (declarator.init.arguments.length === 1 &&
                                declarator.init.arguments[0].type === 'Literal' &&
                                declarator.init.arguments[0].value === 'span') {
                                correctIdUsed = true;  // Check if the correct ID 'span' is being used
                            }
                        }
                    }
                });
            }
        });
    }
});


// Read the source code from script.js
source = fs.readFileSync('./src/script.js', 'utf8');

let textContentAccessed = false;
let colorAssignedToTextContent = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'AssignmentExpression' &&
                statement.expression.left.type === 'MemberExpression' &&
                statement.expression.left.object.name === 'span' &&
                statement.expression.left.property.name === 'textContent') {
                textContentAccessed = true;  // Check if textContent property is accessed
                if (statement.expression.right.name === 'color') {
                    colorAssignedToTextContent = true;  // Check if color is assigned to textContent
                }
            }
        });
    }
});

describe('Setting TextContent of <span> Element in For Loop', () => {
    it('tests_3_3', () => {
        assert(spanDeclared, "The variable 'span' must be declared within the for loop.");
        assert(getElementByIdUsed, "You must use document.createElement to retrieve an element.");
        assert(correctIdUsed, "The correct ID 'span' must be used with createElement.");
        assert(textContentAccessed, "The textContent property of 'span' must be accessed within the for loop.");
        assert(colorAssignedToTextContent, "The 'color' variable should be assigned to 'span.textContent'.");
    });
});
