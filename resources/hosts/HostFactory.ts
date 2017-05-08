/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {Host} from "./Host";
import {RequestUtil} from "../utils/RequestUtil";
import {OpenLoad} from "./providers/OpenLoad";


export class HostFactory {
    private requestUtil;

    public static readonly PROVIDERS = [
        [OpenLoad.URL_REG_EXP, OpenLoad],
    ];
    constructor(requestUtil?: RequestUtil) {
        if (requestUtil) {
            this.requestUtil = requestUtil;
        }
        else {
            this.requestUtil = new RequestUtil();
        }
    }

    public getHost(url: string): Host {
        if (!url) {
            return null;
        }

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