/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {SyncRequestUtil} from "../utils/SyncRequestUtil";

export abstract class Provider {

    protected requestUtil: SyncRequestUtil;

    constructor(requestUtil) {
        this.requestUtil = requestUtil;
    }

    abstract getMoviesWithProviderLinks();

    abstract setQuery(query: string);
}