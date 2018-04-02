# zenColor E-Commerce Server Code


## Installation
Before you can use the API:
<ol>
<li>[install mongodb](https://www.mongodb.com/download-center#community)</li>
<li>[install node.js](https://nodejs.org/en/download/)</li>
<li>install dependencies (see below)</li>
<li>set-up database (see below)</li>
<li>npm start(see below)</li>
</ol>

```shell
$ npm install
$ npm run build
$ npm start
```
## To update apidoc, run command:
$ npm run update-apidoc

Default local http port for dev is 3010.  If security is turned on in your config file, you must include an access token in all requests.
You'll find the list of URLs in the [/api/routes](./api/routes/) files.  Those URLs are mapped to base URLs in [server.js](./server.js).
Default configuration values for server port, secret key, timeouts, etc. are defined in the [/config](./config/) module.

## Development
You can control local settings via the config module development module.
All modules and functionality should be supported by a test script.  Test scripts are in the 'test' folder.
Always write and run tests prior to committing to the repo.  To run tests:

```shell
$ npm test
```

## Folder structure

[server.js](./server.js) - HTTP server

[/api](./api/) - code for HTTP endpoints

[/api/routes](./api/routes/) - exports routes for use by server.js

[/api/models](./api/models/) - database/data model scripts

[/api/controllers](./api/controllers/) - actual functionality for routes and routines

[/config](./config/) - config settings - development and production

[/middleware](./middleware/) - middleware modules for securing endpoints, etc

[/mongo](./mongo/) - helper object for talking to mongo db

[/test](./test/) - test scripts

## Database structure
The mongodb collections and record properties are defined in [data-model.md](./data-model.md)
