// File to be used to generate the output of the wiki from the source.
let fs = require('fs-extra');
let snoowrap = require('snoowrap');

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
     * From the provided file, read the file and extract the data, returning a
     * question from the data; initially as a promise.
     *
     * @static
     *
     * @param {File} file - The file to parse from.
     *
     * @returns {Promise} - A promise.
     */
    static parseFromFile(file) {

        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) reject(err);

                // split on #
                let jsonAndText = splitOnce(data, '#');
                let json = jsonAndText[0];
                let text = jsonAndText[1];

                let questionAndAnswer = splitOnce(text, '\n');
                let question = questionAndAnswer[0];
                let answer = questionAndAnswer[1];

                return resolve(new Question(JSON.parse(json), question, answer));
            });
        });
    }

    /**
     * Returns the question title, formatted using markdown.
     *
     * @return {String} - The formatted question title.
     */
    formattedQuestionText() {
        return "##" + this.questionText + "\n";
    }

    /**
     * Gets the category entry for the given category for this question.
     *
     * @param {String} category - the category to retrieve.
     *
     * @returns {Object|String} - the category entry.
     */
    getCategoryEntry(category) {
        return this.metadata.categories.filter(cat => {
            if (typeof cat === "string") {
                return cat === category;
            }
            return cat.name === category;
        })[0];
    }

    /**
     * If the question is in the given category.
     *
     * @param {String} category - the category to search for.
     *
     * @returns {boolean} - If the question is in the given category or not.
     */
    isInCategory(category) {
        return getCategoryEntry(category) != undefined;
    }

    /**
     * Checks the the question has a priority setting for the given category.
     *
     * @param {String} category - the name of the category to search for.
     *
     * @returns {boolean} - Whether the question has a priority setting for the
     * category.
     */
    doesHavePriorityInCategory(category) {
        let categoryEntry = this.getCategoryEntry(category);
        return typeof categoryEntry !== "string" && "priority" in categoryEntry;
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
     * @param {File} file - The file to construct a page from.
     *
     * @returns Page.
     */
     static parseFromFile(file) {
         return new Promise((resolve, reject) => {
             fs.readFile(file, (err, data) => {
                 if (err) reject(err);

                 let jsonAndText = splitOnce(data, '#');
                 let metadata = jsonAndText[0];
                 let text = jsonAndText[1];

                 resolve(new Page(metadata, text));
             });
         });
     }
}

/**
 * Generates the r/SpaceX Wiki & FAQ. Optionally publishes them to r/SpaceX if command
 * line arguments representing the username, password, clientId, and clientSecret
 * are passed in.
 */
let generate = function() {
    // Delete the current output directory if it exists. We want to cleanly
    // generate a new output, instead of overwriting existing documents.
    emptyOutput().then(outcome => {
        return Promise.all([generateFAQ(), generateWiki()]);
    }).then(responses => {
        createOutput(responses);
        publishWiki(responses);
    });
}

/**
 * Deletes the current output directory of the wiki.
 */
let emptyOutput = function() {
    return new Promise((resolve, reject) => {
        fs.emptyDir('./output', err => {
            if (err) reject(err);
            resolve();
        });
    });
}

/**
 * Generates the FAQ portion of the Wiki, and returns the created pages as an array.
 *
 * @param {Object} options - An array of options that
 */
let generateFAQ = function(options) {
    return new Promise((resolve, reject) => {
        fs.readdir('./source/faq', (err, files) => {
            if (err) return reject(err);

            let promises = files.map(file => Question.parseFromFile('./source/faq/' + file));

            Promise.all(promises).then(questions => {
                let sortedCategories = sortQuestionsIntoCategories(questions);

                for (let key in sortedCategories) {
                    sortedCategories[key] = createCategoryString(key, sortedCategories[key]);
                }

                return resolve(sortedCategories);

            });
        });
    });
}

/**
 * Generates the other miscellaneous wiki pages.
 */
let generateWiki = function() {
    return Promise.resolve();
}

/**
 * Creates the outputs of the FAQ & Wiki on disk.
 *
 * @param  {Array} faqAndWikiPages A two-length array, the first containing the FAQ
 * pages in a key:value relationship of title:contents, and the second contanining
 * the Wiki pages in a key:value relationship of url:contents.
 */
let createOutput = function(faqAndWikiPages) {
    let faqPages = faqAndWikiPages[0];
    let wikiPages = faqAndWikiPages[1];

    // Write each FAQ page to disk
    for (let faqPageTitle in faqPages) {
        // Generate from the page title, a location where the file will reside
        // on disk.
        let faqFileTitle = "faq/" + faqPageTitle.toLowerCase().replace(/[\W]/g, "");
        writeFileToOutput(faqFileTitle, faqPages[faqPageTitle]);
    }

    // Write each Wiki page to disk
}

/**
 * [publishWiki description]
 * @return {[type]} [description]
 */
let publishWiki = function() {
    if (process.argv.length > 2) {
        let r = new snoowrap({
            userAgent: 'Publishes the r/SpaceX wiki from GitHub daily.',
            username: process.argv[2],
            password: process.argv[3],
            clientId: process.argv[4],
            clientSecret: process.argv[5]
        });

        //r.getSubreddits('spacex').getWikiPage
    }
}

/**
 * For a given collection of questions, create a string representation of it and return it.
 *
 * @param {String} categoryName - The name of the category.
 * @param {Array} questions - The questions within the category.
 *
 * @returns {String} - the created category string.
 */
let createCategoryString = function(categoryName, questions) {

    let categoryString = `# ${categoryName} \n`;

    questions.forEach(question => {
        categoryString = categoryString.concat(question.formattedQuestionText() + question.answerText + '\n');
    });

    return categoryString;
}

/**
 *
 */
let writeFileToOutput = function(fileName, contents) {
    // If the filename contains a slash, check that the subdirectory exists first.
    let outputDir = './output/';

    new Promise((resolve, reject) => {
        if (fileName.lastIndexOf("/") != -1) {
            let filePath = fileName.slice(0, fileName.lastIndexOf("/"));
            fs.ensureDir(outputDir + filePath, err => {
                if (err) reject();

                return resolve();
            });
        } else {
            return resolve();
        }
    }).then(response => {
        let writeStream = fs.createWriteStream(outputDir + fileName + '.md', { flags: 'a'});
        writeStream.write(contents);
        writeStream.end();
    });
}

/**
 * [sortQuestions description]
 * @param  {[type]} questions [description]
 * @return {[type]}           [description]
 */
let sortQuestionsIntoCategories = function(questions) {
    let categories = [];

    // Push questions into categories
    questions.forEach(question => {
        question.metadata.categories.forEach(category => {

            let categoryName = typeof category === "string" ? category : category.name;

            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }

            categories[categoryName].push(question);

        });
    });

    // Sort categories
    for (let key in categories) {
        categories[key].sort((a, b) => {
            if (a.doesHavePriorityInCategory(key)) {
                if (b.doesHavePriorityInCategory(key)) {
                    return a.getCategoryEntry(key).priority > b.getCategoryEntry(key).priority ? -1 : 1;
                }
                return -1;
            }
            return b.doesHavePriorityInCategory(key) ? 1 : 0;
        });
    }

    return categories;
}

/**
 * [pageAddendum description]
 * @param  {[type]} writeStream [description]
 * @return {[type]}             [description]
 */
let pageAddendum = function(writeStream) {

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
