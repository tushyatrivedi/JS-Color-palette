import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
let source = fs.readFileSync('./src/script.js', 'utf8');

let divDeclared = false;
let createElementUsed = false;
let correctElementCreated = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'VariableDeclaration') {
                statement.declarations.forEach(declarator => {
                    if (declarator.id.name === 'div') {
                        divDeclared = true;  // Check if 'div' is declared
                        if (declarator.init && declarator.init.type === 'CallExpression' &&
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

// Read the source code from script.js
source = fs.readFileSync('./src/script.js', 'utf8');

let styleAccessed = false;
let backgroundColorSet = false;
let colorAssigned = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'AssignmentExpression' &&
                statement.expression.left.type === 'MemberExpression' &&
                statement.expression.left.object.type === 'MemberExpression' &&
                statement.expression.left.object.object.name === 'div' &&
                statement.expression.left.object.property.name === 'style' &&
                statement.expression.left.property.name === 'backgroundColor') {
                styleAccessed = true;  // Check if style property of 'div' is accessed
                backgroundColorSet = true;  // Check if backgroundColor property is set
                if (statement.expression.right.name === 'color') {
                    colorAssigned = true;  // Check if color is assigned to backgroundColor
                }
            }
        });
    }
});

describe('Styling <div> Element in For Loop', () => {
    it('tests_3_2', () => {
        assert(divDeclared, "The variable 'div' must be declared within the for loop.");
        assert(createElementUsed, "You must use document.createElement to create an element.");
        assert(correctElementCreated, "The element created should be a 'div'.");
    
        assert(styleAccessed, "The style property of 'div' must be accessed within the for loop.");
        assert(backgroundColorSet, "The 'backgroundColor' style property of 'div' must be set.");
        assert(colorAssigned, "The 'color' variable should be assigned to 'div.style.backgroundColor'.");
    });
});
