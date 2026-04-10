class Selector {
    constructor() {}

    moveCursorToIndex(element, targetIndex, reach) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null
        );

        let currentIndex = 0;
        let node;

        while ((node = walker.nextNode())) {
            console.log(node, " at  " + currentIndex);
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName === "BR") {
                    // Explicit line break
                    currentIndex += 1;
                } else if (node.nodeName === "SPAN") {
                    // Each span after the first represents a new line
                    // because your tokenizer splits lines into sibling spans
                    currentIndex += 1;
                }
                continue;
            }

            // Text node
            const nodeLength = node.textContent.length;

            if (currentIndex + nodeLength >= targetIndex) {
                const offset = targetIndex - currentIndex;
                const range = document.createRange();
                const selection = window.getSelection();

                range.setStart(node, offset);
                if (reach) {
                    range.setEnd(node, Math.min(offset + reach, node.textContent.length));
                } else {
                    range.collapse(true);
                }
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }

            currentIndex += nodeLength;
        }

        console.warn("Index out of bounds:", targetIndex);
    }
}