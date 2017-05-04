/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import * as fs from "fs";
import {EKinoTvAsync} from "../../../../../resources/content/providers/EKinoTvAsync";

describe('Content/Providers/EKinoTvAsync', function () {
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

    describe('getMoviesListItem()', () => {
        it('should run callback after getting getMoviesListItem', () => {
            let eKino = new EKinoTvAsync(requestMock);
            eKino.setQuery("aaa");
            beforeEach(done => {
                eKino.getMoviesListItem(moviesList => {
                    assert.equal(moviesList.length, 12);
                    done();
                });
            });
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
            callback("","",requestMock.responseSearch.body);
        }
        if (options.method == "GET") {
            callback(requestMock.responseSingleMovie);
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