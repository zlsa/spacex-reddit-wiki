# The r/SpaceX Wiki & FAQ

| [Browse it](https://github.com/LukeNZ/spacex-reddit-wiki/tree/master/output) | [Edit it](https://github.com/LukeNZ/spacex-reddit-wiki/tree/master/source) |
|----|----|

This repository holds the source for the full, currently up-to-date version of the [r/SpaceX subreddit](https://reddit.com/r/spacex) Wiki & FAQ. We have chosen to move to an external version control for a number of reasons:

* This helps us improve the transparency of the contributions made to the wiki.
* It lowers the barrier to entry for contributions, and allows us to draw those contributions from a wider range of sources.
* It improves the visibility of the material contained within.
* It provides platform independence away from Reddit, ensuring the knowledge assembled here can be distributed openly and freely.

## Users Guide

### Repository Layout

This repository is split into two main sections.

* **The `source` directory** contains all the metadata and content that you should add to and make changes in.

* **The `output` directory** contains the distributable Wiki & FAQ sections and is a one to one reproduction of the Wiki & FAQ found on r/SpaceX. It is included in this repository for sharing & distribution purposes only. You should not edit this directory, as your changes will not be accepted and will be overwritten.

You can autogenerate the `output` directory yourself by running `node generate.js` from Terminal on a Mac/Linux machine, or Command Prompt on a Windows machine, provided you have [Node.js](https://nodejs.org) installed.

Within the `source` directory, you will find markdown files, each corresponding to a wiki page, within the `faq` directory, you will find the FAQ questions, each with their own markdown file.

### Contributing

Anyone can contribute to this repository to help improve the content within. We will accept all edits, additions, and improvement provided they are sourced (either in your diff, or in the description of your commit), and are not structural in nature. Please ensure your changes are sourced, contain correct spelling and grammar, are written in a neutral manner, and that you agree to the licensing terms of this repository and acknowledge that your changes will be submitted into the public domain.

When you add a new question to the FAQ, ensure the file is created with the question title as the filename. When you add a new page to the Wiki, ensure the page title is roughly in keeping with the intent of the page. In both cases, be sure to include the JSON snippet at the top of the page, described below.

#### If you have edit rights (r/SpaceX moderators)

To contribute, find the file you are looking to edit, and click the pencil with the label "edit this file". Provide your commit title and description, and click the green "Commit Changes" button. To create a file, navigate to the directory you would like your file to be created in, and click "Create New File" in the upper right hand corner.

#### If you do not have edit rights

To contribute, simply fork `master`, perform your changes, then submit a pull request here with a description of your changes. Your request will be merged, then nightly at 00:00UTC, an automated script will run and copy the current output of this project into the r/SpaceX wiki.

### Metadata

At the top of each page and question in the source of this wiki is a small JSON snippet, this identifier helps the automated script determine where questions should be placed within the FAQ, and where pages should be placed within the Wiki. The syntax of this snippet is described below.

    {      
        "categories": [
            "foo",
            {
                "name": "bar",
                "priority": 100
            }
        ],
        "location": "Baz Qux",           
        "notes": ["Too long"]           
    }

#### `categories` (Questions Only)

`Array` of either `String` or `Object`. This represents a list of pages that the question fits under in the FAQ. If it is a string, it is simply the name of the page in the FAQ. If it is an object, it contains two keys: `name` is the name of the page in the FAQ, and `priority` is a value which is used to sort the questions in descending order; highest priority questions will be placed at the top of the FAQ page. If no priority is specified, they will be placed last in the FAQ page and ordered alphabetically.

#### `location` (Pages Only)

`String` describing the location of the page within the wiki, including the name of the file, but excluding the file's extension. Do not prefix this with a leading slash.

#### `notes`

`Array` of `String`, human readable notes about the current file.

### Style Guide

* Note the distinction between article and product. "Falcon" and "Dragon". Not "The Falcon" or "A Dragon".
* Shorten Reddit links using Reddit's link shortening service, shorten other links longer than 50 characters using Google's link shortening service.
* Use correct symbols, "∆V" not "delta V".

### Contact Others

If you need to make an urgent request concerning this repository, you can contact [the moderators of the r/SpaceX community here](https://www.reddit.com/message/compose?to=%2Fr%2Fspacex).

## Authors

Luke Davia (LukeNZ).

## License

All contributions and content within this repository are licensed under [CC0](https://wiki.creativecommons.org/wiki/CC0). We appreciate attribution, but do not require it.
