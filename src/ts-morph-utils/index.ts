import { CompilerOptions, JSDocStructure, JSDocTagStructure, ModuleKind, ModuleResolutionKind, ScriptTarget } from 'ts-morph'

// All in one solution for package.json

export const compilerOptions: CompilerOptions = {
    target: ScriptTarget.Latest,
    strict: true,
    noImplicitAny: false,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    module: ModuleKind.CommonJS,
    moduleResolution: ModuleResolutionKind.NodeJs,
    // I think it'd better to handle it manually
    // noEmitOnError: true
}

interface JSDocInput {
    description?: string
    default?: string
}
export const createJsdoc = ({ description, default: defaultTag }: JSDocInput): Omit<JSDocStructure, 'kind'>[] | undefined => {
    const tags: Omit<JSDocTagStructure, 'kind'>[] = []

    if (defaultTag)
        tags.push({
            tagName: 'default',
            text: defaultTag,
        })

    return description || tags.length
        ? [
              {
                  description,
                  tags,
              },
          ]
        : undefined
}
