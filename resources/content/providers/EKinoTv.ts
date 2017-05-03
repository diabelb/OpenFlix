/**
 * Created by Dawid on 02.05.2017.
 */

import {SyncRequestUtil} from "../../utils/SyncRequestUtil";
import * as cheerio from "cheerio";
import {HostFactory} from "../../hosts/HostFactory";
import {Provider} from "../Provider";

export class EKinoTv extends Provider {
    private query: string;

    constructor(requestUtil: SyncRequestUtil) {
        super(requestUtil);
        this.query = "";
    }

    public getSearchHtml() {
        let  data = "search_field="+this.getQuery();
        let res =  this.requestUtil.request('POST', 'http://ekino-tv.pl/search', {
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return res.body.toString();
    }

    public getQuery(): string {
        return this.query;
    }

    public setQuery(query: string) {
        this.query = query;
    }

    public getMoviesListItem() {
        let htmlCode = this.getSearchHtml();
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
        return moviesList;
    }

    getMovieProviderLinks(movieHtml: string) {
        let links = [];
        for (let item of HostFactory.PROVIDERS) {
            let providerRegExp = item[0];
            let result = movieHtml.match(<RegExp>providerRegExp);
            if (result) {
                let foundLink = result[0];
                links.push(foundLink);
            }
        }
        return links;
    }

    public getMovieHtml(url: string) {
        let res =  this.requestUtil.request('GET', url, {});
        return res.body.toString();
    }

    getMoviesWithProviderLinks() {
        let moviesList = this.getMoviesListItem();

        let result = [];
        for (let movie of moviesList) {
            let movieHtml = this.getMovieHtml("http://ekino-tv.pl"+movie.url);
            let movieProviderLinks = this.getMovieProviderLinks(movieHtml);
            if (movieProviderLinks[0]) {

                result.push({
                    title:  movie.title,
                    providerLinks: movieProviderLinks
                });
            }
        }
        return result;
    }
}