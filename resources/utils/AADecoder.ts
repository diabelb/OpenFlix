/**
 * Decoder text encoded with AAEncoder
 * @author Dawid Boruta
 * @author diabelb@gmail.com
 */
export class AADecoder {
    private static readonly ENCODED_CHARS = ["(c^_^o)", "(ﾟΘﾟ)", "((o^_^o) - (ﾟΘﾟ))", "(o^_^o)",
        "(ﾟｰﾟ)", "((ﾟｰﾟ) + (ﾟΘﾟ))", "((o^_^o) +(o^_^o))", "((ﾟｰﾟ) + (o^_^o))",
        "((ﾟｰﾟ) + (ﾟｰﾟ))", "((ﾟｰﾟ) + (ﾟｰﾟ) + (ﾟΘﾟ))", "(ﾟДﾟ) .ﾟωﾟﾉ", "(ﾟДﾟ) .ﾟΘﾟﾉ",
        "(ﾟДﾟ) ['c']", "(ﾟДﾟ) .ﾟｰﾟﾉ", "(ﾟДﾟ) .ﾟДﾟﾉ", "(ﾟДﾟ) [ﾟΘﾟ]"];
    private static readonly BEGIN_CODE = "ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   / ['_']; o=(ﾟｰﾟ)  =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); ";
    private static readonly ENDING_CODE = "(ﾟДﾟ)[ﾟoﾟ]) (ﾟΘﾟ)) ('_');";
    private static readonly BEGIN_CHAR = "(ﾟДﾟ)[ﾟεﾟ]+";
    private static readonly HEX_CHAR = "(oﾟｰﾟo)+ ";

    private encodedStr: string;
    private codeBuffer: string;

    constructor(aa_encoded_data: string) {
        this.encodedStr = aa_encoded_data.replace('/*´∇｀*/', '');
    }

    /**
     * Check if given string i encoded with AAEncoder
     * @returns {boolean}
     */
    public isAAEncoded(): boolean {
        return (this.encodedStr.includes(AADecoder.BEGIN_CODE) && this.encodedStr.includes(AADecoder.ENDING_CODE));
    }

    /**
     * Decoded encrypted data in given string
     * @returns {string}
     */
    public decode(): string {
        let out = '';

        this.codeBuffer = this.getDecodedCodeFromGivenString();
        while (this.codeBuffer != "") {

            let encChar = this.getNextEncodedChar();
            let strChar = AADecoder.decodeChar(encChar);

            if (strChar == "") {
                console.log("no match :  " + encChar + "\nout = " + out + "\n");
                return "";
            }
            out += strChar;
        }
        return out;
    }

    /**
     * Finds decodec code in given string
     * @returns {string}
     */
    private getDecodedCodeFromGivenString(): string {
        let pattern = /\(ﾟДﾟ\)\[ﾟoﾟ]\+ (.+?)\(ﾟДﾟ\)\[ﾟoﾟ]\)/;
        let result = this.encodedStr.match(pattern);

        if (!result) {
            console.log("AADecoder: data not found.");
            return "";
        }

        return result[1];
    }

    /**
     * Finds next encoded char from buffer
     * @returns {string}
     */
    private getNextEncodedChar(): string {
        let data = this.codeBuffer.substr(AADecoder.BEGIN_CHAR.length);
        let encChar = "";

        if (!data.includes(AADecoder.BEGIN_CHAR)) {
            encChar = data;
            data = "";
        }
        else {
            encChar = data.substr(0, data.indexOf(AADecoder.BEGIN_CHAR));
            data = data.substr(encChar.length);
        }

        this.codeBuffer = data;
        return encChar;
    }

    /**
     * Decodes given char
     * @param encChar
     * @returns {string}
     */
    private static decodeChar(encChar: string): string {
        let radix = AADecoder.detectRadix(encChar);
        if (radix == 16) {
            encChar = encChar.substr(AADecoder.HEX_CHAR.length);
        }

        encChar = AADecoder.replaceWithEncodedChars(encChar);
        if (encChar.startsWith('(')) {
            let charArray = AADecoder.splitCharsIntoArray(encChar);
            encChar = AADecoder.parseCharArray(charArray);
        }
        return String.fromCharCode(parseInt(encChar, radix));
    }

    /**
     * Detect char radix (UTF8 or 16)
     * @param encChar
     * @returns {number}
     */
    private static detectRadix(encChar: string): number {
        let radix = 8;

        if (encChar.includes(AADecoder.HEX_CHAR)) {
            radix = 16;
        }
        return radix;
    }

    /**
     * Calculates digit
     * @param encChar Equation to calculate in (x + y) format
     * @returns {string}
     */
    private static calculateDigit(encChar: string): string {
        let rer = encChar.split('))+');
        let v = '';
            for (let c of rer) {
                if (c.length > 0) {
                    if (c.trim().endsWith('+')) {
                        c = c.trim().substring(0, c.trim().length - 1);
                    }
                    let startBrackets = c.length - (c.replace('(', '').length);
                    let endBrackets = c.length - (c.replace(')', '').length);

                    if (startBrackets > endBrackets) {
                        c += ')';
                    }
                    v += eval(c);
                }
            }
        return v;
    }

    /**
     * Replace encoded chars with decoded numbers
     * @param encChar
     * @returns {string}
     */
    private static replaceWithEncodedChars(encChar: string): string {
        for (let i in AADecoder.ENCODED_CHARS) {
            encChar = encChar.split(AADecoder.ENCODED_CHARS[i]).join(i.toString());
        }
        encChar = encChar.split('!+[]').join('1');
        encChar = encChar.split('-~').join('1+');
        encChar = encChar.split('[]').join('0');

        return encChar;
    }

    /**
     * Splits chars into array
     * @param encChar
     * @returns {Array} Char array in format [ '(x + y)', '(x-y+z......)....' ]
     */
    private static splitCharsIntoArray(encChar: string): Array<string> {
        let startPos = 0;
        let findClose = true;
        let balance = 1;
        let result = [];
        let l = 0;
        for (let eChar of encChar.substring(1).split("")) {
            l++;
            if (findClose && eChar == ')') {
                balance--;
                if (balance == 0) {
                    result.push(encChar.substring(startPos, l + 1));
                    findClose = false;
                }
            }
            else if (!findClose && eChar == '(') {
                startPos = l;
                findClose = true;
                balance = 1;
            }
            else if (eChar == '(') {
                balance += 1;
            }
        }
        return result;
    }

    /**
     * Parses charArray
     * @param charArray in format [ '(x + y)', '(x-y+z......)....' ]
     * @returns {string}
     */
    private static parseCharArray(charArray: Array<string>) {
        let strChar = "";
        if (charArray.length > 0) {
            for (let r of charArray) {
                let value = AADecoder.calculateDigit(r);
                if (value == "") {
                    return ""
                }
                else {
                    strChar += value;
                }
            }
        }
        return strChar;
    }
}