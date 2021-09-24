import { join } from 'path'
import { CompilerOptions, Project, StatementStructures } from 'ts-morph'
import type { Options } from './index'

export const saveTsMorph = async (
    statements: StatementStructures[],
    compilerOptions: CompilerOptions,
    targetFile: string,
    userOptions: Required<Pick<Options, 'onCompilationErrors' | 'printCompilationErrors'>>,
) => {
    const project = new Project({
        skipAddingFilesFromTsConfig: true,
        compilerOptions,
    })
    const sourceFile = project.createSourceFile(
        targetFile,
        {
            statements,
        },
        {
            overwrite: true,
        },
    )
    const { onCompilationErrors, printCompilationErrors } = userOptions
    if (onCompilationErrors === 'ignore' && printCompilationErrors === false) {
    } else {
        const diagnostics = project.getPreEmitDiagnostics()
        if (diagnostics.length) {
            console.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
            switch (onCompilationErrors) {
                case 'throw':
                    throw new Error('failed to generate fresh types, there are now out of sync!')
                case 'exit':
                    process.exit(1)
            }
        }
    }
    await project.save()
}
