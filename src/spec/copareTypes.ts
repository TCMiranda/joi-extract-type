/** @format */

export type CommonPartType<T1, T2> = T2 extends T1 ? (T1 extends T2 ? T1 : never) : never;
