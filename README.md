# be-nc-news

Welcome to NC-News! This project is the back-end to an API for _Northcoders News_. 
It includes a server with a variety of [endpoints](https://github.com/Hana008/be-nc-news/blob/master/endpoints.json) and a relational database.
The server utilises an __MVC pattern__.
All endpoints and utility functions have been tested using __full TDD__.
This project is hosted using [Heroku](https://nc-news-ltd.herokuapp.com/)

## Getting started

### Installing

clone and open this repository

```
git clone https://github.com/Hana008/be-nc-news
cd be-nc-news
code .
```

install all dependencies

```
npm install
```

### Running the tests

to run app tests

```
npm test
```
to run utility function tests

```
npm test
```

### How to create `knexfile.js`

__Step one:__ state which environment you will utilise

```
const ENV = process.env.NODE_ENV || 'development';
```
(NODE_ENV has been set to test, in the scripts, only when you run npm test)


__Step two:__ create your base configuration

```
const baseConfig = {
  client: 'pg', // the client adapter being used
  migrations: {       //where migrations tables are located
    directory: './db/migrations' 
  },
  seeds: {    //where seeding function is located
    directory: './db/seeds'
  }
};
```

__Step three:__ create your custom configuration 

```
const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // user,
      // password
    }
  }
};
```
(if you are using linux, provide your username and password where indicated)

__Step four:__ export your configuration objects as one

```
module.exports = { ...customConfig[ENV], ...baseConfig }; //(instructions to export test or development `customConfig` depending on ENV value)

```
