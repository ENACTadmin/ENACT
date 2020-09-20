# ENACT digital platform

The Educational Network for Active Civic Transformation is a national program engaging undergraduates at colleges and universities in state-level legislative change by learning to work with legislators, staffers, and community organizations to advance policy. It is becoming a major voice in addressing challenges to American democracy by engaging young people around the country in civic activism built on knowledge, cooperation, justice and integrity.

Deployed on Heroku domain: [ENACT digital platform](https://enact-brandeis.herokuapp.com/)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install ENACT digital platform.

```bash
npm install
```

```bash
npm start
```

or

```bash
nodemon
```
if you have nodemon installed.

For local installation, please remember to:
- have MongoDB pre-installed
- go to localhost:3500 as the port was pre-set to 3500

## Technology stack

Front End Technologies: EJS/Bootstrap/Jquery/Ajax
<br>
Back End Technologies: Node.js/Express.js
<br>
Database: MongoDB
<br>
Cloud services: AWS S3 Storage, Heroku, 


## Search

### Full-text Search: implemented using Elasticsearch-styled "inverted index" as data structure behind the scene
```
/resources/search/public/general: full-text search for public usage
/resources/search/public/advanced: advanced search for public usage
/resources/search/private/general: full-text search for logged in members
/resources/search/private/advanced: advanced search for logged in members
```

## Usage

Passport auth is used to login, a local strategy and a google auth strategy were used.
