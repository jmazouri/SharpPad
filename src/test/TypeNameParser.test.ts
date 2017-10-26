import * as assert from 'assert';
import * as vscode from 'vscode';

import TypeName from '../parsers/TypeName'
import TypeNameParser from '../parsers/TypeNameParser'

suite("TypeNameParser Tests", () =>
{
    test("Basic Type Name", () => 
    {
        let original = "System.Collections.ArrayList, mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "ArrayList");
        assert.equal(parsed.name, "System.Collections.ArrayList");
    });

    test("Generic Type Name (one type param)", () => 
    {
        let original = "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "List");
        assert.equal(parsed.name, "System.Collections.Generic.List");

        assert.equal(parsed.typeParameters[0].displayName, "String");
    });

    test("Generic Type Name (two type params)", () => 
    {
        let original = "System.Collections.Generic.Dictionary`2[[System.String, mscorlib],[System.Int32, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "Dictionary");
        assert.equal(parsed.name, "System.Collections.Generic.Dictionary");

        assert.deepEqual(parsed.typeParameters.map(param => param.displayName), ["String", "Int32"]);
    });

    test("Anonymous Type Name (one type param)", () => 
    {
        let original = "<>f__AnonymousType0`1[[System.String, mscorlib]], query_ihgahd";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "AnonymousType");
        assert.equal(parsed.name, "AnonymousType");

        assert.equal(parsed.typeParameters[0].displayName, "String");
    });

    test("Anonymous Type Name (two type params)", () => 
    {
        let original = "<>f__AnonymousType0`2[[System.String, mscorlib],[System.Int32, mscorlib]], query_xurcjv";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "AnonymousType");
        assert.equal(parsed.name, "AnonymousType");

        assert.deepEqual(parsed.typeParameters.map(param => param.displayName), ["String", "Int32"]);
    });

    test("ValueTuple Name (two type params)", () => 
    {
        let original = "System.ValueTuple`2[[System.String, mscorlib],[System.Int32, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "ValueTuple");
        assert.equal(parsed.name, "System.ValueTuple");

        assert.deepEqual(parsed.typeParameters.map(param => param.displayName), ["String", "Int32"]);
    });

    test("Nested ValueTuple", () =>
    {
        let original = "System.ValueTuple`4[[System.String, System.Private.CoreLib],[System.Decimal, System.Private.CoreLib],[System.ValueTuple`2[[System.Boolean, System.Private.CoreLib],[System.Int32, System.Private.CoreLib]], System.Private.CoreLib],[System.String, System.Private.CoreLib]], System.Private.CoreLib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.displayName, "ValueTuple");
        assert.equal(parsed.name, "System.ValueTuple");

        assert.deepEqual(getNames(parsed), ["String", "Decimal", "ValueTuple", "String"]);
        assert.deepEqual(getNames(parsed.typeParameters[2]), ["Boolean", "Int32"]);
    });
});

suite("TypeNameParser Style Tests", () =>
{
    test("Normal Type Name", () => 
    {
        let original = "System.Collections.ArrayList, mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.toString("normal"), "ArrayList");
    });

    test("Shorthand Type Name", () => 
    {
        let original = "System.Boolean, mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        let formatted = parsed.toString("shorthand");

        assert.equal(cleanHtml(formatted), "bool");
    });

    test("Namespaced Type Name", () => 
    {
        let original = "System.Collections.ArrayList, mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.toString("namespaced"), "System.Collections.ArrayList");
    });

    test("Mixed Shorthand and Namespaced Type Name", () => 
    {
        let original = "System.ValueTuple`2[[System.String, mscorlib],[System.Int32, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        let formatted = parsed.toString("mixedShorthandNamespaced");

        assert.equal(cleanHtml(formatted), "System.ValueTuple<string, int>");
    });
});

function cleanHtml(input: String)
{
    return input.replace(/<[^>]*>/g, "").replace('&lt;', '<').replace('&gt;', '>');
}

function getNames(arr: TypeName) : string[]
{
    return arr.typeParameters.map(param => param.displayName);
}