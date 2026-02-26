class AttributeMap{

    constructor(){
        this.example = document.createElement("div");
    }

    applyStyle(name, value, div){

        switch(name){
            case "w":
                div.style.width = value;
                break;
            case "h":
                div.style.height = value;
                break;

            default:
                console.warn(`Unknown style, name: ${name}, value: ${value}, target: ${div}`)
                break;
        }
    }

}