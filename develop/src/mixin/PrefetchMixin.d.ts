import { EScrollResult, IMixin, IMixinAdapter } from './IMixin';
export interface IPrefetchRendererOptions {
    readonly prefetchRows: number;
    readonly cleanUpRows: number;
    readonly delay: number;
}
export default class PrefetchMixin implements IMixin {
    private readonly adapter;
    private prefetchTimeout;
    private cleanupTimeout;
    private readonly options;
    constructor(adapter: IMixinAdapter, options?: Partial<IPrefetchRendererOptions>);
    private prefetchDown();
    private prefetchUp();
    private triggerPrefetch(isGoingDown);
    private cleanUpTop(first);
    private cleanUpBottom(last);
    private triggerCleanUp(first, last, isGoingDown);
    onScrolled(isGoingDown: boolean, scrollResult: EScrollResult): void;
}
