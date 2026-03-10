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
            case "mb":
                div.style.marginBottom = value;
                break;
            case "mt":
                div.style.marginTop = value;
                break;
            case "my":
                div.style.marginTop = value;
                div.style.marginBottom = value;
                break;
            case "split":
                div.style.display = "inline-flex";
                div.style.justifyContent = "space-between";
                break;
            case "txt":
                div.style.fontSize = value
                break;
            case "spacing":
                div.style.letterSpacing = value
                break;
            case "!":
                div.classList.add('tag')
                break;
            default:
                console.warn(`Unknown style, name: ${name}, value: ${value}, target: ${div}`)
                break;
        }
    }

}