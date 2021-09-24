import fsExtra from 'fs-extra'
import { writeFile } from 'jsonfile'
import { join } from 'path'
import { ModuleKind, StatementStructures } from 'ts-morph'
import { PackageJson } from 'type-fest'
import { saveTsMorph } from './saveTsMorph'
import { compilerOptions } from './ts-morph-utils'

export interface Options {
    moduleName: string
    /** ts-morph statements */
    generator:
        | {
              tsMorph: StatementStructures[]
          }
        | {
              typescript: import('typescript').Node[]
          }

    /** ts-morph options */
    // tsMorph?: {
    //     compilerOptions: CompilerOptions,
    //     extend: boolean
    // }

    /**
     * Directory that contains `node_modules`
     * @default process.cwd()
     */
    targetDirectory?: string
    // useEmit?: boolean
    /**
     * Types entry point file in which statements will be writed
     * @default index.d.ts
     */
    typesPath?: string
    /**
     * Whether generate CommonJS (cjs) or ECMAScript (esm) module imports/exports
     * If defined, overrides compilerOptions.module option
     * If not defined compilerOptions can override this
     * @default cjs
     */
    module?: 'cjs' | 'esm'
    /**
     * `ignore` will place generated types with errors, which most likely make them unusable
     * `exit` will call process.exit(1)
     * @default throw
     */
    onCompilationErrors?: 'throw' | 'exit' | 'ignore'
    /**
     * Whether print diagnostics (if any) into `console.error`
     * Can be used with {@linkcode Options.onCompilationErrors} set to `ignore` to be completely silent
     * @default true
     */
    printCompilationErrors?: boolean

    // builder: (addStatement: () => ) => void
}

export const generateTypes = async ({
    moduleName,
    targetDirectory = process.cwd(),
    typesPath = 'index.d.ts',
    generator,
    onCompilationErrors = 'throw',
    printCompilationErrors = true,
    module,
}: Options) => {
    const modulePath = join(targetDirectory, `node_modules/${moduleName}`)
    await fsExtra.ensureDir(modulePath)

    const resolvedCompilerOptions = {
        ...compilerOptions,
        ...(module ? { module: module === 'cjs' ? ModuleKind.CommonJS : ModuleKind.ESNext } : {}),
    }

    if ('tsMorph' in generator) {
        saveTsMorph(generator.tsMorph, resolvedCompilerOptions, join(modulePath, typesPath), { onCompilationErrors, printCompilationErrors })
    } else {
        throw new Error('not implemented')
    }

    const generatedPackage: PackageJson = {
        name: moduleName,
        version: '0.0.0-generated',
        types: typesPath,
    }
    await writeFile(join(modulePath, 'package.json'), generatedPackage)
}

export * from './writers'
