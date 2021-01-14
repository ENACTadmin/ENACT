# ENACT digital platform

The Educational Network for Active Civic Transformation is a national program engaging undergraduates at colleges and universities in state-level legislative change by learning to work with legislators, staffers, and community organizations to advance policy. It is becoming a major voice in addressing challenges to American democracy by engaging young people around the country in civic activism built on knowledge, cooperation, justice and integrity.

Deployed on Heroku domain: [ENACT digital platform](https://www.enactnetwork.org/)

## Login

For a sample tour, login via email: visitor@visitor.com; password: iam&&&avisitor (Remove &&&).

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install ENACT digital platform.

```bash
npm install
```

If you have nodemon installed use nodemon to start:
```bash
nodemon
```
Otherwise:
```bash
npm start
```

For local installation, please remember to:
- have MongoDB pre-installed
- visit localhost:3500, to change port number, go to /bin/www

## Technology stack

- Front End Technologies: <b>EJS/Bootstrap/JQuery/Ajax</b>
- Back End Technologies: <b>Node.js/Express.js/Passport.js</b>
- Database: <b>MongoDB</b>
- Cloud services: <b>AWS S3 Storage, Heroku</b>

## Key Functions

### Full-text Search: implemented using ElasticSearch-styled "inverted index" as data structure behind the scene
```
/resources/search/public/general: full-text search (open to public)
/resources/search/public/advanced: advanced search (open to public)
```

### In-site Messages: in-side messages with email alert
```
/messages/view/all: notification center
...
```

### Resource Management: support basic CRUD, "like" a resource, create collections, share collections
```
/resources/view/favorite: view all favorited resources
/resources/view/private: view all resources uploaded by yourself
...
```

### Course Management: support basic CRUD, join a course, upload documents/videos to courses stored in AWS S3...
```
/courses: course CRUD & view all courses owned or enrolled
/course/view/:courseId: view a specific course
...
```

### Profile Management: support basic CRUD, view faculty profile list
```
/profile/view/:userId: view a specific profile
/profiles/view/faculty: faculty list
...
```

### Events Management: support basic CRUD
```
/events
```
