import {Host} from "../Host";
import * as cheerio from "cheerio";
/**
 * Created by Dawid on 02.05.2017.
 */

export class VShare extends Host{
    static URL_REG_EXP = /http[s]*:\/\/vshare.io[^'"]+/;
    private htmlContent: string;

    public setUrl(url: string) {
        this.htmlContent = null;
        this.url = url;
    }

    public getUrl():string {
        return this.url;
    }

    public getMediaLink(): string {
        let htmlContent = this.getHtml();
        let $ = cheerio.load(htmlContent);
        let url = $("#my-video").find("source").first().attr("src");
        if (url) {
            return url;
        }
        else {
            return ""
        }
    }

    public getHtml(): string {
        let result = this.requestUtil.request("GET", this.url, {});
        return result.body.toString("UTF-8");
    }
}