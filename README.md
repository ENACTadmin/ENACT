# ENACT digital platform

The Educational Network for Active Civic Transformation is a national program engaging undergraduates at colleges and universities in state-level legislative change by learning to work with legislators, staffers, and community organizations to advance policy. It is becoming a major voice in addressing challenges to American democracy by engaging young people around the country in civic activism built on knowledge, cooperation, justice and integrity.

This project is built in EJS/Express/MongoDB

Link: [ENACT digital platform](https://enact-brandeis.herokuapp.com/)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install ENACT digital platform.

```bash
npm install
```

## Search

### Full-text Search: implemented using ElasticSearch-styled "inverted index" as data structure behind the scene
```
/resources/search/public/general: full-text search for public usage
/resources/search/public/advanced: advanced search for public usage
/resources/search/private/general: full-text search for logged in members
/resources/search/private/advanced: advanced search for logged in members
```

## Usage

Passport auth is used to login, a local strategy and a google auth strategy were used.
