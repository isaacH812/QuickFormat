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
class Token{
    constructor(type, value){
        this.type = type;
        this.value = value;
        this.index = -1;

    }

    toString(){
        return `<${this.value},${this.type}> @ ${this.index}`;
    }

    getSyntaxHTML(){
        return `<span class="element">${this.value}</span>`

    }
}

class Tokenizer{

    constructor(){
        this.tables = new LexicalTable("./quick.table") 
    }

    tokenize(input) {
        const tokens = [];
        let remaining = input;
        const startLength = remaining.length;
    
        while (remaining.length > 0) {
            const token = this.nextToken(remaining);
            if (token === null) {
                // no valid token found, skip one character to avoid infinite loop
                remaining = remaining.substring(1);
                continue;
            }
            token.index = startLength - remaining.length;
            if(token.type !== "Ignore"){
             
                tokens.push(token);
            }
            // chop off however many characters were consumed
            remaining = remaining.substring(token.value.length);
            
        }
    
        return tokens;
    }

    nextToken(input){
        let i = 0
        let lexeme = "";
        let stack = ["bad"];
        let state = "s0";
        while(state !== "error"){
            if(i === input.length){break;}
            const nextChar = input[i++];
            lexeme += nextChar;
            if(this.tables.tokenTypes.has(state)){
                stack = [];
            }
            stack.push(state);
            const charClass = this.tables.getClass(nextChar);
            state = this.tables.getState(state, charClass);
        }
        
        while(!this.tables.tokenTypes.has(state) && state !== "bad"){
            state = stack.pop();
            if(lexeme.length > 0){
                lexeme = lexeme.substring(0,lexeme.length - 1)
            }
            i--;
        }

        if(this.tables.tokenTypes.has(state)){
            return new Token(this.tables.getType(state), lexeme);
        }else{
            return null;
        }
    }

   
}