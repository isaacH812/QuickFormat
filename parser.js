/*
Token Types
s11 Ignore
s1 Text
s2 Tag
s3 Digit
s4 DelimClose
s5 DelimOpen
s6 AttOpen
s7 AttClose

*/

class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.pos = 0;
    }

    parse() {
        let htmlString = "<div class='page'>";

        const parseExpression = () => {
            return parseContent();
        }
        const parseContent = () => {
            while(this._peek() !== null && this._peek().type !== 'DelimClose'){
                parseItem()
            }
        }
        const parseItem = () => {
            const token = this._peek();
            if(token.type === "Tag"){
                return parseTag();
            }
            else if(token.type === "Text"){
                this._consume("Text");
                htmlString += `<span>${token.value}</span>`;
            }
            else{
                throw new Error("Unexpected Item to Parse: " + token.value + "|" + token.type)
            }

        }
        const parseTag = () => {

            const token = this._consume("Tag"); 

            let t = this._peek();
            if(t && t.type === "AttOpen"){
                const attributes = parseAttributes();
                console.log("Attributes for tag: " + attributes)
            }
            this._consume("DelimOpen");
            const {openTag, closeTag} = this._getTagHTML(token)
            htmlString += openTag;
            parseContent();
            htmlString += closeTag;
            this._consume("DelimClose");
        }

        const parseAttributes = () => {
            this._consume("AttOpen");
            const attributes = this._consume("Text").value;
            this._consume("AttClose")
            return attributes;
        }
    
        parseExpression();

        return htmlString + "</div>";
    }

    _peek(){
        return this.pos < this.tokens.length ? this.tokens[this.pos] : null
    }

    _consume(expected = null){
        let token = this._peek();
        if(!token){
            throw new Error("Unexpected End of Input!");
        }
        if(expected && expected !== token.type){
            throw new Error(`Expected ${expected}, but got ${token.value}`);
        }
        this.pos += 1;
        return token;
    }

    _getTagHTML(token){
        let openTag = "<div>"
        let closeTag = "</div>"
        switch(token.value){
            
            case "B":
                openTag = "<b>"
                closeTag = "</b>"
                break;

            case "P":
                openTag = "<p>"
                closeTag = "</p>"
                break;

            case "I":
                openTag = "<i>"
                closeTag = "</i>"
                break;
                
            default:
                console.error("ERROR: unknown tag: " + token)
        }
        return {openTag, closeTag}
    }


}