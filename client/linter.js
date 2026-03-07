// Save cursor as a plain character offset from the start
function saveCursor(editor) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return 0;
    const range = sel.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(editor);
    preRange.setEnd(range.endContainer, range.endOffset);
    return preRange.toString().length;
}

// Walk the DOM text nodes to find the right spot and place cursor
function restoreCursor(editor, offset) {
    const sel = window.getSelection();
    const range = document.createRange();
    let remaining = offset;
    let found = false;

    function walk(node) {
        if (found) return;
        if (node.nodeType === Node.TEXT_NODE) {
            if (remaining <= node.textContent.length) {
                range.setStart(node, remaining);
                range.collapse(true);
                found = true;
            } else {
                remaining -= node.textContent.length;
            }
        } else {
            for (const child of node.childNodes) walk(child);
        }
    }

    walk(editor);
    if (!found) range.selectNodeContents(editor); // fallback
    sel.removeAllRanges();
    sel.addRange(range);
}


function highlight(editor) {
    const text = editor.innerText; // always use innerText, not innerHTML
    const cursorPos = saveCursor(editor);

    const tokens = tokenizer.tokenize(text);
    
    // Find unmatched brackets for error highlighting
    const errorIndices = findUnmatchedBrackets(tokens);

    let html = '';
    let charPos = 0;

    for (const token of tokens) {
        // Fill any gaps (whitespace, skipped chars) as plain text
        if (token.index > charPos) {
            html += escapeHtml(text.slice(charPos, token.index));
        }

        const isError = errorIndices.has(token.index);
        const cls = `token-${token.type.toLowerCase()}${isError ? ' token-error' : ''}`;
        html += `<span class="${cls}">${escapeHtml(token.value)}</span>`;
        charPos = token.index + token.value.length;
    }

    // Trailing text after last token
    if (charPos < text.length) {
        html += escapeHtml(text.slice(charPos));
    }

    editor.innerHTML = html;
    restoreCursor(editor, cursorPos);
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function findUnmatchedBrackets(tokens) {
    const errorIndices = new Set();
    const stack = []; // stack of {token, index} for openers

    const pairs = { ')': '(', ']': '[', '}': '{' };
    const openers = new Set(['(', '[', '{']);
    const closers = new Set([')', ']', '}']);

    for (const token of tokens) {
        // adjust this check to match your actual bracket token types/values
        if (openers.has(token.value)) {
            stack.push(token);
        } else if (closers.has(token.value)) {
            const expected = pairs[token.value];
            if (stack.length && stack[stack.length - 1].value === expected) {
                stack.pop(); // matched!
            } else {
                errorIndices.add(token.index); // unmatched closer
            }
        }
    }

    // Everything left in stack is an unmatched opener
    for (const t of stack) errorIndices.add(t.index);

    return errorIndices;
}