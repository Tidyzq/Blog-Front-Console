export {}

declare global {

  export type Diff<T extends string, U extends string> = Exclude<T, U>

  export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

}
