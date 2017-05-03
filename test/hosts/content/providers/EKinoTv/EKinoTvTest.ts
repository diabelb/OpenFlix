/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {EKinoTv} from "../../../../../resources/content/providers/EKinoTv";

describe('Content/Providers/EKinoTv', function () {
    describe('setQuery(), getQuery()', () => {
        it('should save provided movie query', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            assert.equal(eKinoTvProvider.getQuery(), "");

            eKinoTvProvider.setQuery("Hary aaaa");
            assert.equal(eKinoTvProvider.getQuery(), "Hary aaaa");
        });
    });

    describe('getSearchHtml()', function () {
        it('should return html of search movie', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            eKinoTvProvider.setQuery("Hary Potter");
            assert.equal(eKinoTvProvider.getSearchHtml(), mockedSearchData);
        });
    });

    describe('getMoviesListItem()', () => {
        it('Filter all movies-list-item from html', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            eKinoTvProvider.setQuery("Hary Potter");
            let moviesList = eKinoTvProvider.getMoviesListItem();
            assert.equal(moviesList.length, 12);
        })
    });

    describe('getMovieHtml()', function () {
        it('should return html of selected movie url', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            let movieHtml = eKinoTvProvider.getMovieHtml("http://url");
            assert.equal(movieHtml, mockedSingleMovieData);
        });
    });

    describe('getMovieProviderLinks()', () => {
        it('Finds movie provider links for given movie url', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            let providerLinks = eKinoTvProvider.getMovieProviderLinks(mockedSingleMovieData);
            assert.equal(providerLinks[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });

    describe('getMoviesWithProviderLinks()', () => {
        it('Finds movies with host provider links', () => {
            let eKinoTvProvider = new EKinoTv(requestMock);
            eKinoTvProvider.setQuery("Hary Potter");
            let providerLinks = eKinoTvProvider.getMoviesWithProviderLinks();
            assert.equal(providerLinks[0].providerLinks[0], 'https://openload.co/embed/iKqXWRAn_uI');
        });
    });
});

let mockedSearchData = fs.readFileSync(__dirname + "/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/mockedSingleMovieRequest", "UTF-8");
let requestMock = {
    request: (method, url, options) => {
        if (method == "POST" &&
            options.body != "" && options.body != "search_field="
            && options.headers['Content-Type'] == "application/x-www-form-urlencoded") {
            return requestMock.responseSearch;
        }
        if (method == "GET") {
            return requestMock.responseSingleMovie;
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
        }
    }
};