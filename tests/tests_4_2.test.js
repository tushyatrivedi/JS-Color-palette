import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let textContentAccessed = false;
let textContentAssigned = false;
let messageAssignedCorrectly = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'AssignmentExpression') {
                        let left = statement.expression.left;
                        let right = statement.expression.right;
                        // Check if textContent property of notification is being accessed
                        if (left.type === 'MemberExpression' &&
                            left.object.name === 'notification' &&
                            left.property.name === 'textContent') {
                            textContentAccessed = true;
                            // Check if assignment to textContent is done correctly
                            textContentAssigned = true;
                            if (right.type === 'Identifier' && right.name === 'message') {
                                // Check if the message variable is correctly assigned to textContent
                                messageAssignedCorrectly = true;
                            }
                        }
                    }
                });
            }
        });
    }
});

describe('Assignment to textContent in showNotification Function', () => {
    it('tests_4_2', () => {
        assert(textContentAccessed, "The 'textContent' property must be accessed on 'notification'.");
        assert(textContentAssigned, "The 'textContent' property of 'notification' must be assigned.");
        assert(messageAssignedCorrectly, "The 'message' variable should be assigned to 'notification.textContent'.");
    });
});
