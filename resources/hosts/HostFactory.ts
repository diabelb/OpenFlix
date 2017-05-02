/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {Host} from "./Host";
import {SyncRequestUtil} from "../utils/SyncRequestUtil";
import {OpenLoad} from "./providers/OpenLoad";


export class HostFactory {
    private requestUtil;

    public static readonly PROVIDERS = [
        [/http[s]*:\/\/openload.co[^']+/, OpenLoad]
    ];
    constructor(requestUtil?: SyncRequestUtil) {
        if (requestUtil) {
            this.requestUtil = requestUtil;
        }
        else {
            this.requestUtil = new SyncRequestUtil();
        }
    }

    public getHost(url: string): Host {
        for (let provider of HostFactory.PROVIDERS) {
            let result = url.match(<RegExp>provider[0]);
            if (result) {
                let hostProvider = new (<any>provider[1])(this.requestUtil);
                hostProvider.setUrl(url);
                return hostProvider;
            }
        }

    }
}