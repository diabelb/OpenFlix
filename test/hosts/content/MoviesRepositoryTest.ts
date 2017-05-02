/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import {MoviesRepository} from "../../../resources/content/MoviesRepository";
import * as fs from "fs";

describe('Content/MoviesRepository', function () {
    describe('search()', () => {
        it('should return list of searched movies', () => {
            let moviesRepository = new MoviesRepository(requestMock);
            let moviesList = moviesRepository.search("harry");
            assert.equal(moviesList[0].providerLinks[0], "https://openload.co/embed/iKqXWRAn_uI");
        });
    });
});

let mockedSearchData = fs.readFileSync(__dirname + "/providers/mockedSearchRequest", "UTF-8");
let mockedSingleMovieData = fs.readFileSync(__dirname + "/providers/mockedSingleMovieRequest", "UTF-8");
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
    },
};