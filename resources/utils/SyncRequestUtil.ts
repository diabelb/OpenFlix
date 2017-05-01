/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as request from "sync-request";

export class SyncRequestUtil {
    //noinspection JSMethodCanBeStatic
    public request(method: string, url: string, options: object) {
        return request(method, url, options);
    }
}