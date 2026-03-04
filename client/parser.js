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
        const parseContent = (parent, textParent) => {
            while(this._peek() !== null && this._peek().type !== 'DelimClose'){
                parseItem(parent, textParent)
            }
        }
        const parseItem = (parent, textParent) => {
            const token = this._peek();
            if(token.type === "Tag"){
                return parseTag(parent);
            }
            else if(token.type === "Text"){
                this._consume("Text");
                let textSpan = document.createElement("span");
                textSpan.innerText = token.value
                if(textParent){
                    textParent.appendChild(textSpan);
                }else{
                    parent.appendChild(textSpan);
                }
            }
            else{
                throw new Error("Unexpected Item to Parse: " + token.value + "|" + token.type)
            }

        }
        const parseTag = (parent) => {

            const token = this._consume("Tag"); 
            const {tagDiv, textDiv} = this._getTagHTML(token)

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
        let textDiv = null;
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
            case "Ul":
                tagDiv = document.createElement("ul");
                break;
            case "Li":
                tagDiv = document.createElement("li");
                break;
            case "Cen":
                tagDiv = document.createElement("div");
                tagDiv.classList.add("cen")
                break;
            case "Hline":
                tagDiv = document.createElement("div");
                tagDiv.classList.add("hline")
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
            // tagDiv.classList.add("tag"); // used for highlighting boundaries
        return {tagDiv, textDiv};
    }

    _getStyle(part, div){ // part should be w-[number/number] or w-[number] or !
        if(!part.includes("-")){
            this.attributes.applyStyle(part, 0, div);
            return;
        }

        const parts = part.split("-");
        const name = parts[0];
        let value = parts[1];
        if(value.includes("/")){
            value = this._parseFraction(value);
        }
        else{
            value = `${value}px`
        }
        console.log(`Got atributes of name: ${name}, value: ${value} `);

        this.attributes.applyStyle(name, value, div);

    }


    _parseFraction(fraction){
        const parts = fraction.split("/")
        const percent = Math.round(parseFloat(parts[0]) / parseFloat(parts[1]) * 100);
        return `${percent}%`;

    }


}