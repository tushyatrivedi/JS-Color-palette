import { describe, it } from 'vitest';
import assert from 'assert';
import fs from 'fs';
import esprima from 'esprima';

// Read the source code from script.js
const source = fs.readFileSync('./src/script.js', 'utf8');

let forLoopDefined = false;
let initializerCorrect = false;
let conditionCorrect = false;
let incrementCorrect = false;
let loopBodyEmpty = true;  // Assuming the body should be empty

// Parse the script.js file to analyze its structure
esprima.parseModule(source, { range: true, tokens: true, tolerant: true, jsx: true }, function (node) {
    if (node.type === 'ForStatement') {
        forLoopDefined = true;  // Indicates a ForStatement is present

        // Check initializer
        initializerCorrect = node.init && node.init.type === 'VariableDeclaration' &&
            node.init.declarations.length === 1 &&
            node.init.declarations[0].id.name === 'i' &&
            node.init.declarations[0].init.value === 0;

        // Check condition
        conditionCorrect = node.test && node.test.type === 'BinaryExpression' &&
            node.test.operator === '<' &&
            node.test.left.name === 'i' &&
            node.test.right.value === 5;

        // Check increment
        incrementCorrect = node.update && node.update.type === 'UpdateExpression' &&
            node.update.operator === '++' &&
            node.update.argument.name === 'i';

        // Check if the loop body is empty
        loopBodyEmpty = node.body.type === 'BlockStatement' && node.body.body.length === 0;
    }
});

describe('Loop Structure Validation', () => {
    it('tests_2_3', () => {
        assert(forLoopDefined, "'for' loop is not defined. Please be sure to define it.");
        assert(initializerCorrect, "The loop initializer should be 'let i = 0;'.");
        assert(conditionCorrect, "The loop condition should be 'i < 5;'.");
        assert(incrementCorrect, "The loop increment should be 'i++'.");
        assert(loopBodyEmpty, "The loop body should be empty.");
    });
});
