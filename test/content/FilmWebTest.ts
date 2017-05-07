/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {FilmWeb} from "../../resources/content/FilmWeb";

describe('content/FilmWeb', function () {
    describe('getSearchHtml()', () => {
        let html = null;
        beforeEach(done => {
            let filmWeb = new FilmWeb(requestMock);
            filmWeb.setQuery("aaaa");
            filmWeb.getSearchHtml(data => {
                html = data;
                done();
            });
        });
        it('should run callback after getting search Html', () => {
            assert.equal(html, mockedSearchData);
        });
    });

    describe('getTitle()', () => {
        it('should return first found title of searched movie from FilmWeb', () => {
            let filmWeb = new FilmWeb(requestMock);
            let title = filmWeb.getTitle(mockedSearchData);
            assert.equal(title, 'Harry Potter i Kamień Filozoficzny');

        });
    });

    describe('getImgUrl()', () => {
        it('should return first found img url of searched movie from FilmWeb', () => {
            let filmWeb = new FilmWeb(requestMock);
            let imgUrl = filmWeb.getImgUrl(mockedSearchData);
            assert.equal(imgUrl, 'http://1.fwcdn.pl/po/05/71/30571/7529392.6.jpg');

        });
    });

    describe('getMovieData()', () => {

        let mData = null;
        beforeEach(done => {
            let filmWeb = new FilmWeb(requestMock);
            filmWeb.setQuery("aaaa");
            filmWeb.getMovieData(movieData => {
                mData = movieData;
                done();
            })
        });

        it('should run callback after getting movie data', () => {
            assert.equal(mData.imgUrl, 'http://1.fwcdn.pl/po/05/71/30571/7529392.6.jpg');
            assert.equal(mData.title, 'Harry Potter i Kamień Filozoficzny');
        });
    });
});

let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
//let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let requestMock = {
    request: (options, callback) => {
        if (options.method == "GET" && options.url.match("search")) {
            callback("", "", requestMock.responseSearch.body);
        }
/*        if (options.method == "GET") {
            callback("", "", requestMock.responseSingleMovie.body);
        }*/
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
/*    responseSingleMovie: {
        body: {
            toString: () => {
                return mockedSingleMovieData;
            }
        }
    }*/
};