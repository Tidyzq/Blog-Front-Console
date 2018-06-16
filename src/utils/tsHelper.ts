export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never })[T]

export type Omit<T, K extends string> = Pick<T, Diff<keyof T, K>>
