import {RequestUtil} from "../../utils/RequestUtil";
import * as cheerio from "cheerio";
import {HostFactory} from "../../hosts/HostFactory";

/**
 * Created by dawid on 04.05.17.
 */

export class EKinoTv {
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
        let movieImg = this.getMovieImg(movieHtml);
        callback({
            title: title,
            url: movieHostLinks,
            imgUrl: movieImg,
            total: total,
            left: left
        });
    }

    public getMovieData(callback: (moviesData) => any) {
        this.getMoviesWithHostLinks(links => {
            let hostFactory = new HostFactory(this.requestUtil);
            let host = hostFactory.getHost(links.url[0]);
            if (host != null) {
                host.getMediaLink(decodedUrl => {
                    links.url = decodedUrl;
                    callback(links);
                });
            }
            else {
                callback(links);
            }
        });
    }



    public getMovieImg(movieHtml: string) {
        let img = "";
        let result = movieHtml.match(/\/static\/normal\/.+jpg/);
        if (result) {
            img = result[0];
        }
        return "http://ekino-tv.pl"+img;
    }

    getAllMoviesData(callback: (moviesData)=>any) {
        let total = null;
        let data = [];
        
        this.getMovieData(moviesData => {
            if (total == null) {
                total = moviesData.total;
            }
            if (total > 0) {
                if (moviesData.url == "" || moviesData.imgUrl == "") {
                    total--;
                }
                else {
                    data.push(moviesData);
                }
            }

            if (data.length == total) {
                callback(data);
            }
        });

    }
}