import * as assert from 'assert';
import * as vscode from 'vscode';

import DataFormatter from '../formatters/DataFormatter'

import IFormatProvider from '../formatters/IFormatProvider'
import ObjectFormatProvider from '../formatters/ObjectFormatProvider'
import RawFormatProvider from '../formatters/RawFormatProvider'
import ArrayFormatProvider from '../formatters/ArrayFormatProvider'
import GridFormatProvider from '../formatters/GridFormatProvider'

// Defines a Mocha test suite to group tests of similar kind together
suite("DataFormatter Tests", () =>
{
    test("Ensure Formatter for Raw", () => 
    {
        let orig = "Raw String";
        let formatter = DataFormatter.getFormatter(orig);

        assert.equal(formatter instanceof RawFormatProvider, true);
    });

    test("Ensure Formatter for Array", () => 
    {
        let orig =
        {
            "$type": "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib",
            "$values": ["this", "is", "an", "array", "of", "strings"]
        };

        let formatter = DataFormatter.getFormatter(orig);

        assert.equal(formatter instanceof ArrayFormatProvider, true);
    });

    test("Ensure Formatter for Object", () => 
    {
        let orig =
        {
            "$type": "System.Collections.ArrayList, mscorlib",
            "$value": {cool: true, probablyAnObject: "yeah"}
        };
        
        let formatter = DataFormatter.getFormatter(orig);

        assert.equal(formatter instanceof ObjectFormatProvider, true);
    });

    test("Ensure Formatter for Array (Grid)", () => 
    {
        let orig =
        {
            "$type": "System.Collections.ArrayList, mscorlib",
            "$values":
            [
                {"$type": "Test.NotReal, Test", "$value": {cool: true, probablyAnObject: "yeah"}},
                {"$type": "Test.NotReal, Test", "$value": {cool: false, probablyAnObject: "sure"}},
                {"$type": "Test.NotReal, Test", "$value": {cool: true, probablyAnObject: "alright"}},
            ]
        };
        
        let formatter = DataFormatter.getFormatter(orig);

        assert.equal(formatter instanceof GridFormatProvider, true);
    });
});