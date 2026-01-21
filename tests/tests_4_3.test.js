import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let lineExists = false;
let bodyAccessed = false;
let appendChildUsed = false;
let notificationAppended = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'CallExpression' &&
                        statement.expression.callee.type === 'MemberExpression' &&
                        statement.expression.callee.property.name === 'appendChild') {
                        
                        lineExists = true;  // Check if the appendChild line exists
                        
                        let object = statement.expression.callee.object;
                        if (object.type === 'MemberExpression' &&
                            object.object.name === 'document' &&
                            object.property.name === 'body') {
                            bodyAccessed = true;  // Check if body is accessed from document
                        }

                        appendChildUsed = true;  // Check if appendChild method is used
                        
                        if (statement.expression.arguments.length === 1 &&
                            statement.expression.arguments[0].name === 'notification') {
                            notificationAppended = true;  // Check if notification is appended correctly
                        }
                    }
                });
            }
        });
    }
});

describe('Appending notification to document body in showNotification Function', () => {
    it('tests_4_3', () => {
        assert(lineExists, "The line document.body.appendChild(notification) must exist.");
        assert(bodyAccessed, "The 'body' must be accessed from 'document'.");
        assert(appendChildUsed, "The 'appendChild' method must be used.");
        assert(notificationAppended, "The 'notification' must be appended correctly.");
    });
});
