/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {EKinoTvAsync} from "../../../../../resources/content/providers/EKinoTv";

describe('Content/Providers/EKinoTv', function () {
    describe('getSearchHtml()', () => {
        it('should run callback after getting search Html', () => {
            let eKino = new EKinoTvAsync(requestMock);
            eKino.setQuery("aaa");
            beforeEach(done => {
                eKino.getSearchHtml(data => {
                    assert.equal(data, mockedSearchData);
                    done();
                });
            });
        });
    });

    describe('getMoviesListArray()', () => {
        let movies = null;
        beforeEach(done => {
            let eKino = new EKinoTvAsync(requestMock);
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
            let eKino = new EKinoTvAsync(requestMock);
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
            let eKino = new EKinoTvAsync(requestMock);
            let hostLinks = eKino.getMovieHostLinks(mockedSingleMovieData);
            assert.equal(hostLinks[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });

    describe('getMoviesWithHostLinks()', () => {
        let hostLinks = null;
        beforeEach(done => {
            let eKino = new EKinoTvAsync(requestMock);
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
});

let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let requestMock = {
    request: (options, callback) => {
        if (options.method == "POST" &&
            options.body != "" && options.body != "search_field="
            && options.headers['Content-Type'] == "application/x-www-form-urlencoded") {
            callback("", "", requestMock.responseSearch.body);
        }
        if (options.method == "GET") {
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
    }
};