/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {FilmyTo} from "../../../../resources/links/providers/FilmyTo";

describe('links/Providers/FilmyTo', function () {
    describe('setQuery(), getQuery()', () => {
        it('should save provided movie query', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            assert.equal(filmyToProvider.getQuery(), "");

            filmyToProvider.setQuery("Hary aaaa");
            assert.equal(filmyToProvider.getQuery(), "Hary aaaa");
        });
    });

    describe('getSearchHtml()', function () {
        it('should return html of search movie', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            filmyToProvider.setQuery("Hary Potter");
            assert.equal(filmyToProvider.getSearchHtml(), mockedSearchData);
        });
    });

    describe('getMoviesListArray()', () => {
        it('Filter all movies-list-item from html', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            filmyToProvider.setQuery("Hary Potter");
            let moviesList = filmyToProvider.getMoviesListArray();
            assert.equal(moviesList.length, 9);
        })
    });

    describe('getMovieHtml()', function () {
        it('should return html of selected movie url', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            let movieHtml = filmyToProvider.getMovieHtml("http://filmy.to/film/Harry_Potter_i_Ksiaze_Polkrwi-2009,531");
            assert.equal(movieHtml, mockedProvision);
        });
    });

    describe('getMovieProviderLinks()', () => {
        it('Finds movie provider links for given movie url', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            let providerLinks = filmyToProvider.getMovieProviderLinks(mockedProvision);
            assert.equal(providerLinks[0], 'https://openload.co/embed/VYhMEpj9do0');
        });
    });

    describe('getMoviesWithProviderLinks()', () => {
        it('Finds movies with host provider links', () => {
            let filmyToProvider = new FilmyTo(requestMock);
            filmyToProvider.setQuery("Hary Potter");
            let providerLinks = filmyToProvider.getMoviesWithProviderLinks();
            assert.equal(providerLinks[0].providerLinks[0], 'https://openload.co/embed/VYhMEpj9do0');
        });
    });
});

let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let mockedProvision = fs.readFileSync(__dirname + "/mockedProvisionRequest", "UTF-8");

let requestMock = {
    request: (method, url, options) => {
        if (method == "GET" && url.match("szukaj")) {
            return requestMock.responseSearch;
        }
        if (method == "GET" && url.match("/film/")) {
            return requestMock.responseSingleMovie;
        }
        if (method == "GET" && url.match("/provision")
            && options.headers["X-CSRFToken"] == "hbeVkLKvYtnBHFxhORpcd8CbN5WJlw4SGRWmdRGgRuJUQqvG8qWSZckULL3xAel5"
            && options.headers["X-Requested-With"] == "XMLHttpRequest") {
            return requestMock.responseProvision;
        }
        else {
            return "";
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
        },
        headers: {
            "X-Frame-Options": "SAMEORIGIN",
            "set-cookie": [ '__cfduid=d65b568f09ae899c72e35ffd385160aed1493807931; expires=Thu, 03-May-18 10:38:51 GMT; path=/; domain=.filmy.to; HttpOnly',
                'sessionid=90vg7g1ft3i4dwho8661ai03blresqjt; expires=Wed, 17-May-2017 10:38:51 GMT; HttpOnly; Max-Age=1209600; Path=/',
                'csrftoken=hbeVkLKvYtnBHFxhORpcd8CbN5WJlw4SGRWmdRGgRuJUQqvG8qWSZckULL3xAel5; expires=Wed, 02-May-2018 10:38:51 GMT; Max-Age=31449600; Path=/' ]
        }
    },
    responseProvision: {
        body: {
            toString: () => {
                return mockedProvision;
            }
        },
        headers: {
            "X-Frame-Options": "SAMEORIGIN",
            "set-cookie": [ '__cfduid=d65b568f09ae899c72e35ffd385160aed1493807931; expires=Thu, 03-May-18 10:38:51 GMT; path=/; domain=.filmy.to; HttpOnly',
                'sessionid=90vg7g1ft3i4dwho8661ai03blresqjt; expires=Wed, 17-May-2017 10:38:51 GMT; HttpOnly; Max-Age=1209600; Path=/',
                'csrftoken=hbeVkLKvYtnBHFxhORpcd8CbN5WJlw4SGRWmdRGgRuJUQqvG8qWSZckULL3xAel5; expires=Wed, 02-May-2018 10:38:51 GMT; Max-Age=31449600; Path=/' ]
        }
    }
};