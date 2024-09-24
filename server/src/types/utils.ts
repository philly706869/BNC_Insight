export type ClassToObject<Class> = { [P in keyof Class]: Class[P] };
