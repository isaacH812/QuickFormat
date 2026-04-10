const RENDER = document.getElementById("render-button");
const EDITOR = document.getElementById("editor");
const PREVIEW = document.getElementById("preview");
const SAVE = document.getElementById("save-button");
const CONSOLE = document.getElementById('console');
const SEL = new Selector();
const TAB_SIZE = 3;
const tokenizer = new Tokenizer();
const parser = new Parser();
const db = new DB();
let timer;

async function htmlToPdf(html) {
  const res = await fetch("/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html })
  });
  // const blob = await res.blob();
  // const url = URL.createObjectURL(blob);
  window.open(url); // opens the PDF in a new tab
}

function updateLogs(newLogs){
  CONSOLE.innerHTML = "";
  newLogs.forEach((log,i)=>{
      let newLog = document.createElement("div");
      newLog.classList.add("log"); 
      newLog.innerText = i+1 + ": " + log;
      CONSOLE.appendChild(newLog);
  }); 
}

const startingText = db.load('page');
EDITOR.innerText = startingText ? startingText : "";




EDITOR.addEventListener("input",(_)=>{
    clearTimeout(timer);
    timer = setTimeout(()=>{
      const {tokens, ignored} = tokenizer.tokenize(EDITOR.innerText);
      console.log(tokens, ignored);
      const {pageBody, logs} = parser.parse(tokens);
      PREVIEW.replaceChildren(pageBody);
      updateLogs(logs);
    }, 200);
})

SAVE.addEventListener("click", ()=>{
  db.save("page", EDITOR.innerText);
});


RENDER.addEventListener('click', async (_)=>{
  await htmlToPdf(PREVIEW.innerHTML.toString());
})

EDITOR.addEventListener('keydown', (e) => {
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

PREVIEW.addEventListener('mouseover', (e) => {
  e.target.classList.add('hovered');
});
PREVIEW.addEventListener('click', (e) => {
  const clickedDiv = e.target;
  const idx = e.target.dataset.index;

  if (idx) {
    SEL.moveCursorToIndex(EDITOR, idx, clickedDiv.innerText.length);

    // Scroll the cursor position into view
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = EDITOR.getBoundingClientRect();

      EDITOR.scrollTo({
        top: EDITOR.scrollTop + rect.top - editorRect.top - EDITOR.clientHeight / 2,
        behavior: 'smooth'
      });
    }
  }
});

PREVIEW.addEventListener('mouseout', (e) => {
  e.target.classList.remove('hovered');
});
