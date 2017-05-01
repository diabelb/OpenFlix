/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {Host} from "./Host";
import {SyncRequestUtil} from "../utils/SyncRequestUtil";
import {OpenLoad} from "./providers/OpenLoad";


export class HostFactory {
    private static readonly PROVIDERS = [
        [/http[s]*:\/\/openload.co.+/, OpenLoad]
    ];
    constructor() {

    }

    public static getHost(url: string): Host {
        for (let provider of HostFactory.PROVIDERS) {
            let result = url.match(<RegExp>provider[0]);
            if (result) {
                let hostProvider = new (<any>provider[1])(new SyncRequestUtil());
                hostProvider.setUrl(url);
                return hostProvider;
            }
        }

    }
}