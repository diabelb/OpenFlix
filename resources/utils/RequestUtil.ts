/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as request from "request";

export class RequestUtil {
    //noinspection JSMethodCanBeStatic
    public request(options: any, callback: (error, response, body) => void) {
        request(options, callback);
    }
}