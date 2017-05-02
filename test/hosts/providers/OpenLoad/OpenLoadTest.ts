/**
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */

import * as assert from "assert";
import {OpenLoad} from "../../../../resources/hosts/providers/OpenLoad";
import * as fs from "fs";

describe('Hosts/Providers/OpenLoad', function() {
    describe('getUrl(), setUrl()', function() {

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

    describe("getMediaLink()", () => {

        it("It should return correct media link for given htmlData", () => {
            assert.equal(openLoadProvider.getMediaLink(), "https://openload.co/stream/T71J_v66AD4~1493747158~89.76.0.0~qpQ-wz8l");
        })
    })
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
let openLoadProvider = new OpenLoad(requestMock);