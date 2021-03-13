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
    let lines = input.match(/^.*([\n\r]+|$)/gm);
    let preOpen = false;
    let ulOpen = false;
    let olOpen = false;
    let outputLines = lines.map((line) => {
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

        if (line.startsWith('```')) {
            if (!preOpen) {
                line = '<pre>';
                preOpen = true;
            } else {
                line = '</pre>';
                preOpen = false;
            }
        }
        console.log(`after ${line}`);
        return line;
    });
    outputContainer.innerHTML = outputLines.join('\n');
};
