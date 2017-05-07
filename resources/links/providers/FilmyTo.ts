import {Provider} from "../Provider";
import {SyncRequestUtil} from "../../utils/SyncRequestUtil";
import * as cheerio from "cheerio";
import {Cookie} from 'request-cookies';
import {HostFactory} from "../../hosts/HostFactory";

/**
 * Created by Dawid on 03.05.2017.
 */

export class FilmyTo extends Provider {
    private query: string;

    constructor(requestUtil: SyncRequestUtil) {
        super(requestUtil);
        this.query = "";
    }

    public getQuery(): string {
        return this.query;
    }

    public setQuery(query: string) {
        this.query = query;
    }

    getMoviesWithProviderLinks() {
        let moviesList = this.getMoviesListArray();

        let result = [];
        for (let movie of moviesList) {
            let movieHtml = this.getMovieHtml("http://filmy.to"+movie.url);
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

    public getSearchHtml(): string {
        let res =  this.requestUtil.request('GET', 'http://filmy.to/szukaj?q='+this.getQuery(), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
            }
        });
        return res.body.toString();
    }

    public getMoviesListArray() {
        let htmlCode = this.getSearchHtml();
        let $ = cheerio.load(htmlCode);

        let moviesList = [];
        $(".movie.clearfix").each((i, item) => {
            let title = $(item).find(".title-pl").text();
            let url = $(item).find(".pull-left.description a").attr("href");
            moviesList[i] = {
                title: title,
                url: url
            };
        });
        return moviesList;
    }

    public getMovieHtml(url: string) {
        let res =  this.requestUtil.request('GET', url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
            }
        });
        return this.getMovieAjaxData(res);
    }

    private getMovieAjaxData(result) {
        let provision = this.getProvision(result);
        let csrfToken = this.getCrsfToken(result);
        let res =  this.requestUtil.request('GET', "http://filmy.to/ajax/provision/"+provision, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": csrfToken,
            }
        });

        return res.body.toString();
    }

    private getCrsfToken(result) {
        let rawCookies = result.headers['set-cookie'];
        let csrfToken = "";
        for (let c of rawCookies) {
            let foundCookie = new Cookie(c);
            if (foundCookie.key = 'csrftoken') {
                csrfToken = foundCookie.value;
            }
        }
        return csrfToken;
    }

    private getProvision(result): string {
        let movieHtml = result.body.toString();
        let $ = cheerio.load(movieHtml);
        return $("meta[property='provision']").attr("content");
    }


    public getMovieProviderLinks(movieHtml: string) {
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
}