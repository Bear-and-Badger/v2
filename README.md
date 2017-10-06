# Bear and Badger V2

This is a rewrite of the original Bear and Badger forum, based on [AdonisJS](https://adonisjs.com/) with an aim for simplicity & speed.

System requirements:

1. NodeJs >= 8.x
2. NPM >= 3.x
3. MySQL

## Setup

1. Clone this repository and `cd` into the root directory.

2. Install JS dependencies and the Adonis command line interface

```bash
npm install
npm install -g @adonisjs/cli
```

3. Copy `.env.example` to `.env`, and configure to use appropriate database settings for your MySQL installation.

4. Run database migrations and import initial seed data

```bash
adonis migration:run
adonis seed
```

5. Fire up the Adonis dev server

```bash
adonis serve --dev
```

You should now be able to navigate to the site at `http://localhost:3333/`. Hurrah! Go ahead and signup as a new user to test out all of the functionality.

### Development

Devlopment of this is relatively adhoc. Tickets should be created for all major features. Pull requests will need to be reviewed before being accepted. 

The core framework is AdonisJS 4.0. This is currently a 'dev' release (although the API is stable). Documentation can be found at [http://dev.adonisjs.com/docs/4.0/](http://dev.adonisjs.com/docs/4.0/) 

Testing is currently AWOL but will become mandatory as soon as is feasible
