const RENDER = document.getElementById("render-button");
const TEXT_INPUT = document.getElementById("editor");
const PREVIEW = document.getElementById("preview");
const TAB_SIZE = 3;
const tokenizer = new Tokenizer();

async function htmlToPdf(html) {
  const res = await fetch("/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html })
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url); // opens the PDF in a new tab
}

TEXT_INPUT.addEventListener("blur",(_)=>{
    const tokens = tokenizer.tokenize(TEXT_INPUT.innerText);
    console.log(tokens);
    const parser = new Parser(tokens);
    const output = parser.parse();
    PREVIEW.replaceChildren(output);
})

RENDER.addEventListener('click', async (_)=>{
  console.log("text: " + PREVIEW.innerHTML);
  await htmlToPdf(PREVIEW.innerHTML + "");
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

document.getElementById('preview').addEventListener('mouseover', (e) => {
  e.target.classList.add('hovered');
});

document.getElementById('preview').addEventListener('mouseout', (e) => {
  e.target.classList.remove('hovered');
});
