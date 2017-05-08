/**
 * Created by Dawid on 07.05.2017.
 */

import * as assert from "assert";
import {OpenLoad} from "../../../../resources/hosts/providers/OpenLoad";
import * as fs from "fs";

describe('Hosts/Providers/OpenLoad', function() {
    describe('getUrl(), setUrl()', function () {

        it('should return \'\' when url is not set', () => {
            let openLoadProvider = new OpenLoad(requestMock);
            assert.equal(openLoadProvider.getUrl(), '');
        });

        it('should return given url', () => {
            let openLoadProvider = new OpenLoad(requestMock);
            let url = "https://openload.co/embed/T71J_v66AD4";
            openLoadProvider.setUrl(url);

            assert.equal(openLoadProvider.getUrl(), url);
        })
    });

    describe('getHtml()', () => {
        let html = null;
        beforeEach(done => {
            let openLoadProvider = new OpenLoad(requestMock);
            let url = "https://openload.co/embed/T71J_v66AD4";
            openLoadProvider.setUrl(url);
            openLoadProvider.getHtml(htmlCode => {
                    html = htmlCode;
                    done();
            });
        });

        it('should run callback after loading movie html', () => {
            assert.equal(html, mockedData);
        });
    });

    describe("getMediaLink()", () => {
        let decUrl = null;
        beforeEach(done => {
            let openLoadProvider = new OpenLoad(requestMock);
            let url = "https://openload.co/embed/T71J_v66AD4";
            openLoadProvider.setUrl(url);
            openLoadProvider.getMediaLink(decodedUrl => {
                decUrl = decodedUrl;
                done();
            });
        });

        it("It should return correct media links for given htmlData", () => {
            assert.equal(decUrl, "https://openload.co/stream/T71J_v66AD4~1493747158~89.76.0.0~qpQ-wz8l");
        })
    })
});

let mockedData = fs.readFileSync(__dirname+"/mockedRequestData", "UTF-8");
let requestMock = {
    request: (options, callback) => {
        if (options.method == "GET") {
            callback("", "", requestMock.response.body);
        }
    },
    response: {
        body: {
            toString: () => {
                return mockedData;
            }
        }
    }
};