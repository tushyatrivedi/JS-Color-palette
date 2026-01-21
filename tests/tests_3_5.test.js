import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let appendChildUsed = false;
let correctAppendChildTarget = false;
let correctAppendChildArgument = false;

// Parse the script.js file to analyze its structure
esprima.parseModule(source, {}, function (node) {
    if (node.type === 'ForStatement') {
        node.body.body.forEach(statement => {
            if (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'CallExpression' &&
                statement.expression.callee.type === 'MemberExpression' &&
                statement.expression.callee.object.name === 'palette' &&
                statement.expression.callee.property.name === 'appendChild') {
                appendChildUsed = true; // Check if appendChild is used
                if (statement.expression.arguments.length === 1 &&
                    statement.expression.arguments[0].name === 'div') {
                    correctAppendChildArgument = true; // Check if 'div' is passed to appendChild
                }
            }
        });
    }
});

describe('Appending <div> Element to Palette in For Loop', () => {
    it('tests_3_5', () => {
        assert(appendChildUsed, "appendChild must be used to add elements.");
        assert(correctAppendChildArgument, "The 'div' element must be appended to 'palette'.");
    });
});
