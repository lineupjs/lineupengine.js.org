import { IExceptionContext } from '../logic';
export interface ICellContext {
    row: IExceptionContext;
    col: IExceptionContext;
}
export declare abstract class ACellRenderer {
    private readonly root;
    private readonly poolLeaves;
    private readonly poolInner;
    constructor(root: HTMLElement);
    protected readonly abstract context: ICellContext;
    private readonly doc;
    private readonly body;
    private readonly colHeader;
    private readonly rowHeader;
    protected abstract createCell(doc: Document, row: number, col: number): HTMLElement;
    protected abstract updateCell(node: HTMLElement, row: number, col: number): HTMLElement | void;
    protected abstract createRowHeader(doc: Document, row: number): HTMLElement;
    protected abstract updateRowHeader(node: HTMLElement, row: number): HTMLElement | void;
    protected abstract createColumnHeader(doc: Document, col: number): HTMLElement;
    protected abstract updateColumnHeader(node: HTMLElement, col: number): HTMLElement | void;
    protected init(): void;
    private static sliceHeight(ctx, start, end);
    private buildTree(row, col);
    protected recreate(): void;
    private onScroll(left, top, width, height, _isGoingDown, _isGoingRight);
    private renderLeaf(leaf, parent);
    private render(node, parent, rowFirst, rowLast, colFirst, colLast);
    private recycle(node);
    private static cleanUp(node);
    private recycleLeaf(node);
    protected clearPool(): void;
}
export default ACellRenderer;
