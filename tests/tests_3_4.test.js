import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let appendChildCalled = false;
let spanAppended = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'CallExpression' &&
                statement.expression.callee.type === 'MemberExpression' &&
                statement.expression.callee.object.name === 'div' &&
                statement.expression.callee.property.name === 'appendChild') {
                appendChildCalled = true;  // Check if appendChild is called on 'div'
                if (statement.expression.arguments.length === 1 &&
                    statement.expression.arguments[0].name === 'span') {
                    spanAppended = true;  // Check if 'span' is the argument for appendChild
                }
            }
        });
    }
});

describe('Appending <span> to <div> in For Loop', () => {
    it('tests_3_4', () => {
        assert(appendChildCalled, "The appendChild method must be called on 'div'.");
        assert(spanAppended, "The 'span' element must be passed as an argument to div.appendChild.");
    });
});
