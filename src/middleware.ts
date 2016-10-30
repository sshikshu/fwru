import { Context } from './context';

export type Middleware = (context: Context, next?: Middleware) => Promise<never>;

// rip off of koa compose
export function compose(middleware: Array<Middleware>) {
    return function (context: Context, next?: Middleware) {
        let index = -1;
        return dispatch(0);

        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(context, function next() {
                    return dispatch(i + 1);
                }));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
