const TEXT_INPUT = document.getElementById("text-input");
const PREVIEW = document.getElementById("preview");
const tokenizer = new Tokenizer();
TEXT_INPUT.addEventListener("change",(e)=>{
    const tokens = tokenizer.tokenize(e.target.value)
    console.log(tokens);
    const parser = new Parser(tokens);
    const output = parser.parse();
    // console.log(output);
    PREVIEW.innerHTML = output;
})
