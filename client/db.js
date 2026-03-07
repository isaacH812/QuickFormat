
class DB {
    constructor(){

    }

    save(name, data){
        localStorage.setItem(name, data);
    }

    load(name){
        const stringData = localStorage.getItem(name);
        if(!stringData){
            console.warn("No local data found of name: ", name)
            return null;
        }
        return stringData;
    }

    clear(){
        localStorage.clear();
    }
}