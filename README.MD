# Generated Module

Important notes on default tsconfig:

- always latest target
- strict mode, but with implicit any allowed


<!-- TODO: link -->
Generating should always happen via some *TypeScript builder* and not via strings manipulations as [Prisma](https://github.com/prisma/prisma/blob/188d6c8e28f0cfbaf112428aa5216c957e497ae4/packages/client/src/generation/TSClient/Model.ts#L443) do (use ts-morph or TS factory)

With this module you can use two types of builders:

- [ts-morph](https://github.com/dsherret/ts-morph/blob/latest/packages/ts-morph) (recommended)
- (WIP) [TypeScript factory](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) e.g. `ts.factory` methods (native)

The last one is most known and used, you can find a lot of examples with it on GitHub.
And you can use https://ts-ast-viewer.com/:

- write code that should be generated
- select all
- copy and adjust code from left-bottom window (Factory Code)

- When using linking for testing or in workspace: Keep in mind [this limitation](https://github.com/zardoy/repro-typescript-linking)

## Usage Example

see `./example-time` dir

- TODO link action-inputs

- But note, that in real world generating module should happen via postinstall hook

## More Examples

TIME example

## TODO

- keywords
