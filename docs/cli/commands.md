# Available commands


## `pyblade init`

Creates a new PyBlade-powered project with the necessary initial directory structure and your preferred  framemework configuration.

#### Usage:
```bash
pyblade init
```

#### Common Issues & Troubleshooting:
- Error: "Permission denied"  
  Solution: Ensure you have the correct permissions to create directories or run the command with elevated privileges using `sudo`.


## `pyblade serve`

Starts the PyBlade development server, allowing you to preview your project locally.

### Usage
```bash
pyblade serve [--host <host>] [--port <port>] [--debug]
```

#### Options
`--host` : The host address to run the server on (default: `127.0.0.1`)

`--port` : The port number to run the server on (default: `8000`).

`--debug`: Enable debug mode for more detailed logging.


#### Aliases
- `pyblade runserver`

#### Examples
```bash
pyblade serve --host 0.0.0.0 --port 5000
```
This starts the development server at `0.0.0.0:5000`.

```bash
pyblade serve --debug
```
This starts the server with debug mode enabled.

#### Common Issues & Troubleshooting
- Error: "Address already in use"  
  Solution: Check if another process is using the default port (8000). You can stop that process or specify a different port using the `--port` option.


## `pyblade convert`

Migrates existing Django templates to the PyBlade templates by replacing Django Template tags and filters with their PyBlade equivalent.

#### Usage
```bash
pyblade convert
```

#### Examples:
```bash
pyblade convert
```

This will scan your Django templates and convert them into PyBlade-compatible templates.

#### Common Issues & Troubleshooting:
- **Error: "Template parsing failed"**  
  **Solution**: Ensure the original Django templates follow valid syntax and avoid non-standard template tags.

## `pyblade make:template`

Generates a new PyBlade template.

#### Usage
```bash
pyblade make:component <name>  [-f | --force] 
```

### Arguments
`name`: The name of the component to generate.

### Options
`-f, --force`: Override the template if already exists.

### Aliases
``pyblade maketemplate

#### Examples:
```bash
pyblade make:template home
```

This creates a new `tempalates/home.html` PyBlade component file.

#### Common Issues & Troubleshooting:
- Error: "Component already exists"  
  Solution: Check the `templates/components` directory to see if a componenet with the same name (_kebab-cased_) already exists. You can either override the existing component by using the `--force` option or choose a different name.

Here’s the full documentation for all the commands you listed, using the same structure and tone as your `make:template` example:

## `pyblade make:component`

Generates a new PyBlade component. These components are reusable UI elements that can be embedded in templates.

#### Usage
```bash
pyblade make:component <name>  [-f | --force] 
```

### Arguments
`name`: The name of the component to generate..

### Options
`-f, --force`: Override the component if already exists.


#### Examples:
```bash
pyblade make:component alert-box
```

This creates a new `tempalates/components/alert-box.html` PyBlade component file.

#### Common Issues & Troubleshooting:
- Error: "Component already exists"  
  Solution: Check the `templates/components` directory to see if a componenet with the same name (_kebab-cased_) already exists. You can either override the existing component by using the `--force` option or choose a different name.

Visit [PyBlade Components]("/components") to learn more about them. 


## `pyblade make:liveblade`

Creates a new Liveblade component for reactive UI rendering.

#### Usage
```bash
pyblade make:liveblade <name> [-f | --force]
```

### Arguments
`name`: The _CamelCased_ name of the Liveblade component.

### Options
`-f, --force`: Overwrite the component if it already exists.

#### Examples:
```bash
pyblade make:liveblade counter
```

#### Common Issues & Troubleshooting:
- **LiveBlade component name conflict**  
  Use `--force` or change the name.

---

## `pyblade make:messages`

Scans source files and creates or updates `.po` translation message files.

#### Usage
```bash
pyblade make:messages
```

#### Examples:
```bash
pyblade make:messages
```

---

## `pyblade make:migrations`

Creates new migration files based on model changes.

#### Usage
```bash
pyblade make:migrations
```

#### Examples:
```bash
pyblade make:migrations
```

---

## `pyblade app:start`

Creates a new Django app within the current project.

#### Usage
```bash
pyblade app:start <app-name>
```

### Arguments
`app-name`: The name of the new Django app.

#### Examples:
```bash
pyblade app:start blog
```

#### Common Issues & Troubleshooting:
- **App name conflict**  
  Make sure no other app with the same name exists in the project directory.

---

## `pyblade compile:messages`

Compiles translation message files into `.mo` files.

#### Usage
```bash
pyblade compile:messages
```

#### Examples:
```bash
pyblade compile:messages
```

#### Common Issues & Troubleshooting:
- **Missing `.po` files**  
  Run `make:messages` first to generate translation files.

---

## `pyblade db:migrate`

Applies all database migrations.

#### Usage
```bash
pyblade db:migrate
```

#### Examples:
```bash
pyblade db:migrate
```

#### Common Issues & Troubleshooting:
- **Migration errors**  
  Check your models and run `make:migrations` before applying changes.

---

## `pyblade db:shell`

Launches an interactive database shell.

#### Usage
```bash
pyblade db:shell
```

#### Examples:
```bash
pyblade db:shell
```

---


## `pyblade shell`

Starts an interactive Python shell with Django context loaded.

#### Usage
```bash
pyblade shell
```

#### Examples:
```bash
pyblade shell
```

---

## `pyblade static:collect`

Collects all static files into a single location (typically for deployment).

#### Usage
```bash
pyblade static:collect
```

#### Examples:
```bash
pyblade static:collect
```

#### Common Issues & Troubleshooting:
- **Permissions error**  
  Ensure you have write access to the `STATIC_ROOT` directory.


## `pyblade startapp`

Creates a new Django app within an existing project.

#### Usage
```bash
pyblade startapp <app-name>
```

### Arguments
`app-name`: The name of the new app.

#### Examples:
```bash
pyblade startapp blog
```

This will create a new app directory with models, views, and other standard files.

---

## `pyblade makemigrations`

Generates migration files for model changes in your Django apps.

#### Usage
```bash
pyblade makemigrations [<app-name>]
```

### Arguments
`app-name` _(optional)_: Specify an app to create migrations for.

#### Examples:
```bash
pyblade makemigrations
pyblade makemigrations accounts
```

---

## `pyblade migrate`

Applies all unapplied migrations to the database.

#### Usage
```bash
pyblade migrate
```

#### Examples:
```bash
pyblade migrate
```

This synchronizes your database schema with the current set of models and migrations.

---

## `pyblade createsuperuser`

Creates a superuser account to access the Django admin interface.

#### Usage
```bash
pyblade createsuperuser
```

#### Examples:
```bash
pyblade createsuperuser
```

You will be prompted to enter a username, email, and password interactively.

---

## `pyblade collectstatic`

Collects all static files from apps and places them into the static root directory.

#### Usage
```bash
pyblade collectstatic
```

#### Examples:
```bash
pyblade collectstatic
```

Used primarily for preparing static assets before deployment.


## `pyblade shell`

Opens the Django interactive shell with your project's context loaded.

#### Usage
```bash
pyblade shell
```

#### Examples:
```bash
pyblade shell
```

This shell is preloaded with Django settings and all models, making it ideal for testing queries.

---

## `pyblade test`

Runs the test suite for your Django apps.

#### Usage
```bash
pyblade test [<app-name>]
```

### Arguments
`app-name` _(optional)_: Run tests for a specific app only.

#### Examples:
```bash
pyblade test
pyblade test blog
```


## `pyblade update`

Updates PyBlade to the latest available version.

#### Usage
```bash
pyblade update
```

#### Examples:
```bash
pyblade update
```

This fetches and installs the latest release of PyBlade.

#### Common Issues & Troubleshooting:
- **Permission denied**  
  Try using `sudo` if installing globally.

---

## `pyblade info`

Displays information about the current PyBlade project and environment.

#### Usage
```bash
pyblade info
```

#### Examples:
```bash
pyblade info
```

Outputs details such as framework version, project name, and environment configuration.

---

## `pyblade docs`

Opens the PyBlade CLI documentation in your default browser.

#### Usage
```bash
pyblade docs
```

#### Examples:
```bash
pyblade docs
```

---

## `pyblade make:model`

Creates a new Django model class inside an app.

#### Usage
```bash
pyblade make:model <name> [--app <app-name>]
```

### Arguments
`name`: Name of the model.

### Options
`--app`: The Django app where the model should be created.

#### Examples:
```bash
pyblade make:model Post --app blog
```

Creates a `Post` model inside the `blog/models.py` file.

---

## `pyblade make:form`

Generates a new Django `Form` class.

#### Usage
```bash
pyblade make:form <name> [--app <app-name>]
```

### Arguments
`name`: Name of the form.

### Options
`--app`: The Django app where the form should be created.

#### Examples:
```bash
pyblade make:form ContactForm --app core
```

Creates a `ContactForm` in `core/forms.py`.

---

## `pyblade make:migration`

Creates a new blank migration file.

#### Usage
```bash
pyblade make:migration [<app-name>]
```

### Arguments
`app-name` _(optional)_: The Django app to generate the migration for.

#### Examples:
```bash
pyblade make:migration
pyblade make:migration accounts
```

Use this when you need to write a custom migration manually.

---

## `pyblade route:list`

Displays a list of all registered routes in the application.

#### Usage
```bash
pyblade route:list
```

#### Examples:
```bash
pyblade route:list
```

Useful for debugging route definitions and HTTP methods.

---

## `pyblade cache:clear`

Clears all cached data from the application.

#### Usage
```bash
pyblade cache:clear
```

#### Examples:
```bash
pyblade cache:clear
```

Use this after updating config or template files to ensure fresh values are used.

---

## `pyblade config:cache`

Caches the configuration files to speed up application boot time.

#### Usage
```bash
pyblade config:cache
```

#### Examples:
```bash
pyblade config:cache
```

This command compiles all configuration into a single cache file for optimized performance.
