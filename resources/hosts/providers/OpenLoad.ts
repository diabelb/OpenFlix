import {RequestUtil} from "../../utils/RequestUtil";
import {AADecoder} from "../../utils/AADecoder";
import * as vm from "vm";
import {Host} from "../Host";

/**
 * Created by Dawid on 07.05.2017.
 */

export class OpenLoad extends Host{
    private static readonly TAB_PATTERN = /<span id="([^"]+)">([^<>]+)<\/span>/g;
    private static readonly ENC_SCRIPT = /<script src="\/assets\/js\/video-js\/video\.js\.openload\.js"(.+)[\s\S]*/;
    private static readonly DEC_SCRIPT = /type="text\/javascript">(.[\s\S]+?)<\/script>/;
    private static readonly NEEDED_JS_FILTER = /^(.+?)}\);\s*\$\("#videooverlay/;
    static readonly URL_REG_EXP = /http[s]*:\/\/openload.co[^'"&]+/;
    private htmlContent: string;
    protected requestUtil: RequestUtil;
    protected url: string;

    public setUrl(url: string) {
        this.htmlContent = null;
        this.url = url;
    }

    public getUrl():string {
        return this.url;
    }

    public getMediaLink(callback: (decodedUrl)=>any) {
        this.getHtml(htmlCode => {
            if (htmlCode != "") {
                let encryptedHtml = this.getEncryptedHtml(htmlCode);
                if (encryptedHtml != "") {
                    let decodedHtml = OpenLoad.decodeHtml(encryptedHtml);
                    let encryptedUrlToFile = this.getEncryptedUrlToFile();
                    let decodedUrlToFile = this.decodeUrlToFIle(decodedHtml, encryptedUrlToFile);
                    callback('https://openload.co/stream/'+decodedUrlToFile);
                }
                else {
                    callback("");
                }
            }
            else {
                callback("");
            }
        });
    }

    /**
     * Returns cleaned javascript code from OpenLoad, ready to run
     * @param decryptedHtml
     * @return {string}
     */
    private getCleanedJavascriptCode(decryptedHtml: string):string {
        let jsCode = OpenLoad.getJsCode(decryptedHtml);
        jsCode = OpenLoad.ASCIIDecode(jsCode);
        jsCode = OpenLoad.filterNeededJS(jsCode);
        jsCode = this.hackJS(jsCode);

        return jsCode;
    }

    public getHtml(callback: (htmlCode)=>any) {
        this.requestUtil.request({
            method: 'GET',
            url: this.getUrl(),
        }, (error, response, body) => {
            if (error) {
                console.log("Połączenie z adresem " + this.getUrl() + " nie powiodło się. Problem z połączeniem.")
                callback("");
            }
            else {
                callback(body.toString());
            }
        });
    }

    /**
     * Gets encrypted part of HTML
     * @throws Error
     * @return {string}
     */
    private getEncryptedHtml(htmlCode: string): string {
        this.htmlContent = htmlCode;
        let result = this.htmlContent.match(OpenLoad.ENC_SCRIPT);
        if (result) {
            return result[0];
        }
        else {
            console.log("Encrypted HTML does not exists! "+ this.getUrl());
            return "";
        }

    }

    /**
     * Returns encrypted url to media file
     * @return {string}
     */
    private getEncryptedUrlToFile(): string {
        let temp;
        let codedUrl = '';
        while (temp = OpenLoad.TAB_PATTERN.exec(this.htmlContent)) {
            if ((temp[2]).length > 30) {
                codedUrl = temp[2];
            }
        }
        return codedUrl;
    }

    /**
     * Create js environment needed to run OpenLoad js script
     * @param encryptedUrlToFile
     * @return {Object}
     */
    private createJsEnvironment(encryptedUrlToFile: string) {
        //noinspection JSUnusedGlobalSymbols
        let sandbox =
            {
                window: {},
                z: 'notImportantButNeeded',
                decodedUrl: null,
                $: function () {
                    //noinspection JSUnusedGlobalSymbols
                    return {
                        text: function (url = null) {
                            if (url != null) {
                                sandbox.decodedUrl = url;
                            }
                            return encryptedUrlToFile;
                        }
                    }
                }
            };
        return sandbox;
    }

    /**
     * Decodes encrypted url
     * @param decodedHtml
     * @param encryptedUrlToFile
     * @return {string}
     */
    private decodeUrlToFIle(decodedHtml: string, encryptedUrlToFile: string): string {
        let jsCode = this.getCleanedJavascriptCode(decodedHtml);
        let jsEnvironment = this.createJsEnvironment(encryptedUrlToFile);
        vm.createContext(jsEnvironment);
        vm.runInContext(jsCode, jsEnvironment);
        return jsEnvironment.decodedUrl;
    }

    /**
     * Decode ASCII chars
     * @param code
     * @return {string}
     */
    private static ASCIIDecode(code: string): string {
        let i = 0;
        let l = code.length;
        let temp = '';

        while (i < l) {
            let c = code.substr(i,1);
            if (code.substring(i,i+2) == '\\x') {
                c = String.fromCharCode(parseInt(code.substr(i+2,4),16));
                i+=3;
            }

            if (code.substring(i,i+2) == '\\u') {
                c = String.fromCharCode(parseInt(code.substr(i+2,6),16));
                i+=5;
            }
            temp = temp + c;
            i += 1;
        }
        return temp;
    }

    /**
     * Cpacker decoder
     * @param s
     * @return {string}
     * @todo Implementation
     */
    private static CheckCpacker(s: string): string {
        let sPattern = /(\s*eval\s*\(\s*function(?:.|\s)+?{}\)\))/;
        let aResult = s.match(sPattern);
        if (aResult) {
            throw new Error("Cpacker not supported. TODO.");
        }
        return s;
    }

    /**
     * JJ decoder
     * @param s
     * @return {string}
     * @todo Implementation
     */
    private static CheckJJDecoder(s: string): string {
        let sPattern = /([a-z]=.+?\(\)\)\(\);)/;
        let aResult = s.match(sPattern);
        if(aResult) {
            throw new Error("JJ encryption not supported. TODO.");
        }
        return s;
    }

    /**
     * AA decoder
     * @param s
     * @return {string}
     * @constructor
     */
    public static CheckAADecoder(s: string): string {
        let sPattern = /([>;]\s*)(ﾟωﾟ.+[\s\S]?\('_'\);)/;
        let result = s.match(sPattern);

        if (result) {
            let decoder = new AADecoder(result[2]);
            if (decoder.isAAEncoded()) {
                let tmp = result[1] + decoder.decode();
                return s.substring(0,result.index)+tmp+s.substring((result.index+result[0].length));
            }
        }
        return s;
    }

    /**
     * Decodes encryptede part of HTML
     * @param encryptedHtml
     * @return {string}
     */
    private static decodeHtml(encryptedHtml: string) {
        for (let i = 0; i <= 4; i++) {
            encryptedHtml = OpenLoad.CheckCpacker(encryptedHtml);
            encryptedHtml = OpenLoad.CheckJJDecoder(encryptedHtml);
            encryptedHtml = OpenLoad.CheckAADecoder(encryptedHtml);
        }
        return encryptedHtml;
    }

    /**
     * Gets encrypted js part of HTML
     * @param decryptedHtml
     * @return {string}
     */
    private static getJsCode(decryptedHtml: string): string {
        let result = decryptedHtml.match(OpenLoad.DEC_SCRIPT);
        if (result) {
            decryptedHtml = result[1];
        }
        return decryptedHtml;
    }

    /**
     * Filter needed js from the whole code
     * @param jsCode
     * @return {string}
     */
    private static filterNeededJS(jsCode: string): string {
        let result = jsCode.match(OpenLoad.NEEDED_JS_FILTER);
        if (result) {
            return result[1];
        }
        else {
            throw new Error("JS needed to get download links does not exist");
        }
    }

    /**
     * Ads come hacks to js code to make it runnable in node virtual machine
     * @param jsCode
     * @return {string}
     */
    private hackJS(jsCode: string): string {
        jsCode = jsCode.split('!![]').join('true');
        let P8 = /\$\(document\).+?\(function\(\){/;
        jsCode = jsCode.split(P8).join('\n');
        let P4 = /if\(!_[0-9a-z_\[(')\]]+,document[^;]+\)\){/;
        jsCode = jsCode.split(P4).join('if (false) {');
        P4 = /if\(+'toString'[^;]+document[^;]+\){/;
        jsCode = jsCode.split(P4).join('if (false) {');

        return jsCode
    }
}