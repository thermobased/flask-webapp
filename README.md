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

## Building

Build frontend typescript code and bundle it with dependencies to `static/js/`:

```sh
npm run make-static
```

## Running

1. To initialize the database, run the `./create-db.sh` script.

2. Run flask all from within python virtualenv:

   ```sh
   # Run webserver
   flask --app main run
   ```

## Development

You can add `strict: true` to tsconfig.json to make your compilation stricter.
