/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {EKinoTv} from "../../../../resources/links/providers/EKinoTv";
import {FilmWeb} from "../../../../resources/content/FilmWeb";

describe('links/Providers/EKinoTv', function () {
    describe('getSearchHtml()', () => {
        let html = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock, null);
            eKino.setQuery("aaa");
            eKino.getSearchHtml(data => {
                html = data;
                done();
            });
        });
        it('should run callback after getting search Html', () => {
            assert.equal(html, mockedSearchData);
        });
    });

    describe('getMoviesListArray()', () => {
        let movies = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock, null);
            eKino.setQuery("aaa");
            eKino.getMoviesListArray(moviesList => {
                movies = moviesList;
                done();
            });
        });

        it('should run callback after getting getMoviesListArray', () => {
            assert.equal(movies.length, 12);

        });
    });

    describe('getMovieHtml()', () => {
        let html = "";
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock, null);
            eKino.getMovieHtml("http://url", (movieHtml) => {
                html = movieHtml;
                done();
            });
        });

        it('should return html of selected movie url', () => {
            assert.equal(html, mockedSingleMovieData);
        });
    });

    describe('getMovieHostLinks()', () => {
        it('Finds movie host links for given movie url', () => {
            let eKino = new EKinoTv(requestMock, null);
            let hostLinks = eKino.getMovieHostLinks(mockedSingleMovieData);
            assert.equal(hostLinks[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });

    describe('getMoviesWithHostLinks()', () => {
        let hostLinks = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock, null);
            eKino.setQuery("Hary Potter");
            eKino.getMoviesWithHostLinks(links => {
                hostLinks = links;
                if (links.left == 0) {
                    done();
                }
            });
        });
        it('Finds movies with host host links', () => {
            assert.equal(hostLinks.url[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });

    describe('getMoviesData()', () => {
        let mData = null;
        beforeEach(done => {
            let filmWebMock = new FilmWeb(requestMock);
            let eKino = new EKinoTv(requestMock, filmWebMock);
            eKino.setQuery("Hary Potter");
            eKino.getMoviesData(moviesData => {
                mData = moviesData;
                if (mData.left == 0) {
                    done();
                }
            });
        });
        it('Finds movies data for given query', () => {
            assert.equal(mData.url, 'https://openload.co/embed/iKqXWRAn_uI');
            assert.equal(mData.title, 'Harry Potter i Kamień Filozoficzny');
            assert.equal(mData.imgUrl, 'http://1.fwcdn.pl/po/05/71/30571/7529392.6.jpg');
        });
    });
});

let mockedFilmWebSearchData = fs.readFileSync(__dirname + "/../../../content/mockedSearchRequest", "UTF-8");
let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let requestMock = {
    request: (options, callback) => {
        if (options.method == "GET" && options.url.match("search")) {
            callback("", "", requestMock.responseFilmWebSearch.body);
        }
        else if (options.method == "POST" &&
            options.body != "" && options.body != "search_field="
            && options.headers['Content-Type'] == "application/x-www-form-urlencoded") {
            callback("", "", requestMock.responseSearch.body);
        }
        else if (options.method == "GET") {
            callback("", "", requestMock.responseSingleMovie.body);
        }
        else {
            return callback("");
        }
    },
    responseSearch: {
        body: {
            toString: () => {
                return mockedSearchData;
            }
        }
    },
    responseSingleMovie: {
        body: {
            toString: () => {
                return mockedSingleMovieData;
            }
        }
    },
    responseFilmWebSearch: {
        body: {
            toString: () => {
                return mockedFilmWebSearchData;
            }
        }
    },
};