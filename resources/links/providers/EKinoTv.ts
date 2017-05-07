import {RequestUtil} from "../../utils/RequestUtil";
import * as cheerio from "cheerio";
import {HostFactory} from "../../hosts/HostFactory";
import {FilmWeb} from "../../content/FilmWeb";
import {OpenLoadAsync} from "../../hosts/providers/OpenLoadAsync";

/**
 * Created by dawid on 04.05.17.
 */

export class EKinoTv {
    private query: string;
    protected requestUtil: RequestUtil;
    protected contentProvider: FilmWeb;

    constructor(requestUtil, contentProvider: FilmWeb) {
        this.requestUtil = requestUtil;
        this.contentProvider = contentProvider;
    }

    public setQuery(query: string) {
        this.query = query;
    }

    public getQuery() {
        return this.query;
    }

    public getSearchHtml(callback: (data: string) => void) {
        let query = "search_field=" + this.query;
        this.requestUtil.request({
            method: 'POST',
            url: 'http://ekino-tv.pl/search',
            body: query,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
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

    public getMoviesListArray(callback: (data) => any) {
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

    public getMovieHtml(url: string, callback: (movieHtml) => any) {
        this.requestUtil.request({
            method: 'GET',
            url: url,
        }, (error, response, body) => {
            if (error) {
                console.log("Połączenie z adresem " + url + " nie powiodło się. Problem z połączeniem.")
                callback("");
            }
            else {
                callback(body.toString());
            }
        });
    }

    public getMovieHostLinks(movieHtml: string) {
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

    public getMoviesWithHostLinks(callback: (links) => any) {
        this.getMoviesListArray(moviesList => {
            this.processMoviesList(moviesList, callback);
        });
    }

    private processMoviesList(moviesList, callback) {
        let total = moviesList.length;
        let left = moviesList.length;
        if (moviesList.length == 0) {
            this.processMovie("", "", 0, 0, callback);
        }
        for (let movie of moviesList) {
            this.getMovieHtml("http://ekino-tv.pl" + movie.url, movieHtml => {
                this.processMovie(movieHtml, movie.title, total, --left, callback);
            });
        }
    }

    private processMovie(movieHtml, title, total, left, callback) {
        let movieHostLinks = this.getMovieHostLinks(movieHtml);
        callback({
            title: title,
            url: movieHostLinks,
            total: total,
            left: left
        });
    }

    public getMoviesData(callback: (moviesData) => any) {
        this.getMoviesWithHostLinks(links => {
            let jobs = 2;
            let data = {
                title: null,
                imgUrl: null,
                url: links.url,
                total: links.total,
                left: links.left,
            };
            this.contentProvider.setQuery(this.clearTitle(links.title));
            this.contentProvider.getMovieData(movieData => {
                data.title = movieData.title;
                data.imgUrl = movieData.imgUrl;
                if (--jobs == 0) {
                    callback(data);
                }
            });

            let openLoadProvider = new OpenLoadAsync(new RequestUtil());
            openLoadProvider.setUrl(links.url[0]);
            openLoadProvider.getMediaLink(decodedUrl => {
                data.url = decodedUrl;
                if (--jobs == 0) {
                    callback(data);
                }
            });
        });
    }

    public clearTitle(title: string): string {
        console.log("before: "+ title);
        title = title.replace(/\(.+\)/g, '');
        title = title.replace(/CAM/g, '');
        title = title.replace(/LEKTOR/g, '');
        title = title.replace(/HD/g, '');
        title = title.replace(/ - /g, '');
        title = title.replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}\[\]\\\/]/gi, '');

        title.trim();
        console.log("after: "+ title);
        return title;
    }
}