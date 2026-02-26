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
        this.attributes = new AttributeMap();
        this.errors = [];
    }

    parse() {
        let pageBody = document.createElement("div");
        pageBody.classList.add("page");

        const parseExpression = (parent) => {
            return parseContent(parent);
        }
        const parseContent = (parent) => {
            while(this._peek() !== null && this._peek().type !== 'DelimClose'){
                parseItem(parent)
            }
        }
        const parseItem = (parent) => {
            const token = this._peek();
            if(token.type === "Tag"){
                return parseTag(parent);
            }
            else if(token.type === "Text"){
                this._consume("Text");
                let textSpan = document.createElement("span");
                textSpan.innerText = token.value
                parent.appendChild(textSpan);
            }
            else{
                throw new Error("Unexpected Item to Parse: " + token.value + "|" + token.type)
            }

        }
        const parseTag = (parent) => {

            const token = this._consume("Tag"); 
            let tagDiv = this._getTagHTML(token)

            let t = this._peek();
            if(t && t.type === "AttOpen"){
                getAttributes(tagDiv);
            }

            this._consume("DelimOpen");
            parseContent(tagDiv);
            this._consume("DelimClose");

            parent.appendChild(tagDiv)
        }

        const getAttributes = (tagDiv) => {
            this._consume("AttOpen");
            const attributes = this._consume("Text").value;
            this._consume("AttClose")
            
            for(let part of attributes.split(" ")){
                this._getStyle(part, tagDiv);
            }
        }
    
        parseExpression(pageBody);

        return pageBody;
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
        let tagDiv = null;
        switch(token.value){
            case "B":
                tagDiv = document.createElement("b");
                break;
            case "Row":
                tagDiv = document.createElement("div");
                tagDiv.classList.add("row")
                break;
            case "Col":
                tagDiv = document.createElement("div");
                tagDiv.classList.add("col")
                break;
            case "P":
                tagDiv = document.createElement("p");
                break;
            case "I":
                tagDiv = document.createElement("i");
                break;
                
            default:
                tagDiv = document.createElement("div");
                console.error("ERROR: unknown tag: " + token)

            }
            tagDiv.classList.add("tag");
        return tagDiv;
    }

    _getStyle(part, div){ // part should be w-{number/number}
        if(!part.includes("-")){
            console.warn("Unknown Attribute: ", part)
        }
        const parts = part.split("-");
        const name = parts[0];
        const value = this._parseFraction(parts[1]);
        console.log(`Got atributes of name: ${name}, value: ${value} `);

        this.attributes.applyStyle(name, value, div);


    }


    _parseFraction(fraction){
        const parts = fraction.split("/")
        const percent = Math.round(parseFloat(parts[0]) / parseFloat(parts[1]) * 100);
        return `${percent}%`;

    }


}