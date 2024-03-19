[![example workflow](https://github.com/thermobased/flask-webapp/actions/workflows/python-package.yml/badge.svg)](https://github.com/thermobased/flask-webapp/actions)

## Dependencies

We virtualenv to reproduce Python development environment, the list of
dependency packages is in requirements.txt. To get the development environment,
do

```sh
# Create virtualenv (do this step only once)
python -m venv .venv

# Enter the virtualenv
source .venv/bin/activate
# Install requirements inside virtualenv
pip install -r requirements.txt
```

## Database

To initialize the database, run the `./create-db.sh` script.

## Running

From within python virtualenv:

```
tsc --target ES2015 static/js/*.ts
flask --app main run
```
