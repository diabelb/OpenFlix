/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import {RequestUtil} from "../utils/RequestUtil";

export abstract class Host {

    protected requestUtil: RequestUtil;
    protected url: string;
    static URL_REG_EXP;

    constructor(requestUtil: RequestUtil) {
        this.url = "";
        this.requestUtil = requestUtil;
    }

    /**
     * Returns downloadable url to video resource
     * @return {string}
     */
    abstract getMediaLink(callback: (decodedUrl)=>any): void;

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