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
            let eKino = new EKinoTv(requestMock);
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
            let eKino = new EKinoTv(requestMock);
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
            let eKino = new EKinoTv(requestMock);
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
            let eKino = new EKinoTv(requestMock);
            let hostLinks = eKino.getMovieHostLinks(mockedSingleMovieData);
            assert.equal(hostLinks[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });

    describe('getMovieImg()', () => {
        it('Finds movie host links for given movie url', () => {
            let eKino = new EKinoTv(requestMock);
            let movieImg = eKino.getMovieImg(mockedSingleMovieData);
            assert.equal(movieImg, 'http://ekino-tv.pl/static/normal/vjhep6r78emr.jpg');
        });
    });

    describe('getMoviesWithHostLinks()', () => {
        let hostLinks = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock);
            eKino.setQuery("Hary Potter");
            eKino.getMoviesWithHostLinks(links => {
                hostLinks = links;
                if (links.left == 0) {
                    done();
                }
            });
        });
        it('Finds moviee with host host links', () => {
            assert.equal(hostLinks.url[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });



    describe('getMovieData()', () => {
        let mData = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock);
            eKino.setQuery("grgrdgrd");
            eKino.getMovieData(moviesData => {
                mData = moviesData;
                if (mData.left == 0) {
                    done();
                }
            });
        });
        it('Finds movies data for given query', () => {
            assert.equal(mData.url, 'https://openload.co/stream/T71J_v66AD4~1493747158~89.76.0.0~qpQ-wz8l');
            assert.equal(mData.imgUrl, 'http://ekino-tv.pl/static/normal/vjhep6r78emr.jpg');
        });
    });

    describe('getAllMoviesData()', () => {
        let mData = null;
        beforeEach(done => {
            let eKino = new EKinoTv(requestMock);
            eKino.setQuery("grgrdgrd");
            eKino.getAllMoviesData(moviesData => {
                mData = moviesData;
                done();
            });
        });
        it('Finds all movies data for given query', () => {
            assert.equal(mData[0].url, 'https://openload.co/stream/T71J_v66AD4~1493747158~89.76.0.0~qpQ-wz8l');
            assert.equal(mData[0].imgUrl, 'http://ekino-tv.pl/static/normal/vjhep6r78emr.jpg');
        });
    });
});

let mockedOpenloadData = fs.readFileSync(__dirname+"/mockedOpenLoadRequest", "UTF-8");
let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let requestMock = {
    request: (options, callback) => {
        if (options.method == "POST" &&
            options.body != "" && options.body != "search_field="
            && options.headers['Content-Type'] == "application/x-www-form-urlencoded") {
            callback("", "", requestMock.responseSearch.body);
        }
        else if (options.method == "GET" && options.url.match("openload")) {
            callback("", "", requestMock.responseOpenLoad.body);
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
    responseOpenLoad: {
        body: {
            toString: () => {
                return mockedOpenloadData;
            }
        }
    },
};