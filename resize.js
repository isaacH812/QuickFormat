const divider = document.querySelector('.divider');
const editor = document.querySelector('.editor');
const main = document.querySelector('.main');

let isDragging = false;

divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize'; 
    document.body.style.userSelect = 'none'; // prevents text selection while dragging
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const mainRect = main.getBoundingClientRect();
    const offset = e.clientX - mainRect.left;
    const totalWidth = mainRect.width;

    // clamp between 10% and 90% so panels don't disappear
    const percentage = Math.min(Math.max((offset / totalWidth) * 100, 10), 90);
    editor.style.width = `${percentage}%`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
});