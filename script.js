// DOM elements ko select karna
const elements = {
    title: document.getElementById('title'),
    content: document.querySelector('.content'),
    button: document.getElementById('btn')
};

// Content update karna
function updateContent(text) {
    elements.content.innerHTML = text;
}

// Event listener
elements.button?.addEventListener('click', () => {
    updateContent('<h2>Content Updated!</h2>');
});