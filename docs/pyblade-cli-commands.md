# Available commands

PyBlade CLI commands are categorized for easy navigation. Click on any command to learn more about its usage and options.

### 1. **Django Commands**
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

### 2. **Database Commands**
Commands for managing databases and migrations.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade db:reset`          | Reset the database by dropping and recreating it.                          |
| `pyblade db:seed`           | Seed the database with test data.                                          |
| `pyblade db:status`         | Show the current migration status of the database.                         |
| `pyblade db:rollback`       | Rollback the last database migration.                                      |

---

### 3. **Artisan-Inspired Commands**
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

### 4. **Utility Commands**
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

### 5. **Custom Commands**
Commands specific to PyBlade CLI for advanced functionality.

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `pyblade blade:init`        | Initialize a new PyBlade project structure.                                |
| `pyblade blade:update`      | Update PyBlade CLI to the latest version.                                 |
| `pyblade blade:info`       | Display information about the current PyBlade environment.                |
| `pyblade blade:docs`       | Open the PyBlade CLI documentation in your browser.                       |

---

## Detailed Command Documentation
Click on any command below to learn more about its usage, options, and examples.

- [Django Commands](#django-commands)
  - [`pyblade startproject`](#pyblade-startproject)
  - [`pyblade startapp`](#pyblade-startapp)
  - [`pyblade makemigrations`](#pyblade-makemigrations)
  - [`pyblade migrate`](#pyblade-migrate)
  - [`pyblade createsuperuser`](#pyblade-createsuperuser)
  - [`pyblade collectstatic`](#pyblade-collectstatic)
  - [`pyblade runserver`](#pyblade-runserver)
  - [`pyblade shell`](#pyblade-shell)
  - [`pyblade test`](#pyblade-test)

- [Database Commands](#database-commands)
  - [`pyblade db:reset`](#pyblade-db-reset)
  - [`pyblade db:seed`](#pyblade-db-seed)
  - [`pyblade db:status`](#pyblade-db-status)
  - [`pyblade db:rollback`](#pyblade-db-rollback)

- [Artisan-Inspired Commands](#artisan-inspired-commands)
  - [`pyblade make:model`](#pyblade-make-model)
  - [`pyblade make:controller`](#pyblade-make-controller)
  - [`pyblade make:middleware`](#pyblade-make-middleware)
  - [`pyblade make:migration`](#pyblade-make-migration)
  - [`pyblade make:seeder`](#pyblade-make-seeder)
  - [`pyblade make:factory`](#pyblade-make-factory)
  - [`pyblade route:list`](#pyblade-route-list)
  - [`pyblade cache:clear`](#pyblade-cache-clear)
  - [`pyblade config:cache`](#pyblade-config-cache)

- [Utility Commands](#utility-commands)
  - [`pyblade serve`](#pyblade-serve)
  - [`pyblade tinker`](#pyblade-tinker)
  - [`pyblade queue:work`](#pyblade-queue-work)
  - [`pyblade schedule:run`](#pyblade-schedule-run)
  - [`pyblade storage:link`](#pyblade-storage-link)
  - [`pyblade optimize`](#pyblade-optimize)

- [Custom Commands](#custom-commands)
  - [`pyblade blade:init`](#pyblade-blade-init)
  - [`pyblade blade:update`](#pyblade-blade-update)
  - [`pyblade blade:info`](#pyblade-blade-info)
  - [`pyblade blade:docs`](#pyblade-blade-docs)

Great! I’ll adjust the format to provide a more structured and detailed breakdown of the PyBlade CLI commands, including a table for options, an argument section, and specifying any available aliases for each command. This format will help users better understand the full scope of each command and its functionality.

---

## PyBlade CLI Command Documentation

Below is a refined structure for each PyBlade CLI command with detailed sections covering descriptions, arguments, options (in table format), aliases, examples, troubleshooting tips, and related commands.

---

### 1. **`pyblade new <project_name>`**

#### **Description:**
Creates a new PyBlade-powered project with the necessary initial directory structure and configuration files.

#### **Arguments:**
| Argument      | Description                                 |
|---------------|---------------------------------------------|
| `<project_name>` | The name of the new project directory. This argument is required. |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| `--template`  | Specify a custom template for the new project. |

#### **Aliases:**
- None.

#### **Usage:**
```bash
pyblade new <project_name> [--template <template_name>]
```

#### **Examples:**
```bash
pyblade new my_project
```
This creates a new directory called `my_project` with the initial setup for a PyBlade-powered project.

```bash
pyblade new my_project --template basic
```
This creates a new project with a basic template setup.

#### **Common Issues & Troubleshooting:**
- **Error**: "Permission denied"  
  **Solution**: Ensure you have the correct permissions to create directories or run the command with elevated privileges using `sudo`.

#### **Related Commands:**
- **`pyblade serve`**: Start the server after creating a new project.
- **`pyblade make:component`**: Generate components for the PyBlade project.

---

### 2. **`pyblade serve`**

#### **Description:**
Starts the PyBlade development server, allowing you to preview your project locally.

#### **Arguments:**
| Argument      | Description                              |
|---------------|------------------------------------------|
| None          | No required arguments for this command.  |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| `--host`      | The host address to run the server on (default: `127.0.0.1`). |
| `--port`      | The port number to run the server on (default: `8000`). |
| `--debug`     | Enable debug mode for more detailed logging. |

#### **Aliases:**
- None.

#### **Usage:**
```bash
pyblade serve [--host <host>] [--port <port>] [--debug]
```

#### **Examples:**
```bash
pyblade serve --host 0.0.0.0 --port 5000
```
This starts the development server at `0.0.0.0:5000`.

```bash
pyblade serve --debug
```
This starts the server with debug mode enabled.

#### **Common Issues & Troubleshooting:**
- **Error**: "Address already in use"  
  **Solution**: Check if another process is using the default port (8000). You can stop that process or specify a different port using the `--port` option.

#### **Related Commands:**
- **`pyblade new <project_name>`**: Create a new project before serving it.
- **`pyblade test`**: Run tests before starting the server to ensure everything is functioning.

---

### 3. **`pyblade make:component <ComponentName>`**

#### **Description:**
Generates a new PyBlade interactive component. These components are reusable UI elements that can be embedded in templates.

#### **Arguments:**
| Argument      | Description                              |
|---------------|------------------------------------------|
| `<ComponentName>` | The name of the component to generate (e.g., `AlertBox`). |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| None          | No additional options for this command.  |

#### **Aliases:**
- **`pyblade make:widget`**: Alias to create a component (for backward compatibility).

#### **Usage:**
```bash
pyblade make:component <ComponentName>
```

#### **Examples:**
```bash
pyblade make:component AlertBox
```
This creates a new `AlertBox` component file.

#### **Common Issues & Troubleshooting:**
- **Error**: "Component already exists"  
  **Solution**: Check the `app/components` directory to see if the component already exists. You can either modify the existing component or choose a unique name.

#### **Related Commands:**
- **`pyblade make:model <ModelName>`**: Create models for use with the components.
- **`pyblade make:controller <ControllerName>`**: Create a controller that handles the logic for the component.

---

### 4. **`pyblade make:model <ModelName>`**

#### **Description:**
Generates a new model file that interacts with the database and represents the application's data structures.

#### **Arguments:**
| Argument      | Description                              |
|---------------|------------------------------------------|
| `<ModelName>` | The name of the model to create (e.g., `User`). |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| `--database`  | Specify the database connection to use (default: primary). |

#### **Aliases:**
- None.

#### **Usage:**
```bash
pyblade make:model <ModelName> [--database <database_name>]
```

#### **Examples:**
```bash
pyblade make:model User
```
This creates a `User.py` model file.

```bash
pyblade make:model Post --database secondary
```
This creates the `Post` model and links it to a secondary database.

#### **Common Issues & Troubleshooting:**
- **Error**: "Model already exists"  
  **Solution**: Check the `app/models` directory. If the model exists, you can modify it or choose a different name.

#### **Related Commands:**
- **`pyblade make:migration <MigrationName>`**: Create migration files related to the model.
- **`pyblade make:controller <ControllerName>`**: Link the model with a controller.

---

### 5. **`pyblade make:migration <MigrationName>`**

#### **Description:**
Generates a migration file that allows you to modify your database schema, such as creating tables or altering columns.

#### **Arguments:**
| Argument      | Description                              |
|---------------|------------------------------------------|
| `<MigrationName>` | The name of the migration (e.g., `create_users_table`). |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| None          | No additional options for this command.  |

#### **Aliases:**
- None.

#### **Usage:**
```bash
pyblade make:migration <MigrationName>
```

#### **Examples:**
```bash
pyblade make:migration create_users_table
```
This creates a migration file to define the `users` table schema.

#### **Common Issues & Troubleshooting:**
- **Error**: "Invalid migration name"  
  **Solution**: Ensure the migration name follows proper naming conventions (e.g., `create_<table_name>_table`).

#### **Related Commands:**
- **`pyblade migrate`**: Apply the migration to update the database.
- **`pyblade db:seed`**: Seed the database after applying migrations.

---

### 6. **`pyblade migrate`**

#### **Description:**
Applies all pending migrations to the database.

#### **Arguments:**
| Argument      | Description                              |
|---------------|------------------------------------------|
| None          | No required arguments for this command.  |

#### **Options:**
| Option        | Description                              |
|---------------|------------------------------------------|
| `--force`     | Force the migration to run even if it has been applied previously. |
| `--rollback`  | Roll back the last migration batch. |

#### **Aliases:**
- None.

#### **Usage:**
```bash
pyblade migrate [--force] [--rollback]
```

#### **Examples:**
```bash
pyblade migrate
```
This applies all pending migrations to the database.

```bash
pyblade migrate --rollback
```
This rolls back the last batch of migrations.

#### **Common Issues & Troubleshooting:**
- **Error**: "Database connection failed"  
  **Solution**: Verify your database credentials in the configuration file and ensure the database is running.

#### **Related Commands:**
- **`pyblade make:migration <MigrationName>`**: Create new migration files.
- **`pyblade db:seed`**: Seed the database after applying migrations.

---
