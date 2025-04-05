# Available commands

PyBlade CLI commands are categorized for easy navigation. Click on any command to learn more about its usage and options.

### 1. Django Commands
These commands are specific to Django project management.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade startproject`      | Create a new Django project.                                                |
| `pyblade startapp`          | Create a new Django application within a project.                          |
| `pyblade makemigrations`    | Generate migration files for database changes.                             |
| `pyblade migrate`           | Apply migrations to the database.                                          |
| `pyblade createsuperuser`   | Create a superuser for the Django admin panel.                             |
| `pyblade collectstatic`     | Collect static files into the designated directory.                        |
| `pyblade runserver`         | Start the Django development server.                                       |
| `pyblade shell`             | Open the Django interactive shell.                                         |
| `pyblade test`              | Run tests for your Django applications.                                    |

---

### 2. Database Commands
Commands for managing databases and migrations.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade db:reset`          | Reset the database by dropping and recreating it.                          |
| `pyblade db:seed`           | Seed the database with test data.                                          |
| `pyblade db:status`         | Show the current migration status of the database.                         |
| `pyblade db:rollback`       | Rollback the last database migration.                                      |

---

### 3. Artisan-Inspired Commands
Commands inspired by Laravel's Artisan for additional utility.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade make:model`        | Create a new Eloquent model (Django model).                                |
| `pyblade make:controller`   | Create a new controller for handling requests.                             |
| `pyblade make:middleware`   | Create a new middleware class.                                             |
| `pyblade make:migration`    | Create a new migration file.                                               |
| `pyblade make:seeder`       | Create a new database seeder.                                              |
| `pyblade make:factory`      | Create a new model factory for generating test data.                       |
| `pyblade route:list`        | Display a list of all registered routes.                                   |
| `pyblade cache:clear`       | Clear the application cache.                                               |
| `pyblade config:cache`      | Cache the configuration files for faster performance.                      |

---

### 4. Utility Commands
General-purpose commands for development and debugging.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade serve`             | Serve the application on a local development server.                       |
| `pyblade tinker`            | Interact with your application in a REPL environment.                      |
| `pyblade queue:work`        | Process jobs in the queue.                                                 |
| `pyblade schedule:run`      | Run scheduled tasks.                                                       |
| `pyblade storage:link`      | Create a symbolic link for public storage.                                 |
| `pyblade optimize`          | Optimize the application for production.                                  |

---

### 5. Custom Commands
Commands specific to PyBlade CLI for advanced functionality.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade blade:init`        | Initialize a new PyBlade project structure.                                |
| `pyblade blade:update`      | Update PyBlade CLI to the latest version.                                 |
| `pyblade blade:info`       | Display information about the current PyBlade environment.                |
| `pyblade blade:docs`       | Open the PyBlade CLI documentation in your browser.                       |

---

--- 


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


## `pyblade make:component`

Generates a new PyBlade component. These components are reusable UI elements that can be embedded in templates.

#### Usage
```bash
pyblade make:component <ComponentName | component-name> [-f | --force]
```

### Arguments
`ComponentName`: The name of the component to generate (e.g., `AlertBox`).

### Arguments
`-f, --force`: Override the component if already exists.


#### Examples:
```bash
pyblade make:component AlertBox
```
This creates a new `alert-box.html` component file.

#### Common Issues & Troubleshooting:
- Error: "Component already exists"  
  Solution: Check the `templates/components` directory to see if a componenet with the same name (_kebab-cased_) already exists. You can either override the existing component by using the `--force` option or choose a different name.

Visit [PyBlade Components]("/components") to learn more about them. 

---

### 4. `pyblade make:model <ModelName>`

#### Description:
Generates a new model file that interacts with the database and represents the application's data structures.

#### Arguments:
| Argument      | Description                              |
|---------------|------------------------------------------|
| `<ModelName>` | The name of the model to create (e.g., `User`). |

#### Options:
| Option        | Description                              |
|---------------|------------------------------------------|
| `--database`  | Specify the database connection to use (default: primary). |

#### Aliases:
- None.

#### Usage:
```bash
pyblade make:model <ModelName> [--database <database_name>]
```

#### Examples:
```bash
pyblade make:model User
```
This creates a `User.py` model file.

```bash
pyblade make:model Post --database secondary
```
This creates the `Post` model and links it to a secondary database.

#### Common Issues & Troubleshooting:
- Error: "Model already exists"  
  Solution: Check the `app/models` directory. If the model exists, you can modify it or choose a different name.

#### Related Commands:
- `pyblade make:migration <MigrationName>`: Create migration files related to the model.
- `pyblade make:controller <ControllerName>`: Link the model with a controller.

---

### 5. `pyblade make:migration <MigrationName>`

#### Description:
Generates a migration file that allows you to modify your database schema, such as creating tables or altering columns.

#### Arguments:
| Argument      | Description                              |
|---------------|------------------------------------------|
| `<MigrationName>` | The name of the migration (e.g., `create_users_table`). |

#### Options:
| Option        | Description                              |
|---------------|------------------------------------------|
| None          | No additional options for this command.  |

#### Aliases:
- None.

#### Usage:
```bash
pyblade make:migration <MigrationName>
```

#### Examples:
```bash
pyblade make:migration create_users_table
```
This creates a migration file to define the `users` table schema.

#### Common Issues & Troubleshooting:
- Error: "Invalid migration name"  
  Solution: Ensure the migration name follows proper naming conventions (e.g., `create_<table_name>_table`).

#### Related Commands:
- `pyblade migrate`: Apply the migration to update the database.
- `pyblade db:seed`: Seed the database after applying migrations.

---

### 6. `pyblade migrate`

#### Description:
Applies all pending migrations to the database.

#### Arguments:
| Argument      | Description                              |
|---------------|------------------------------------------|
| None          | No required arguments for this command.  |

#### Options:
| Option        | Description                              |
|---------------|------------------------------------------|
| `--force`     | Force the migration to run even if it has been applied previously. |
| `--rollback`  | Roll back the last migration batch. |

#### Aliases:
- None.

#### Usage:
```bash
pyblade migrate [--force] [--rollback]
```

#### Examples:
```bash
pyblade migrate
```
This applies all pending migrations to the database.

```bash
pyblade migrate --rollback
```
This rolls back the last batch of migrations.

#### Common Issues & Troubleshooting:
- Error: "Database connection failed"  
  Solution: Verify your database credentials in the configuration file and ensure the database is running.

#### Related Commands:
- `pyblade make:migration <MigrationName>`: Create new migration files.
- `pyblade db:seed`: Seed the database after applying migrations.

---
