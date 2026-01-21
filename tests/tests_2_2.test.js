import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let innerHTMLAssignmentExists = false;
let innerHTMLUsedCorrectly = false;
let innerHTMLClearedCorrectly = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'CallExpression' &&
        node.callee.property && node.callee.property.name === 'addEventListener' &&
        node.arguments[0].value === 'click') {
        const functionBody = node.arguments[1].body.body;
        functionBody.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'AssignmentExpression' &&
                statement.expression.left.type === 'MemberExpression' &&
                statement.expression.left.property.name === 'innerHTML' &&
                statement.expression.left.object.name === 'palette') {
                innerHTMLAssignmentExists = true;  // Check existence of the innerHTML assignment
                innerHTMLUsedCorrectly = statement.expression.left.property.name === 'innerHTML';  // Check if innerHTML property is used correctly
                innerHTMLClearedCorrectly = statement.expression.right.type === 'Literal' && statement.expression.right.value === '';  // Check if innerHTML is correctly set to an empty string
            }
        });
    }
});

describe('Palette innerHTML Manipulation Test', () => {
    it('tests_2_2', () => {
        assert(innerHTMLAssignmentExists, "The line 'palette.innerHTML = ''; is not present in the click event handler.");
        assert(innerHTMLUsedCorrectly, "The 'innerHTML' property is not used correctly in the assignment.");
        assert(innerHTMLClearedCorrectly, "'innerHTML' should be set to an empty string to correctly clear the content.");
    });
});
