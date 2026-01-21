import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let styleAccessed = false;
let displayPropertySet = false;
let correctDisplayValue = false;
let incorrectPropertySet = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'AssignmentExpression' &&
                        statement.expression.left.type === 'MemberExpression' &&
                        statement.expression.left.object.type === 'MemberExpression' &&
                        statement.expression.left.object.object.name === 'notification' &&
                        statement.expression.left.object.property.name === 'style') {
                        styleAccessed = true;  // General check for style property access
                        if (statement.expression.left.property.name === 'display') {
                            displayPropertySet = true;  // Check if display property of style is being set
                            if (statement.expression.right.type === 'Literal' && 
                                statement.expression.right.value === 'block') {
                                correctDisplayValue = true;  // Check if the value 'block' is assigned
                            }
                        } else {
                            // Check if any other property besides 'display' is set to 'block'
                            if (statement.expression.right.type === 'Literal' && 
                                statement.expression.right.value === 'block') {
                                incorrectPropertySet = true;
                            }
                        }
                    }
                });
            }
        });
    }
});

describe('Setting display style in showNotification Function', () => {
    it('tests_4_4', () => {
        assert(styleAccessed, "The style property of 'notification' must be accessed.");
        assert(displayPropertySet, "The 'display' property must be set on 'notification.style'.");
        assert(correctDisplayValue, "The 'display' property must be set to 'block'.");
        assert(!incorrectPropertySet, "No other style properties should be set to 'block' except 'display'.");
    });
});
