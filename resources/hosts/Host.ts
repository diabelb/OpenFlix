/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {SyncRequestUtil} from "../utils/SyncRequestUtil";

export abstract class Host {

    protected requestUtil: SyncRequestUtil;
    protected url: string;
    static URL_REG_EXP;

    constructor(requestUtil: SyncRequestUtil) {
        this.url = "";
        this.requestUtil = requestUtil;
    }

    /**
     * Returns downloadable url to video resource
     * @return {string}
     */
    abstract getMediaLink(): string;

    /**
     * Sets url to page with video
     * @param url
     */
    abstract setUrl(url: string);

    /**
     * Return sets url
     */
    abstract getUrl():string;
}