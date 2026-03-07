class Selector{
    constructor(){

    }

    moveCursorToIndex(element, targetIndex, reach) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null
        );
        
        let currentIndex = 0;
        let node;
        
        while ((node = walker.nextNode())) {
            // <br> tags count as \n in innerText, so bump the index
            if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === "BR") {
                currentIndex += 1;
            }
            continue;
            }
        
            // It's a text node
            const nodeLength = node.textContent.length;
        
            if (currentIndex + nodeLength >= targetIndex) {
            const offset = targetIndex - currentIndex;
            const range = document.createRange();
            const selection = window.getSelection();
        
            range.setStart(node, offset);
            if(reach){
                range.setEnd(node, Math.min(offset + reach, node.textContent.length));
            }else{
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