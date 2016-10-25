# The r/SpaceX Wiki & FAQ

This repository holds the source for the full, currently up-to-date version of the [r/SpaceX subreddit](https://reddit.com/r/spacex) Wiki & FAQ. We have chosen to move to an external version control for a number of reasons:

* This helps us improve the transparency of the contributions made to the wiki.
* It lowers the barrier to entry for contributions, and allows us to draw those contributions from a wider range of sources.
* It improves the visibility of the material contained within.
* It provides platform independence away from Reddit, ensuring the knowledge assembled here can be distributed openly and freely.

## Users Guide

### Repository Layout

This repository is split into two main sections. The `source` directory contains all the metadata and content that you should add to and make changes in. The `output` directory contains the distributable Wiki & FAQ, and is included for sharing & distribution purposes only. You should not edit this directory as your changes will not be accepted and will be overwritten. You can autogenerate the `output` directory yourself by running `node generate.js` from Terminal on a Mac/Linux machine, or Command Prompt on a Windows machine, provided you have [Node.js](https://nodejs.org) installed.

Within the `source` directory, you will find markdown files, each corresponding to a wiki page, within the `faq` directory, you will find the FAQ questions, each with their own markdown file.

, you will find the `faq` directory, where each question has its own markdown file. To add a new question to the FAQ, please create a file with the question title as the filename. Be sure to include the snippet of JSON that other source files include:

    {
        "type":"question|page",         // String.
        "categories": ["foo", "bar"]    // String[]. Only applicable to questions.
        "url": "baz",                   // String. Only applicable to pages.
        "notes": ["Too long"]           // String[]. A list of remarks about the file.
    }

This identifier helps the automated script determine where questions should be placed within the FAQ, and where pages should be placed within the Wiki. The `categories` array should represent a list of pages that the question fits under in the FAQ. The `url` string contains the location for a page within the wiki. Do not prefix this with a leading slash.

### Contributing

Anyone can contribute to this repository to help improve the content within. We will accept all edits, additions, and improvement provided they are sourced (either in your diff, or in the description of your commit), and are not structural in nature. Please ensure your changes are sourced, contain correct spelling and grammar, are written in a neutral manner, and that you agree to the licensing terms of this repository and acknowledge that your changes will be submitted into the public domain.

To contribute, simply fork `master`, perform your changes, then submit a pull request here with a description of your changes. Your request will be merged, then nightly at 00:00UTC, an automated script will run and copy the current output of this project into the r/SpaceX wiki.

When you add a new question to the FAQ, ensure the file is created with the question title as the filename. Be sure to include the snippet of JSON at the top that other source files include:


### Contact Others

If you need to make an urgent request concerning this repository, you can contact [the moderators of the r/SpaceX community here](https://www.reddit.com/message/compose?to=%2Fr%2Fspacex).

## Authors

Luke Davia (LukeNZ).

## License

All contributions and content within this repository are licensed under [CC0](https://wiki.creativecommons.org/wiki/CC0). We appreciate attribution, but do not require it.
