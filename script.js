const submitButton = document.querySelector('#urlSubmit');
const urlInput = document.querySelector('#urlInput');
const outputContainer = document.querySelector('.output-container');
const clearButton = document.querySelector('#clear');

let url = '';

submitButton.addEventListener('click', () => {
    url = urlInput.value;
    let text;
    getFile(url)
        .then((textReturn) => (text = textReturn))
        .then(() => {
            translate(text);
        });
});

const clearAll = () => {
    outputContainer.innerHTML = '';
    urlInput.value = '';
    url = '';
};

const getFile = (inputUrl) => {
    return fetch(inputUrl).then((res) => res.text());
};

const translate = (input) => {
    let blocks = input.split('\n');
    let mappedBlocks = blocks.map((block) => {
        if (block.startsWith('#') || block === '') {
            return block;
        } else {
            return `<p>${block}</p>`;
        }
    });
    let blockString = mappedBlocks.join('\n');

    let lines = blockString.match(/^.*([\n\r]+|$)/gm);
    let preOpen = false;

    lines.forEach((line) => {
        console.log(`before ${line}`);
        if (line.startsWith('#')) {
            let lineArray = line.split(' ');
            let hashes = lineArray[0];
            let headerTag = `h${hashes.length}`;
            lineArray.shift();
            let lineOutput = lineArray.join(' ');
            let htmlOut = `<${headerTag}>${lineOutput}</${headerTag}>`;
            line = htmlOut;
        }
        
        // needs work
        if (line.startsWith('<p>```')) {
            if (!preOpen) {
                line = '<pre>';
                preOpen = true;
            } else {
                line = '</pre>';
                preOpen = false;
            }
        }
        outputContainer.innerHTML += line;
        console.log(`after ${line}`);
    });
};
