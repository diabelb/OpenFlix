import {RequestUtil} from "../../utils/RequestUtil";
import * as cheerio from "cheerio";

/**
 * Created by dawid on 04.05.17.
 */

export class EKinoTvAsync {
    private query: string;

    protected requestUtil: RequestUtil;

    constructor(requestUtil) {
        this.requestUtil = requestUtil;
    }

    public setQuery(query: string) {
        this.query = query;
    }

    public getQuery() {
        return this.query;
    }

    getSearchHtml(callback: (data: string) => void) {
        let query = "search_field="+this.query;
        this.requestUtil.request({
            method: 'POST',
            url: 'http://ekino-tv.pl/search',
            body: query,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }

        }, (error, response, body) => {
            callback(body.toString());
        });

    }

    public getMoviesListItem(callback: (data) => any) {
        this.getSearchHtml(htmlCode => {
            let $ = cheerio.load(htmlCode);

            let moviesList = [];
            $(".movies-list-item").each((i, item) => {
                let title = $(item).find(".title a").first().text();
                let url = $(item).find("a.blue").attr("href");
                moviesList[i] = {
                    title: title,
                    url: url
                };
            });
            callback(moviesList);
        });
    }
}