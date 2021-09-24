import { createWriteStream } from 'fs'
import { basename } from 'path'
import ts from 'typescript'

class TypesGenerator {
    static get any() {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
    }

    static get string() {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    }

    static get number() {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
    }

    static get boolean() {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
    }

    static array(type: ts.TypeNode) {
        return ts.factory.createArrayTypeNode(type)
    }

    static union(types: readonly ts.TypeNode[]) {
        return ts.factory.createUnionTypeNode(types)
    }

    static type(name: string | ts.Identifier, type: ts.TypeNode) {
        return ts.factory.createTypeAliasDeclaration(undefined, undefined, name, undefined, type)
    }

    static genericType(name: string | ts.EntityName, types: any[] | readonly ts.TypeNode[] | undefined) {
        return ts.factory.createTypeReferenceNode(name, types)
    }

    static promiseType(type: any) {
        return TypesGenerator.genericType('Promise', [type])
    }

    // static parameter({ name, type, required = false }) {
    //     return ts.factory.createParameterDeclaration(
    //         undefined,
    //         undefined,
    //         undefined,
    //         name,
    //         !required ? ts.factory.createKeywordTypeNode(ts.SyntaxKind.QuestionToken) : undefined,
    //         type,
    //     )
    // }

    // static declarationExport(exportClause: ts.NamedExportBindings | undefined) {
    //     return ts.factory.createExportDeclaration(undefined, undefined, false, exportClause)
    // }
}

const createPrinter = (path: string) => {
    const filename = basename(path)

    const methodsFile = ts.createSourceFile(filename, '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TSX)

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

    const output = createWriteStream(path, { start: 0 })
    output.write('// AUTO-GENERATED\n')

    return {
        end: output.end,
        write: output.write,
        writeNode(node: ts.Node) {
            const result = printer.printNode(ts.EmitHint.Unspecified, node, methodsFile)
            output.write(result)
        },
    }
}

async function generate() {
    const { factory } = ts

    // const [{ methods }, { definitions: responses }, { definitions: objects }, { errors }] = await Promise.all([
    //     readJSONFile('./schemas/methods.json'),
    //     readJSONFile('./schemas/responses.json'),
    //     readJSONFile('./schemas/objects.json'),
    //     readJSONFile('./schemas/errors.json'),
    // ])

    const { writeNode } = createPrinter(`./output.ts`)

    const paramsIdentifier = ts.factory.createIdentifier('Params')

    writeNode(
        TypesGenerator.type(
            paramsIdentifier,
            TypesGenerator.union([
                factory.createLiteralTypeNode(factory.createStringLiteral("te'xt")),
                factory.createLiteralTypeNode(factory.createStringLiteral('ANother " one!')),
            ]),
        ),
    )

    // writeNode(
    //     ts.factory.createImportDeclaration(
    //         undefined,
    //         undefined,
    //         ts.factory.createImportClause(false, ts.factory.createNamespaceImport(ts.factory.createIdentifier('FS'))),
    //         ts.factory.createStringLiteral('fs')
    //     )
    // )

    // for (const method of methods) {
    //     const params = new InterfaceGenerator({
    //         name: `${camelizedCategory}Params`,
    //     })

    //     for (const parsedParameter of parseParameters(method.parameters, {
    //         namespace: objectsIdentifier,
    //     })) {
    //         params.addProperty(parsedParameter)
    //     }

    //     params.methods.push(
    //         ts.factory.createIndexSignature(
    //             undefined,
    //             undefined,
    //             [
    //                 ts.factory.createParameterDeclaration(
    //                     undefined,
    //                     undefined,
    //                     undefined,
    //                     'key',
    //                     undefined,
    //                     ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    //                 ),
    //             ],
    //             ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
    //         ),
    //     )

    //     apiParams.push(params)

    //     const group = apiGroups[groupName]

    //     group.addMethod({
    //         name: methodName,
    //         description: method.description && formatTSComments(method.description),
    //         parameters: [
    //             TypesGenerator.parameter({
    //                 name: 'params',
    //                 type: ts.factory.createQualifiedName(paramsIdentifier, params.name),
    //                 required: true,
    //             }),
    //         ],
    //         result: TypesGenerator.promiseType(
    //             ts.factory.createQualifiedName(
    //                 responsesIdentifier,
    //                 ts.factory.createIdentifier(
    //                     toPascalCase((method.responses.response || method.responses.keyResponse).$ref.replace('responses.json#/definitions/', '')),
    //                 ),
    //             ),
    //         ),
    //     })
    // }

    // for (const response of parseResponses(responses, { namespace: objectsIdentifier })) {
    //     writeResponsesNode(
    //         response.kind === 'interface'
    //             ? response.type.toASTNode({ exported: true })
    //             : TypesGenerator.declarationExport(
    //                   ts.factory.createTypeAliasDeclaration(
    //                       undefined,
    //                       ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword),
    //                       response.name,
    //                       undefined,
    //                       response.type,
    //                   ),
    //               ),
    //     )
    // }

    // for (const object of parseJSONSchema(objects)) {
    //     if (object.exportedNodes) {
    //         for (const exportedNode of object.exportedNodes) {
    //             writeObjectsNode(exportedNode)
    //         }
    //     }

    //     writeObjectsNode(
    //         object.kind === 'interface'
    //             ? object.type.toASTNode({ exported: true })
    //             : TypesGenerator.declarationExport(
    //                   ts.factory.createTypeAliasDeclaration(undefined, undefined, toPascalCase(object.name), undefined, object.type),
    //               ),
    //     )
    // }

    // // writeConstantsNode

    // writeConstantsNode(
    //     TypesGenerator.declarationExport(
    //         ts.factory.createEnumDeclaration(
    //             undefined,
    //             undefined,
    //             'APIErrorCode',
    //             Object.entries(errors).map(([name, info]) =>
    //                 ts.addSyntheticLeadingComment(
    //                     ts.factory.createEnumMember(name.substring(10).toUpperCase(), ts.factory.createNumericLiteral(String(info.code))),
    //                     ts.SyntaxKind.MultiLineCommentTrivia,
    //                     formatTSComments(`${info.description}\n\nCode: \`${info.code}\``),
    //                     true,
    //                 ),
    //             ),
    //         ),
    //     ),
    // )

    // const apiMethodsInterface = new InterfaceGenerator({
    //     name: 'APIMethods',
    // })

    // for (const [name, group] of Object.entries(apiGroups)) {
    //     writeMethodsNode(
    //         group.toASTNode({
    //             exported: true,
    //         }),
    //     )

    //     apiMethodsInterface.addProperty({
    //         name,
    //         type: group.name,
    //         description: group.description,
    //         required: true,
    //     })
    // }

    // for (const params of apiParams) {
    //     writeParamsNode(
    //         params.toASTNode({
    //             exported: true,
    //         }),
    //     )
    // }

    // writeMethodsNode(
    //     apiMethodsInterface.toASTNode({
    //         exported: true,
    //     }),
    // )
}

generate().catch(error => {
    // eslint-disable-next-line no-console
    console.error('Could not generate schema', error)

    process.exit(1)
})
