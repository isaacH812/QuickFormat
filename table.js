
class LexicalTable{
    constructor(path){
        this.path = path;
        this.init();
        this.state2state = new Map();
        this.charClass = new Map();
        this.tokenTypes = new Map();
    }

     _unescape(char) {
        const map = { "/_": " ", "\\t": "\t", "\\n": "\n", "\\r": "\r", "\\":"\\" };
        return map[char] ?? char;
    }
    
    async init(){
        let state = "CharClass";
        const tableText = await loadTable(this.path)
        for(let line of tableText.split("\n")){
            if (line.startsWith("//") || line.trim() === ""){continue;}
            switch(state){
                case "CharClass":
                    if(line === "Transistions"){state = "Transistions"; continue;}
                    {
                        const parts = line.split(" ");
                        parts[1] = this._unescape(parts[1]);
                        const charClass = parts[0];
                        const char = parts[1];
                        this.charClass.set(char, charClass)
                    }
                    break;
                case "Transistions":
                    if(line === "Token Types"){state = "Token Types"; continue;}
                    {
                        const parts = line.split(" ");
                        const s1 = parts[0];
                        const charClass = parts[1];
                        const s2 = parts[2];

                        if(!this.state2state.has(s1)){
                            this.state2state.set(s1, new Map())
                        }
                        this.state2state.get(s1).set(charClass,s2)
                        
                    }
                    break;

                case "Token Types":
                    {
                        const parts = line.split(" ");
                        const state = parts[0];
                        const charClass = parts[1];
                        this.tokenTypes.set(state, charClass);
                    }
                    break;
            }

        }
        console.log(this.tokenTypes, this.state2state, this.charClass);
    }

    getClass(char){
        return this.charClass.get(char);
    }

    getState(state, charClass){
        const stateMap = this.state2state.get(state)
        if(!stateMap) return "error";
        const newState = stateMap.get(charClass);
        if(!newState) return "error";
        return newState;
        
    }

    getType(state){
        return this.tokenTypes.get(state);
    }
}


async function loadTable(path){
    const res = await fetch(path)
    const text = await res.text();
    return text;
}


