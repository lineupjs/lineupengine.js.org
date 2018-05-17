import { IExceptionContext } from '../logic';
export default class KeyFinder {
    readonly context: IExceptionContext;
    readonly key: (rowIndex: number) => string;
    private readonly cache;
    private lastFilled;
    private readonly key2index;
    constructor(context: IExceptionContext, key: (rowIndex: number) => string);
    private findValidStart(before);
    posByKey(key: string): {
        index: number;
        pos: number;
    };
    pos(index: number): number;
    private fillCache(first, last, offset, callback?);
    heightOf(index: number): number;
    exceptionHeightOf(index: number, returnDefault?: boolean): number | null;
    padding(index: number): number;
    private fillCacheTillKey(target);
    positions(first: number, last: number, offset: number, callback?: (index: number, key: string, pos: number) => void): void;
}
