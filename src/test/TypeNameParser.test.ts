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

        assert.equal(parsed.typeName, "ArrayList");
        assert.equal(parsed.namespacedTypeName, "System.Collections.ArrayList");
        assert.equal(parsed.assemblyQualifiedName, original);
    });

    test("Generic Type Name (one type param)", () => 
    {
        let original = "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.typeName, "List");
        assert.equal(parsed.namespacedTypeName, "System.Collections.Generic.List");
        assert.equal(parsed.assemblyQualifiedName, original);

        assert.equal(parsed.typeParameters[0].typeName, "String");
    });

    test("Generic Type Name (two type params)", () => 
    {
        let original = "System.Collections.Generic.Dictionary`2[[System.String, mscorlib],[System.Int32, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.typeName, "Dictionary");
        assert.equal(parsed.namespacedTypeName, "System.Collections.Generic.Dictionary");
        assert.equal(parsed.assemblyQualifiedName, original);

        assert.deepEqual(parsed.typeParameters.map(param => param.typeName), ["String", "Int32"]);
    });

    test("Anonymous Type Name (one type param)", () => 
    {
        let original = "<>f__AnonymousType0`1[[System.String, mscorlib]], query_ihgahd";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.typeName, "AnonymousType");
        assert.equal(parsed.namespacedTypeName, "AnonymousType");
        assert.equal(parsed.assemblyQualifiedName, original);

        assert.equal(parsed.typeParameters[0].typeName, "String");
    });

    test("Anonymous Type Name (two type params)", () => 
    {
        let original = "<>f__AnonymousType0`2[[System.String, mscorlib],[System.Int32, mscorlib]], query_xurcjv";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.typeName, "AnonymousType");
        assert.equal(parsed.namespacedTypeName, "AnonymousType");
        assert.equal(parsed.assemblyQualifiedName, original);

        assert.deepEqual(parsed.typeParameters.map(param => param.typeName), ["String", "Int32"]);
    });

    test("ValueTuple Name (two type params)", () => 
    {
        let original = "System.ValueTuple`2[[System.String, mscorlib],[System.Int32, mscorlib]], mscorlib";
        let parsed: TypeName = TypeNameParser.parse(original);

        assert.equal(parsed.typeName, "ValueTuple");
        assert.equal(parsed.namespacedTypeName, "System.ValueTuple");
        assert.equal(parsed.assemblyQualifiedName, original);

        assert.deepEqual(parsed.typeParameters.map(param => param.typeName), ["String", "Int32"]);
    });
});