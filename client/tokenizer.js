class Token{
    constructor(type, value){
        this.type = type;
        this.value = value;
        this.index = -1;
        this.errors = [];

    }

    toString(){
        return `<${this.value},${this.type}> @ ${this.index}`;
    }
}

class Tokenizer{

    constructor(){
        this.tables = new LexicalTable("./quick.table") 
    }

    tokenize(input) {
        const tokens = [];
        let remaining = input.trim();
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
            
            if(token.type === "Tag"){
                token.value = token.value.substring(1); // remove the start tag symbol
            }
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