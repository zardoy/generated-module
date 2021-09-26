// Another way would be checking is any

declare type _ModuleGenerated = typeof import('.generated') extends Record<any, any> ? true : false
declare type ModuleGenerated = _ModuleGenerated extends true ? true : false
