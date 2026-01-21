import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let setTimeoutContainsDisplay = false;
let styleAccessedInTimeout = false;
let displayPropertySetInTimeout = false;
let correctDisplayValueInTimeout = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'CallExpression' &&
                        statement.expression.callee.name === 'setTimeout') {
                        const timeoutFunction = statement.expression.arguments[0];
                        if (timeoutFunction && timeoutFunction.type === 'FunctionExpression') {
                            timeoutFunction.body.body.forEach(timeoutStatement => {
                                if (timeoutStatement.type === 'ExpressionStatement' &&
                                    timeoutStatement.expression.type === 'AssignmentExpression' &&
                                    timeoutStatement.expression.left.type === 'MemberExpression' &&
                                    timeoutStatement.expression.left.object.type === 'MemberExpression' &&
                                    timeoutStatement.expression.left.object.object.name === 'notification' &&
                                    timeoutStatement.expression.left.object.property.name === 'style' &&
                                    timeoutStatement.expression.left.property.name === 'display') {
                                    setTimeoutContainsDisplay = true;  // Check if the display property is set within setTimeout
                                    styleAccessedInTimeout = true;  // Check if style property of 'notification' is accessed
                                    displayPropertySetInTimeout = true;  // Check if display property of style is being set
                                    if (timeoutStatement.expression.right.type === 'Literal' && 
                                        timeoutStatement.expression.right.value === 'none') {
                                        correctDisplayValueInTimeout = true;  // Check if the value 'none' is assigned
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
});

// describe('Setting display style to none in setTimeout within showNotification Function', () => {
//     it('tests_4_6', () => {
       
//     });
// });


let removeChildCalled = false;
let removeChildUsedCorrectly = false;
let notificationRemoved = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'Program') {
        node.body.forEach(functionNode => {
            if (functionNode.type === 'FunctionDeclaration' && functionNode.id.name === 'showNotification') {
                functionNode.body.body.forEach(statement => {
                    if (statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'CallExpression' &&
                        statement.expression.callee.name === 'setTimeout') {
                        const timeoutFunction = statement.expression.arguments[0];
                        if (timeoutFunction && timeoutFunction.type === 'FunctionExpression') {
                            timeoutFunction.body.body.forEach(timeoutStatement => {
                                if (timeoutStatement.type === 'ExpressionStatement' &&
                                    timeoutStatement.expression.type === 'CallExpression' &&
                                    timeoutStatement.expression.callee.property.name === 'removeChild' &&
                                    timeoutStatement.expression.callee.object.type === 'MemberExpression' &&
                                    timeoutStatement.expression.callee.object.object.name === 'document' &&
                                    timeoutStatement.expression.callee.object.property.name === 'body') {
                                    removeChildCalled = true;  // Check if removeChild is called on 'document.body'
                                    if (timeoutStatement.expression.arguments.length === 1 &&
                                        timeoutStatement.expression.arguments[0].name === 'notification') {
                                        removeChildUsedCorrectly = true;  // Check if removeChild is used with the correct argument
                                        notificationRemoved = true;  // Check if the 'notification' element is being removed
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
});

describe('Removing notification element in setTimeout within showNotification Function', () => {
    it('tests_4_6', () => {
        assert(setTimeoutContainsDisplay, "setTimeout must contain a statement to set the display property of notification.");
        assert(styleAccessedInTimeout, "The style property of 'notification' must be accessed within setTimeout.");
        assert(displayPropertySetInTimeout, "The 'display' property must be set on 'notification.style' within setTimeout.");
        assert(correctDisplayValueInTimeout, "The 'display' property within setTimeout must be set to 'none'.");
        
        assert(removeChildCalled, "The removeChild method must be called on 'document.body'.");
        assert(removeChildUsedCorrectly, "The removeChild method must be used correctly with 'notification' as an argument.");
        assert(notificationRemoved, "The 'notification' element must be removed using document.body.removeChild.");
    });
});

