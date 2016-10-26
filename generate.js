// File to be used to generate the output of the wiki from the source.
let fs = require('fs');

/**
 * Represents a question from the FAQ.
 */
class Question {

    /**
     * Constructs a Question object.
     *
     * @param {object} metadata - A JSON object of the file metadata.
     * @param {string} questionText - The question title.
     * @param {string} answerText - The answer title.
     */
    constructor(metadata, questionText, answerText) {
        this.metadata = metadata;
        this.questionText = questionText;
        this.answerText = answerText;
    }

    /**
     * Returns a question object from a given file.
     *
     * @static
     *
     * @returns {Question} A Question Object.
     */
    static parseFromFile(file) {
        let data = fs.readFileSync(file, 'utf8');

        // split on #
        let jsonAndText = splitOnce(data, '#');
        let json = jsonAndText[0];
        let text = jsonAndText[1];

        let questionAndAnswer = splitOnce(text, '\n');
        let question = questionAndAnswer[0];
        let answer = questionAndAnswer[1];

        return new Question(JSON.parse(json), question, answer);
    }

    /**
     * Returns the question title, formatted using markdown.
     */
    formattedQuestionText() {
        return "#" + this.questionText + "\n";
    }
}

/**
 *
 */
class Page {
    constructor(metadata, text) {
        this.metadata = metadata;
        this.text = text;
    }

    /**
     * Returns a page object for a given file.
     *
     * @static
     *
     * @returns Page.
     */
     static parseFromFile(file) {
         fs.readFile(file, (err, data) => {

         });
     }
}

/**
 * Generates the r/SpaceX Wiki & FAQ.
 */
let generate = function() {

    deleteCurrentOutput();

    fs.readdir('./source/faq', (err, files) => {
        let questions = files.map(file => Question.parseFromFile('./source/faq/' + file));

        questions.forEach(question => {
            writeQuestionToDisk(question);
        })
    });
}

let deleteCurrentOutput = function() {

}

/**
 * For a given question, write it to its appropriate categories.
 *
 * @param {question} question The question to write to disk.
 *
 * @return {void}
 */
let writeQuestionToDisk = function(question) {
    let categoriesForQuestion = question.metadata.categories;

    categoriesForQuestion.forEach(category => {
        let writeStream = fs.createWriteStream('./output/' + category + '.md', { flags: 'a'});
        writeStream.write(question.formattedQuestionText() + question.answerText + '\n');
        writeStream.end();
    });
}

/**
 * For a given string, split it once on the given delimiter; returning an array
 * of length 2.
 *
 * @param  {String} string    The string to be split.
 * @param  {String} delimiter The delimiter to split on.
 *
 * @return {String[]}         An array of split components.
 */
let splitOnce = function(string, delimiter) {
    var i = string.indexOf(delimiter);
    return [string.slice(0, i), string.slice(i+1)];
}

generate();
