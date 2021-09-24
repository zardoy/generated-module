import { CodeBlockWriter, WriterFunction, Writers } from 'ts-morph'

export const StringWriters = {
    // TODO move writer to last
    union(strings: string[]) {
        return (writer: CodeBlockWriter) => {
            if (strings.length < 2) {
                if (strings[0]) writer.quote(strings[0])
                return
            }
            const writers = strings.map(
                (str): WriterFunction =>
                    writer =>
                        writer.quote(str),
            )
            Writers.unionType(...(writers as [any, any]))(writer)
        }
    },
}
