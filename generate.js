// File to be used to generate the output of the wiki from the source.
const fs = require('fs-extra');
const path = require('path');
const snoowrap = require('snoowrap');

/**
 * Represents a question from the FAQ. Is only used temporarily before the FAQ pages
 * are created.
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
        this.questionText = questionText.trim();
        this.answerText = answerText.trim();
    }

    /**
     * From the provided file, read the file and extract the data, returning a
     * question from the data; initially as a promise.
     *
     * @static
     *
     * @param {File} file - The file to parse from.
     *
     * @returns {Promise} - A promise that resolves to a question.
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
     * Returns the question, formatted using markdown.
     *
     * @return {String} - The formatted question.
     */
    formattedQuestionText() {
        return "## " + this.questionText + "\n\n";
    }

    /**
     * Returnd the answer, formatted using markdown.
     *
     * @return {String} - The formatted answer.
     */
    formattedAnswerText() {
        return this.answerText + "\n\n";
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
 * Represents an abstract page, which can either be written to disk or submitted
 * to reddit.
 */
class Page {

    /**
     * Constructs a Page object.
     *
     * @param {object} metadata - A JSON object of the file metadata.
     * @param {string} title - The title of the page.
     * @param {string} text - The contents of the page.
     */
    constructor(metadata, title, text) {
        this.metadata = metadata;
        this.title = title.trim();
        this.text = text.trim();
    }

    /**
     * Returns a promise which resolves to a page object for a given file.
     *
     * It is presumed that any file which is parsed in has the following three
     * sections present: a snippet of JSON metadata at the top of the file,
     * a <h1> title in markdown, and a content section; in that order.
     *
     * @static
     *
     * @param {File} file - The file to construct a page from.
     *
     * @returns {Promise} - A promise which resolves to a page.
     */
     static parseFromFile(file) {
         return new Promise((resolve, reject) => {
             fs.readFile(file, 'utf8', (err, data) => {
                 if (err) reject(err);

                 let jsonAndText = splitOnce(data, '#');
                 let metadata = jsonAndText[0];

                 let titleAndContents = splitOnce(jsonAndText[1], '\n');
                 let title = titleAndContents[0];
                 let contents = titleAndContents[1];

                 resolve(new Page(JSON.parse(metadata), title, contents));
             });
         });
     }

     /**
      * Returns the URL for the page, as found in the r/SpaceX wiki.
      *
      * If there is a location field in the provided metadata, that is returned. If
      * this does not exist, the title is simply used. In both instances, the strings
      * are converted to lowercase, spaces are converted to dashes, and only alphanumeric
      * characters are allowed to remain.
      *
      * @returns {String} - the URL for the page.
      */
     url() {
         if (this.metadata && this.metadata.location) {
             return this.metadata.location
                .toLowerCase().replace(/[^A-Za-z0-9/-\s]/g, "").replace(/\s+/g, "-");
         }
         return 'faq/' + this.title
            .toLowerCase().replace(/[^A-Za-z0-9/-\s]/g, "").replace(/\s+/g, "-");
     }


     /**
      * Returns the filename for the page, as found on GitHub.
      *
      * If there is a location field in the provided metadata, that is returned. If
      * this does not exist, the title is simply used.
      *
      * @returns {String} - The filename for the page.
      */
     filepath() {
         if (this.metadata && this.metadata.location) {
             return this.metadata.location;
         }
         return 'FAQ/' + this.title;
     }

     /**
      *
      */
     contents() {
         return "# " + this.title + "\n\n" + this.text;
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
 *
 * @returns {Promise} - A promise that resolves when the output directory is
 * emptied.
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
 * @returns {Promise} - A promise that resolves to an array of category pages.
 */
let generateFAQ = function() {
    return new Promise((resolve, reject) => {
        fs.readdir('./source/faq', (err, files) => {
            if (err) return reject(err);

            let promises = files.map(file => Question.parseFromFile('./source/faq/' + file));

            Promise.all(promises).then(questions => {
                return resolve(createCategoryPages(questions));
            });
        });
    });
}

/**
 * Generates the other miscellaneous wiki pages, returning the Wiki.
 *
 * @returns {Promise} - A promise that resolves to an array of wiki pages.
 */
let generateWiki = function() {

    let onlyMarkdownFilesFn = function(item) {
        // Ensure only markdown files and directories are searched
        return [".md", ""].includes(path.extname(item))
        // Exclude directories that have the phrase 'faq' within
        && path.relative('.', item).indexOf("FAQ") === -1
        // Exclude hidden directories and files
        && (path.basename(item) === "." || path.basename(item)[0] !== ".");
    }

    return new Promise((resolve, reject) => {
        let items = [];
        fs.walk('./source', { filter: onlyMarkdownFilesFn }).on('data', item => {
            items.push(item);
        }).on('end', () => {
            // Filter does not remove root directory, we must do this outselves.
            // https://github.com/jprichardson/node-klaw/issues/11
            // Also, it is easiest to remove directories here.
            items = items.filter(item => {
                return !item.stats.isDirectory();
            });

            let promises = items.map(item => Page.parseFromFile(item.path));

            Promise.all(promises).then(questions => {
                return resolve(questions);
            });
        });
    });
}

/**
 * Creates the outputs of the FAQ & Wiki on disk.
 *
 * @param  {Array} faqAndWikiPages A two-length array, the first element containing
 * an array of Pages for the FAQ, and the second containing an array of Pages for
 * the Wiki.
 */
let createOutput = function(faqAndWikiPages) {
    let faqPages = faqAndWikiPages[0];
    let wikiPages = faqAndWikiPages[1];

    let pages = faqPages.concat(wikiPages);

    pages.forEach(page => {
        writePageToOutput(page);
    });
}

/**
 * [publishWiki description]
 * @return {[type]} [description]
 */
let publishWiki = function(faqAndWikiPages) {
    if (process.argv.length > 2) {
        let r = new snoowrap({
            userAgent: 'Publishes the r/SpaceX wiki from GitHub daily.',
            username: process.argv[2],
            password: process.argv[3],
            clientId: process.argv[4],
            clientSecret: process.argv[5]
        });

        let faqPages = faqAndWikiPages[0];
        let wikiPages = faqAndWikiPages[1];

        let pages = faqPages.concat(wikiPages);

        (function publishPageToWiki(i) {
            setTimeout(() => {

                // Publish the page to reddit
                r.getSubreddit('spacex').getWikiPage(pages[i].url()).edit({
                    text: pages[i].contents(),
                    reason: 'Daily automated publish for ' + new Date(Date.now()).toISOString()
                }).then(() => {
                    console.log("Page complete: " + pages[i].url());
                });

                // Continue iterating through the loop
                if (--i) {
                    publishPageToWiki(i);
                }
            }, 3000);
        })(pages.length - 1);

    }
}

/**
 * For a given page, commit it to disk. Writes to the output folder.
 *
 * @param {Page} page - The page to be committed to disk.
 */
let writePageToOutput = function(page) {
    let outputDir = './output/';

    new Promise((resolve, reject) => {
        // If the filename contains a slash, check that the subdirectory exists first.
        if (page.filepath().lastIndexOf("/") != -1) {
            let filePath = page.filepath().slice(0, page.filepath().lastIndexOf("/"));
            fs.ensureDir(outputDir + filePath, err => {
                if (err) reject();
                return resolve();
            });
        } else {
            return resolve();
        }

    }).then(response => {
        let writeStream = fs.createWriteStream(outputDir + page.filepath() + '.md', { flags: 'a'});
        // note to alter links inside content depending on final destination (github/reddit)
        writeStream.write(page.contents());
        writeStream.end();
    });
}

/**
 * For the questions provided, generate pages for the categories that the questions
 * sit in.
 *
 * Firstly constructs a list of categories, and inserts the relevant questions into
 * each category array. Then, based on the priority of questions within the category,
 * orders them. Finally, constructs a Page for each category based on the data provided.
 *
 * @param  {Array} questions - The questions to generate category pages from.
 *
 * @return {Array} - An array of category pages.
 */
let createCategoryPages = function(questions) {
    let categories = [];

   // Push questions into categories
    questions.forEach(question => {
        question.metadata.categories.forEach(categoryMetadata => {

            let categoryName = typeof categoryMetadata === "string" ? categoryMetadata : categoryMetadata.name;

            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }

            categories[categoryName].push(question);

        });
    });

    // Sort category questions
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

    // Create pages from category questions
    let pages = [];

    let mergeQuestionsFn = function(a, b) {
        return a + b.formattedQuestionText() + b.formattedAnswerText();
    }

    for (let key in categories) {
        let pageContents = categories[key].reduce(mergeQuestionsFn, "");
        pages.push(new Page({}, key, pageContents));
    }

    return pages;
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
 * @return {Array}            An array of split components.
 */
let splitOnce = function(string, delimiter) {
    var i = string.indexOf(delimiter);
    return [string.slice(0, i), string.slice(i+1)];
}

generate();
