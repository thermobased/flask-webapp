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

## Running

From within python virtualenv:

```
flask --app main run
```
