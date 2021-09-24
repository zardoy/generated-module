//@ts-check
import { StructureKind } from 'ts-morph'
import { generateTypes } from '../build/index.js'

generateTypes({
    moduleName: '.time-generated',
    generator: {
        tsMorph: [
            {
                kind: StructureKind.TypeAlias,
                name: 'CurrentTime',
                isExported: true,
                type: writer => writer.quote(new Date().toLocaleTimeString()),
            },
        ],
    },
}).catch(e => {
    console.error(e)
    process.exit(1)
})
