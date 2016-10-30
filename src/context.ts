import { IncomingMessage, ServerResponse } from 'http';

export class Context {
    body: Object;
    headers = [];
    status = 200;
    user: any;

    constructor(public request: IncomingMessage, public response: ServerResponse) { }
};
