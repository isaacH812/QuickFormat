const TEXT_INPUT = document.getElementById("editor");
const PREVIEW = document.getElementById("preview");
const TAB_SIZE = 3;
const tokenizer = new Tokenizer();
TEXT_INPUT.addEventListener("blur",(e)=>{
    const tokens = tokenizer.tokenize(TEXT_INPUT.innerText);
    console.log(tokens);
    const parser = new Parser(tokens);
    const output = parser.parse();
    PREVIEW.replaceChildren(output);
})

TEXT_INPUT.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()

    const sel = window.getSelection()
    const range = sel.getRangeAt(0)

    // Delete any selected text first
    range.deleteContents()

    // Insert the spaces as a text node
    const spaces = document.createTextNode(" ".repeat(TAB_SIZE))
    range.insertNode(spaces)

    // Move caret to after the inserted spaces
    range.setStartAfter(spaces)
    range.setEndAfter(spaces)
    sel.removeAllRanges()
    sel.addRange(range)
  }
})
