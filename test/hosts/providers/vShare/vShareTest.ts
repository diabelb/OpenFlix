/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import {VShare} from "../../../../resources/hosts/providers/VShare";
import * as fs from "fs";

describe('Hosts/Providers/vShare', function() {
    describe('getUrl(), setUrl()', function () {

        it('should return \'\' when url is not set', () => {
            let vShareProvider = new VShare(requestMock);
            assert.equal(vShareProvider.getUrl(), '');
        });

        it('should return given url', () => {
            let vShareProvider = new VShare(requestMock);
            let url = "http://vshare.io/v/49869bd/width-600/height-400/";
            vShareProvider.setUrl(url);

            assert.equal(vShareProvider.getUrl(), url);
        });

    });
    describe('getHtml()', function () {

        it('should return movie html links', () => {
            let vShareProvider = new VShare(requestMock);
            vShareProvider.setUrl("http://vshare.io/v/49869bd/width-600/height-400/");
            let htmlContent = vShareProvider.getHtml();

            assert.equal(htmlContent, mockedData);
        });
    });
    describe('getMediaLink()', function () {

        it('should return movie download url links', () => {
            let vShareProvider = new VShare(requestMock);
            vShareProvider.setUrl("http://vshare.io/v/49869bd/width-600/height-400/");
            let mediaLink = vShareProvider.getMediaLink();

            assert.equal(mediaLink, "http://s22.vshare.io/s,110-1000-4-0/190462/341088/184778/ff-7035d2fa7cf7c6da46495e4cfded778c,590a23c5,49869bd_480.mp4");
        });


    });
});

let mockedData = fs.readFileSync(__dirname+"/mockedRequestData", "UTF-8");
let requestMock = {
    request: () => {
        return requestMock.response;
    },
    response: {
        body: {
            toString: () => {
                return mockedData;
            }
        }
    }
};
