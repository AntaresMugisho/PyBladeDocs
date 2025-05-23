# Available commands


## `pyblade init`

Creates a new PyBlade-powered project with the necessary initial directory structure and your preferred  framemework configuration.


#### Usage
```bash
pyblade init
```

This command will prompt you to provide the following details:

- **Project Name**: Choose a name for your project.
- **Python Web Framework**: Choose the Python Web framework you want to use for your project. Only Django is supported.
- **CSS Framework**: Choose one either Bootstrap 5 or Tailwind CSS 4 for an automatic configuration or None if you want to manually configure it later or don't want to use a CSS Framework.
- **Use LiveBlade**: Enable or disable Liveblade configuration, which adds additional features like real-time UI updates and dynamic components.


#### Common Issues & Troubleshooting
- Error: "Permission denied"  
  Solution: Ensure you have the correct permissions to create directories or run the command with elevated privileges using `sudo`.


## `pyblade serve`

Starts a lightweight web server for development and also serves static files, allowing you to preview your project locally as you are coding.

>[!important] Important
>Don't use this command in a production environment.
#### Usage
```bash
pyblade serve [<addrport>] [OPTIONS]
```

#### Arguments
|Argument| Description
|--------|------------|
|`addrport`| Optional port number, or host address and port number in the format `host:port` (default: `127.0.0.1:8000`)

#### Options
|Option| Description
|--------|------------|
|`-h` `--help`  |          show the help message and exit
|`--host` | The host address to run the server on (default: `127.0.0.1`)
|`--port` | The port number to run the server on (default: `8000`).
|`-6` `--ipv6`    |        Tells Django to use an IPv6 address.
|`--nothreading`  |       Tells Django to NOT use threading.
|`--noreload` |           Tells Django to NOT use the auto-reloader.
|`--nostatic`  |          Tells Django to NOT automatically serve static files at STATIC_URL.
|`--insecure`   |         Allows serving static files even if `DEBUG` is `False`.
|`--settings`| The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`|  A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|` --no-color`  |          Don't colorize the command output.
|`--force-color` |        Force colorization of the command output.         
|`--skip-checks`  |       Skip system checks.


#### Examples
```bash
pyblade serve --host 0.0.0.0 --port 5000
```
This starts the development server at `0.0.0.0:5000`.

#### Aliases
- `pyblade runserver`


#### Common Issues & Troubleshooting
- **Error**: "Address already in use"  
  **Solution**: Check if another process is using the default port (8000). You can stop that process or specify a different port using the `--port` option.


## `pyblade convert`

Migrates existing Django templates to the PyBlade templates by replacing Django Template tags and filters with their PyBlade equivalent.
If the Django project uses custom templates and tags, they will remain unchanged. Make sure every thing works as expected after running this command.

#### Usage
```bash
pyblade convert
```

## `pyblade make:template`

Generates a new PyBlade template in the project root `templates` directory. This is typically a HTML file with basical structure.

#### Usage
```bash
pyblade make:template <name>  [OPTIONS] 
```

### Arguments
|Argument| Description
|--------|------------|
`name`| The name, without extension, of the template to generate.

### Options
|Option| Description
|--------|------------|
|`-h` `--help`  | show the help message and exit
|`-f` `--force`| Override the template if already exists.

#### Examples
```bash
pyblade make:template home
```

### Aliases
- `pyblade maketemplate`

This creates a new `tempalates/home.html` file.

#### Common Issues & Troubleshooting
- **Error**: "Template already exists"  
  **Solution**: Check the `templates` directory to see if a componenet with the same name (*case sensitive*) already exists. You can either override the existing component by using the `--force` option or choose a different name for your template

## `pyblade make:component`

Generates a new PyBlade component. These components are reusable UI elements that can be embedded in templates.

#### Usage
```bash
pyblade make:component <name>  [OPTIONS] 
```

#### Arguments
|Argument| Description
|--------|------------|
`name`| The *kebab-cased* name of the PyBlade Component to generate.

#### Options
|Option| Description
|--------|------------|
`-h` `--help`| Show the help message and exit.
`-f` `--force`| Override the component if already exists.

#### Examples
```bash
pyblade make:component alert-box
```

This creates a new `tempalates/components/alert-box.html` file.

#### Common Issues & Troubleshooting
- **Error**: "Component already exists"  
  **Solution**: Check the `templates/components` directory to see if a componenet with the same name (_kebab-cased_) already exists. You can either override the existing component by using the `--force` option or choose a different name.

You can visit the [PyBlade Components](/components) section of this documentation to learn more about using them. 

## `pyblade make:liveblade`

Creates a new Liveblade component for reactive UI rendering.

#### Usage
```bash
pyblade make:liveblade <name> [OPTIONS]
```

### Arguments
|Argument| Description
|--------|------------|
`name`| The *kebab-cased* name of the Liveblade component.

### Options
|Option| Description
|--------|------------|
`-h` `--help`| Show the help message and exit.
`-f` `--force`| Overwrite the component if it already exists.

#### Examples
```bash
pyblade make:liveblade counter
```

This creates two new files:
- A `liveblade/counter.py` which holds the Python Component's class.
- A `templates/liveblade/couter.html` file which holds the HTML Component's template.


#### Common Issues & Troubleshooting
- **Error**: "Component already exists"  
  **Solution**: Check the `liveblade` directory to see if a python file with the same name (*snake_cased*) already exists. Also Check the `templates/liveblade` directory to see if a HTML file with the same name (_kebab-cased_) already exists. You can either override the existing component by using the `--force` option or choose a different name.

You can visit the [Liveblade Components](/liveblade/components) section of this documentation to learn more about using them. 


## `pyblade make:messages`

Runs over the entire source tree of the project root directory and pulls out all strings marked
for translation. It creates (or updates) a message file in the conf/locale (in the django
tree) or locale (for projects and applications) directory. 

>[!important]Important
>You must run this command with one of either the `--locale` `--exclude`, or `--all` options.

#### Usage
```bash
pyblade make:messages [OPTIONS]
```

#### Options
|Option| Description
|--------|------------|
|`-h` `--help`|            show the help message and exit
|`-l` `--locale` | Creates or updates the message files for the given locale(s) (e.g. `en_US`). Can be used multiple times.
|`-x` `--exclude` | Locales to exclude. Default is none. Can be used multiple times.
|`-a` `--all` | Updates the message files for all existing locales.
|`-d` `--domain` | The domain of the message files (default: `django`).
|`-e` `--extension` | The file extension(s) to examine (default: `html,txt,py`, or `js` if the domain is `djangojs`). Separate multiple extensions with commas, or use `-e` multiple times.
|`-s` `--symlinks` | Follows symlinks to directories when examining source code and templates for translation strings.
|`-i` `--ignore` | Ignore files or directories matching this glob-style pattern. Use multiple times to ignore more.
|`--no-default-ignore` | Don't ignore the common glob-style patterns `CVS` `.*` `*~` and `*.pyc`.
|`--no-wrap`  | Don't break long message lines into several lines.
|`--no-location` | Don't write `#: filename:line` lines.
|`--add-location [{full,file,never}]` | Controls `#: filename:line` lines. If the option is `full` (the default if not given), the lines include both file name and line number. If it's `file`, the line number is omitted. If it's `never`, the lines are suppressed (same as `--no-location`). `--add-location` requires gettext 0.19 or newer.
|`--no-obsolete` | Remove obsolete message strings.
|`--keep-pot` | Keep `.pot` file after making messages. Useful when debugging.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                 | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`---pythonpath PYTHONPATH` | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--traceback`   | Display a full stack trace on `CommandError` exceptions.
|`--no-color`    | Don't colorize the command output.
|`--force-color`| Force colorization of the command output

#### Examples
```bash
pyblade make:messages --locale fr_FR
```

#### Aliases
- `pyblade makemessages`
- `pyblade messages:make`

## `pyblade make:migrations`

Creates new database migration files for apps based on model changes.

#### Usage
```bash
pyblade make:migrations [<app_label>] [OPTIONS]
```

#### Arguments
|Option|Description|
|------|-----------|
`app_label` | Optional app label(s) that specifies the app(s) to create migrations for. Separate multiple apps with commas.

#### Options
|Option|Description|
|------|-----------|
|`-h` `--help`                 | show the help message and exit
|`--dry-run`                  | Just show what migrations would be made; don't actually write them.
|`--merge`                    | Enable fixing of migration conflicts.
|`--empty`                    | Create an empty migration.
|`--noinput` `--no-input`      | Tells Django to NOT prompt the user for input of any kind.
|`-n` `--name`                 | Use this name for migration file(s).
|`--no-header`                | Do not add header comments to new migration file(s).
|`--check`                    | Exit with a non-zero status if model changes are missing migrations and don't actually write them. Implies `--dry-run`.
|`--scriptable`               | Divert log output and input prompts to `stderr`, writing only paths of generated migration files to `stdout`.
|`--update`                   | Merge model changes into the latest migration and optimize the resulting operations.
|`-v` `--verbosity {0,1,2,3}`  | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                 | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`                | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--no-color`                | Don't colorize the command output.
|`--force-color`              | Force colorization of the command output.         
|`--skip-checks`              | Skip system checks.

#### Examples
```bash
pyblade make:migrations
```
#### Aliases
- `pyblade makemigrations`
- `pyblade make:migration` 
- `pyblade makemigration`

## `pyblade app:start`

Creates a Django app directory structure for the given app name in the current directory or
optionally in the given directory.

#### Usage
```bash
pyblade app:start <name> [<directory>] [OPTIONS]
```

#### Arguments
|Argument|Description|
|------|-----------|
`name`     | The name of the application.
`directory`| Optional destination directory.

#### Options
|Option|Description|
|------|-----------|
|`-h` `--help`                | Show the help message and exit
|`-d` `--directory`           | The destination directory
|`--template`                | The path or URL to load the template from.
|`--extension`               | The file extension(s) to render (default: `py`). Separate multiple extensions with commas, or use `-e` multiple times.
|`-n` `--name`                | The file name(s) to render. Separate multiple file names with commas, or use `-n` multiple times.
|`x` `--exclude`              | The directory name(s) to exclude, in addition to `.git` and `__pycache__`. Can be used multiple times.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`              | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|` --no-color`               | Don't colorize the command output.
|`--force-color`             | Force colorization of the command output.         

#### Examples
```bash
pyblade app:start blog apps
```

This will create a new application folder in the `apps` directory.

#### Aliases
- `pyblade startapp`
- `pyblade start:app`

## `pyblade messages:compile`

Compiles `.po` files to `.mo` files for use with builtin gettext support.

#### Usage
```bash
pyblade messages:compile [OPTIONS]
```

#### Options
|Option|Description|
|------|-----------|
|`-h` `--help`                | Show the help message and exit.
|`-l` `--locale`              | Locale(s) to process (e.g. de_AT). Default is to process all. Can be used multiple times.
|`-x` `--exclude`             | Locales to exclude. Default is none. Can be used multiple times.
|`-f` `--use-fuzzy`,          | Use fuzzy translations.
|`-i` `--ignore`              | Ignore directories matching this glob-style pattern. Use multiple times to ignore more.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                 | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`               | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--no-color`                 | Don't colorize the command output.
|`--force-color`              | Force colorization of the command output.
|`--skip-checks`              | Skip system checks.

#### Examples
```bash
pyblade messages:compile
```

#### Aliases
- `pyblade compile:messages`
- `pyblade compilemessages`

#### Common Issues & Troubleshooting
- **Error**: "Missing `.po` files"

  **Solution**: Run `pyblade make:messages` first to generate translation files.

## `pyblade migrate`

Updates database schema. Manages both apps with migrations and those without.

#### Usage
```bash
pyblade migrate [<app_label>] [<migration_name>] [OPTIONS]
```

#### Arguments
|Argument|Description|
|--------|-----------|
| `app_label`        | App label of an application to synchronize the state. This is an optional argument.
| `migration_name`   | Database state will be brought to the state after that migration. Use the name `zero` to unapply all migrations. This is an optional argument.


#### Options
|Option|Description|
|------|-----------|
|`-h` `--help` | show the help message and exit.
|`--noinput` `--no-input` | Tells Django to NOT prompt the user for input of any kind.
|`--database {default}` | Nominates a database to synchronize. Defaults to the `default` database.
|`--fake` | Mark migrations as run without actually running them.
|`--fake-initial` | Detect if tables already exist and fake-apply initial migrations if so. Make sure that the current database schema matches your initial migration before using this flag. Django will only check for an existing table name.
|`--plan`       | Shows a list of the migration actions that will be performed.
|`--run-syncdb` | Creates tables for apps without migrations.
|`--check`      | Exits with a non-zero status if unapplied migrations exist and does not actually apply migrations.
|`--prune`      | Delete nonexistent migrations from the django_migrations table.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`| The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`|  A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|` --no-color`  |          Don't colorize the command output.
|`--force-color` |        Force colorization of the command output.         
|`--skip-checks`  |       Skip system checks.

#### Examples
```bash
pyblade migrate blog --plan
```

#### Aliases
- `pyblade db:migrate`

## `pyblade db:shell`

Runs the command-line client for specified database, or the default database if none is
provided.

#### Usage
```bash
pyblade db:shell [OPTIONS]
```

#### Options
|Option|Description|
|------|-----------|
|`-h` `--help`                | Show the help message and exit.
|`-d` `--database {default}`  | Nominates a database onto which to open a shell. Defaults to the `default` database.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                 | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`               | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|` --no-color`                | Don't colorize the command output.
|`--force-color`              | Force colorization of the command output.         

#### Examples
```bash
pyblade db:shell
```

#### Aliases
- `pyblade dbshell`

## `pyblade shell`

Runs an interactive Python interpreter. Tries to use [IPython](https://pypi.org/project/ipython/) or [bpython](https://pypi.org/project/bpython/), if one of them is
available. Any standard input is executed as code.

#### Usage
```bash
pyblade shell [OPTIONS]
```

#### Options
|Option|Description|
|------|-----------|
|`-h` `--help`                | Show the help message and exit.
|`--no-startup`               | When using plain Python, ignore the PYTHONSTARTUP environment variable and ~/.pythonrc.py script.
|`--no-imports`               | Disable automatic imports of models.
|`-i` `--interface {ipython,bpython,python}` |Specify an interactive interpreter interface. Available options: `ipython`, `bpython` and `python`
|`-c` `--command`             | Instead of opening an interactive shell, run a command as Django and exit.
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                 | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`               | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|` --no-color`                | Don't colorize the command output.
|`--force-color`              | Force colorization of the command output. 

#### Examples
```bash
pyblade shell
```

## `pyblade static:collect`

Collects all static files into a single location (typically for deployment).

#### Usage
```bash
pyblade static:collect [OPTIONS]
```

#### Options
|Option|Description|
|------|-----------|
|`-h, --help`                  | Show this help message and exit
|`--noinput, --no-input`       | Do NOT prompt the user for input of any kind.
|`--no-post-process`           | Do NOT post process collected files.
|`-i` ` --ignore`                 | Ignore files or directories matching this glob-style pattern. Use multiple times to ignore more.
|`-n, --dry-run`               | Do everything except modify the filesystem.
|`-c, --clear`                 | Clear the existing files using the storage before trying to copy or link the original file.
|`-l, --link`                  | Create a symbolic link to each file instead of copying.
|`--no-default-ignore`         | Don't ignore the common private glob-style patterns (defaults to `CVS` `.*` and `*~`).
|`-v` `--verbosity {0,1,2,3}` | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                  | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`                | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--no-color`                  | Don't colorize the command output.
|`--force-color`               | Force colorization of the command output.         
|`--skip-checks`               | Skip system checks.

#### Examples
```bash
pyblade static:collect
```

#### Aliases
- `pyblade collectstatic`
- `pyblade collect:static`


## `pyblade superuser:create`

Creates a superuser account.

#### Usage
```bash
pyblade superuser:create [OPTIONS]
```

#### Options
|Option|Description|
|------|-----------|
|`-h, --help`                  | Show this help message and exit
|`--username`                  | Specifies the login for the superuser.
|`--noinput` `--no-input`      | Tells Django to NOT prompt the user for input of any kind. You must use `--username` with -`-noinput`, along with an option for any other required field. Superusers created with `--noinput` will not be able to log in until they're given a valid password.
|`--database {default}`        | Specifies the database to use. Default is `default`.
|`--email `                    | Specifies the email for the superuser.
|`-v` `--verbosity {0,1,2,3}`  | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                  | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`                | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--no-color`                  | Don't colorize the command output.
|`--force-color`               | Force colorization of the command output.         
|`--skip-checks`               | Skip system checks.


#### Aliases
- `pyblade createsuperuser`
- `pyblade create:superuser`
- `pyblade su:create`

## `pyblade route:list`

Displays a list of all registered routes (URL patterns) in the application.
Useful for debugging route definitions and HTTP methods.

#### Usage
```bash
pyblade route:list
```

## `pyblade test`

Discover and run tests in the specified modules or the current directory if no module is specified.

#### Usage
```bash
pyblade test [<test_label>] [OPTIONS]
```

#### Arguments
|Argument|Description|
|------|-----------|
`test_label` | Module paths to test. Can be `modulename`, `modulename.TestCase` or `modulename.TestCase.test_method`. This is oprional.

#### Options
|Option|Description|
|------|-----------|
`-h, --help`           | Show the help message and exit
`--noinput, --no-input` | Tells Django to NOT prompt the user for input of any kind.
`--testrunner` |  Tells Django to use specified test runner class instead of the one specified by the `TEST_RUNNER` setting.
`--failfast`   | Stops the test suite after the first failure.
`-t, --top-level-directory`  | Top level of project for unittest discovery.
`-p`  `--pattern` | The test matching pattern. Defaults to `test*.py`.
`--keepdb`             | Preserves the test DB between runs.
`--shuffle [SEED]`     | Shuffles test case order.
`-r, --reverse`        | Reverses test case order.
`--debug-mode`         | Sets `settings.DEBUG` to `True`.
`-d, --debug-sql`      | Prints logged SQL queries on failure.
`--parallel [N]`       | Run tests using up to `N` parallel processes. Use the value `auto` to run one test process for each processor core.
`--tag`           | Run only tests with the specified tag. Can be used multiple times.
`--exclude-tag ` | Do not run tests with the specified tag. Can be used multiple times.
`--pdb`                | Runs a debugger (pdb, or ipdb if installed) on error or failure.
`-b, --buffer`         | Discard output from passing tests.
`--no-faulthandler`    | Disables the Python faulthandler module during tests.
`--timing`             | Output timings, including database set up and total run time.
`-k` | Only run test methods and classes that match the pattern or substring. Can be used multiple times. Same as `unittest -k` option.
|`-v` `--verbosity {0,1,2,3}`  | Verbosity level. Use `0` for minimal output, `1` for normal output, `2` for verbose output or `3` for very verbose output.
|`--settings`                  | The Python path to a settings module, e.g. `myproject.settings.main`. If this isn't provided, the `DJANGO_SETTINGS_MODULE` environment variable will be used.
|`--pythonpath`                | A directory to add to the Python path, e.g. `/home/djangoprojects/myproject`.
|`--no-color`                  | Don't colorize the command output.
|`--force-color`               | Force colorization of the command output.   

#### Examples
```bash
pyblade test
pyblade test blog
```

## `pyblade cache:clear`

Clears all cached data from the application.
Use this after updating config or template files to ensure fresh values are used.

#### Usage
```bash
pyblade cache:clear
```

## `pyblade config:cache`

Caches the configuration files to speed up application boot time.
This command compiles all configuration into a single cache file for optimized performance.

#### Usage
```bash
pyblade config:cache
```

## `pyblade info`

Displays information about the current PyBlade project and environment.

#### Usage
```bash
pyblade info
```

## `pyblade update`

Updates PyBlade to the latest available version.

#### Usage
```bash
pyblade update
```


## `pyblade docs`

Opens the PyBlade CLI documentation in your default browser.

#### Usage
```bash
pyblade docs
```

#### Examples
```bash
pyblade docs
```
