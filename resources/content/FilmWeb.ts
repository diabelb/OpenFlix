import {RequestUtil} from "../utils/RequestUtil";
import * as cheerio from "cheerio";

/**
 * Created by Dawid on 06.05.2017.
 */

export class FilmWeb {
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

    public getSearchHtml(callback: (data: string) => void) {
        let url = 'http://www.filmweb.pl/search?q='+encodeURIComponent(this.getQuery());
        this.requestUtil.request({
            method: 'GET',
            url: url,
        }, (error, response, body) => {
            if (error) {
                console.log("Wyszukiwanie na Ekino.pl nie powiodło się. Problem z połączeniem.")
                callback("");
            }
            else {
                callback(body.toString());
            }
        });
    }

    public getTitle(searchData: string) {
        let $ = cheerio.load(searchData);
        let title = $('a.hdr.hdr-medium.hitTitle').first().text();
        return title.trim();
    }

    public getImgUrl(searchData: string) {
        let $ = cheerio.load(searchData);
        let imgUrl = $('a.fImg125 > img').first().attr('src');
        if (imgUrl) {
            return imgUrl.replace("2.jpg", "6.jpg");
        }
        else {
            return "";
        }
    }

    public getMovieData(callback: (movieData: any) => any) {
        this.getSearchHtml(searchHtml => {
            let mData = {
                imgUrl: this.getImgUrl(searchHtml),
                title: this.getTitle(searchHtml)
            };
            callback(mData);
        });
    }
}