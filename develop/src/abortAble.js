export var ABORTED = Symbol('aborted');
export default function abortAble(loader) {
    return {
        then: function (onfulfilled) {
            var aborted = null;
            var isAborted = function () { return aborted === null; };
            var aborter = new Promise(function (resolve) { return aborted = resolve; });
            var fullfiller = loader.then(function (r) {
                if (isAborted()) {
                    return ABORTED;
                }
                return Promise.resolve(onfulfilled(r)).then(function (r) { return isAborted() ? ABORTED : r; });
            });
            var p = Promise.race([aborter, fullfiller]);
            return _a = {
                    abort: function () {
                        if (aborted !== null) {
                            aborted(ABORTED);
                            aborted = null;
                        }
                    },
                    then: p.then.bind(p),
                    catch: p.catch.bind(p)
                },
                _a[Symbol.toStringTag] = p[Symbol.toStringTag],
                _a;
            var _a;
        }
    };
}
export function isAbortAble(abortAble) {
    return abortAble !== undefined && abortAble !== null && abortAble && typeof abortAble.then === 'function' && typeof abortAble.abort === 'function';
}
//# sourceMappingURL=abortAble.js.map