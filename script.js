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
    console.log(lines);
    let preOpen = false;
    let ulOpen = false;
    let olOpen = false;
    let outputLines = lines.map((line, i) => {
        // console.log(`before ${line}`);
        if (line.startsWith('#')) {
            let lineArray = line.split(' ');
            let hashes = lineArray[0];
            let headerTag = `h${hashes.length}`;
            lineArray.shift();
            let lineOutput = lineArray.join(' ');
            let htmlOut = `<${headerTag}>${lineOutput}</${headerTag}>`;
            line = htmlOut;
        } else if (line.startsWith('```')) {
            if (!preOpen) {
                line = '<pre>';
                preOpen = true;
            } else {
                line = '</pre>';
                preOpen = false;
            }
        } else if (line.startsWith('* ')) {
            let lineOut = line.split('* ');
            if (!ulOpen) {
                line = `<ul><li>${lineOut[1]}</li>`;
                ulOpen = true;
            } else {
                if (!lines[i + 1].startsWith('* ')) {
                    line = `<li>${lineOut[1]}</li></ul>`;
                    ulOpen = false;
                } else {
                    line = `<li>${lineOut[1]}</li>`;
                }
            }
        } else if (line.match(/^\d\./)) {
            let lineSplit = line.split(' ');
            let number = lineSplit[0].slice(0, -1);
            let lineContent = [...lineSplit];
            lineContent.shift();

            if (!olOpen) {
                line = `<ol><li value="${number}">${lineContent}</li>`;
                olOpen = true;
            } else {
                if (!lines[i + 1].match(/^\d./)) {
                    line = `<li value="${number}">${lineContent}</li></ol>`;
                    olOpen = false;
                } else {
                    line = `<li value="${number}">${lineContent}</li>`;
                }
            }
        } else {
            line = `<p>${line}</p>`;
        }

        let boldTest = line.match(/(\*\*)/g);

        if (boldTest) {
            if (boldTest.length > 1) {
                let bold1 = line.replace(/(\*\*)/, '<b>');
                let outputLine = bold1.replace(/(\*\*)/, '</b>');
                return outputLine;
            } else {
                return line;
            }
        } else {
            return line;
        }
    });

    outputContainer.innerHTML = outputLines.join('\n');
};
