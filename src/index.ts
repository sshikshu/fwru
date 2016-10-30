import { IncomingMessage, ServerResponse, createServer } from 'http';

import { Context } from './context';
import { Middleware, compose } from './middleware';
import * as status from './status';

export class Application {
    env: string = process.env.NODE_ENV || 'development';
    middlewares: Array<Middleware> = [];

    listen(port: number) {
        const server = createServer((request: IncomingMessage, response: ServerResponse) => {
            let context = new Context(request, response);
            compose(this.middlewares)(context).then(() => {
                respond(context);
            }).catch(error => {
                context.status = status.INTERNAL_SERVER_ERROR;
                context.body = { error };
                respond(context);
            });
        });
        return server.listen(port);
    }

    use(fn: Middleware) {
        this.middlewares.push(fn);
        return this;
    }
}

function respond(context: Context) {
    context.response.statusCode = context.status || status.NOT_FOUND;
    context.response.setHeader('Content-Type', 'application/json');
    for (let i = 0; i < context.headers.length; i += 1) {
        context.response.setHeader(context.headers[i][0], context[i].headers[1]);
    }
    context.response.end(JSON.stringify(context.body || { error: 'todo' }));
}
