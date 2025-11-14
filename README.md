# GW Lab - Viterbi module

GW Lab Viterbi module for running viterbi jobs from the web.

## Requirements before you start

* Python 3.12+ with the virtualenv module installed
* Node Version Manager ([NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)) installed
* In some instances `npm run relay` may raise an error that requires the `watchman` package to be installed.

## Project Structure

There are two "projects" contained in this repository - one for the Django project (backend), and one for the React project (frontend).

The frontend is in `src/react/` and the backend is in `src/`

## Project Setup

### Python/Django setup

Set up the virtual environments for GW Lab Viterbi:

```bash
cd src/
virtualenv -p python3.12 venv # or whatever version of python you have installed > 3.12
source venv/bin/activate
pip install -r requirements.txt
python development-manage.py migrate
```

#### MySQL

If you want to use actual data, you will need to install and configure mysql as well.

```bash
sudo apt-get install mysql-client mysql-server
```

* Install the mysqlclient python package (note - you may need to install additional system packages for this to work)
* Create schema in mysql : `gwlab_viterbi`
* Create mysql user and grant it all privileges on that schema
* Add a local settings file at `src/gw_viterbi/local.py` and add a `DATABASES=` section defining the mysql connection (see `environment.py` in that directory for an example)
* Migrate the database

```bash
# Inside the venv
python development-manage.py migrate
```

### Frontend

Set up the node environments:

```bash
cd src/react/
nvm install $(cat .nvmrc)
nvm use $(cat .nvmrc)
npm install
```

## Running the project

You will need to run in three separate terminals - one for the django server, one for the react dev-server, and optionally redis/celery if needed.

### Django

```bash
cd src
. venv/bin/activate
python development-manage.py runserver 8000
```

### React

```bash
cd src/react
npm run dev
```

### Build GraphQL Schema

Any time changes are made to the graphene schema in python, you need to rebuild the graphql schema for javascript:

```bash
cd src/
. venv/bin/activate
python development-manage.py graphql_schema
```

### Build GraphQL Queries

Any time changes are made to the javascript graphql queries, you need to rebuild the graphql query files:

```bash
cd src/react
npm run relay
```
