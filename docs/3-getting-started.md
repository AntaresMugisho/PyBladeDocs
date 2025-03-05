# Getting started
::: danger ⚠️ Warning: Experimental Feature
PyBlade is currently in experimental mode. While we are actively developing and testing its features, please be aware that it may contain bugs or incomplete functionality. We recommend using PyBlade exclusively in test environments or with caution in production environments.

Your feedback is invaluable as we work toward a stable release. Thank you for helping us improve PyBlade!
:::

PyBlade is a lightweight  template engine for Python, designed primarily for Django applications. Inspired by Laravel’s Blade and Livewire, it simplifies frontend development through developer-friendly @-based directives and interactive components.

This guide will walk you through installing PyBlade, setting up a new project, running your development server and key concepts of PyBlade.

## Installation

Before installing PyBlade, ensure you are working within a virtual environment to avoid conflicts with other Python packages. If you haven't set up a virtual environment, create a new one by typing the following command in a terminal:

```bash
python -m venv .env
```

Then, activate the virtual environment by running:

**On macOS or Linux**
```bash
source .env/bin/activate
```

**On Windows**
```bash
.env\Scripts\activate
```

Once the virtual environment is activated, install PyBlade with:

```bash
pip install pyblade
```

After installation, check if PyBlade is installed correctly by running:

```bash
pyblade -v
```

This will display the installed version of PyBlade, confirming the installation was successful.

You are now ready to use PyBlade in your project.  


## Initialize a PyBlade project  

To start a new project, use the `pyblade init` command. This will guide you through the project setup process:

```bash
pyblade init
```

This command will prompt you to provide the following details:

1. **Project Name**: Choose a name for your project.
2. **Python Web Framework**: Currently, only Django is supported.
3. **CSS Framework**: Choose one either Bootstrap 5 or Tailwind CSS for an automatic configuration or None if you want to manually configure it later or don't want to use a CSS Framework.
4. **Use LiveBlade**: Enable or disable Liveblade configuration, which adds additional features like real-time UI updates and dynamic components.

PyBlade will then generate the standard project structure based on the web framework you choosed, ensuring everything is set up correctly from the start. Additionally, a `pyblade.json` file will be created into the project root folder, which is essential for PyBlade to function properly. You don’t need to modify or delete this file — just leave it as is to ensure everything runs smoothly.

If you also selected a CSS framework, PyBlade will automatically configure it for you,  so you don’t have to handle the setup manually. 

This means you can skip configuring settings like `settings.py` in Django — PyBlade takes care of it for you. You can dive straight into developing your project without any extra hassle. This allows you to focus entirely on building your project while PyBlade handles the initial configuration seamlessly. 

## Manual Configuration

By default, when you start a new PyBlade project with the `pyblade init` command, all configurations are automatically handled for you. This means you can [run the development server](#run-the-development-server) right away and begin working on your project without worrying about setup.  

However, if you're interested in understanding how PyBlade is configured behind the scenes or need to integrate it into an existing project, manual configuration may be essential. This section will guide you through setting up PyBlade manually, first for Django and then for Flask.  

If all you need is to start developing a new project, you can [skip](#run-the-development-server) this section. Otherwise, let’s dive into the manual setup process.  

### Configuring PyBlade for Django

In order to use **PyBlade** with Django, first ensure your Django project is correctly set up. If not, please refer to the [Django documentation](https://docs.djangoproject.com/en/stable/) for instructions.

Once your Django project is correctly set up, you can manually integrate PyBlade into it, by modifying the `TEMPLATES` setting in `settings.py`. Django’s default template engine is configured like this:  

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```  

To use PyBlade, add PyBlade’s template engine to the list of `TEMPLATES` in `settings.py` like this:  

```python
TEMPLATES = [
    {
        'BACKEND': 'pyblade.backends.django.PyBladeEngine',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': []
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```  

Additionally, PyBlade requires a `pyblade.json` configuration file in the root of your project. This file contains settings that control PyBlade’s behavior. A basic example looks like this:  

```json
{
    "name": "my_project",
    "framework": "django",
    "css_framework": null,
    "use_liveblade": false,
    "pyblade_version": "0.2.0"
}
```

Once this is set up, you can start using PyBlade directives in your Django templates.
 
### Configuring Liveblade for Django
If you want to use Liveblade in your Django project, add it to the list of installed apps in `settings.py`.

```python
# settings.py

INSTALLED_APPS = [
    ...,
    pyblade.liveblade
]

```
You will also need to enable it by setting `use_liveblade` to `true` in the `pyblade.json` file.
```json
{   
    "use_liveblade": true,
}
```

### Configuring a CSS Framework  

If you want to integrate a CSS framework into your project, we recommend referring to the specific documentation for that framework. PyBlade does not enforce any particular CSS framework, allowing you to choose what best fits your needs.  

For Django projects, you may consider:  
- [django-tailwind](https://django-tailwind.readthedocs.io/en/latest/) for integrating Tailwind CSS.  
- [django-bootstrap5](https://django-bootstrap5.readthedocs.io/en/latest/) for Bootstrap 5 support.  

### Migrating from Django's default Template Engine

If you’re migrating from Django’s default template engine, PyBlade provides a helpfull command that automatically converts existing Django templates by replacing all corresponding directives with their PyBlade equivalents:  

```bash
pyblade convert
``` 

You can learn more about this functionnality in the [Migration guide](migration-guide).

---
### Configuring PyBlade for Flask  
::: info Coming soon
You'll now more about Flask specific configuration in the upcoming version of PyBlade.
:::  

## Run the development server  

Once your project is initialized, you can run `pyblade serve` to start the development server.

```bash
pyblade serve
```

This will launch the Django development server, and you can view your project by navigating to http://127.0.0.1:8000 in your browser.


## Rendering PyBlade Templates

### In Django

In  Django views, PyBlade templates should be referenced without the `.html` extension, and folders should use
dots `.` instead of slashes `/` for separation. This is consistent with PyBlade’s template loading conventions.

For example, given the structure:
```
my_project/
├── my_app/
│   ├── views.py                # Django views file
│   ├── models.py               # Django models file
│   └── templates/
│       └── my_app/             # App-specific folder for templates
│           ├── index.html   # Template for a view in `my_app`
│           └── about.html   # Other template
└── settings.py

```
To reference `index.html` within `templates/my_app/`, use the path `"my_app.index"` in your Django view, as follows:

```python
# views.py
from django.shortcuts import render

def home_view(request):
    context = {'title': 'Welcome to PyBlade', 'user': {'name': 'John Doe'}}
    return render(request, 'my_app.index', context)
```

This dot notation approach provides a clean way to reference templates across folders and is timeless consuming.

::: info Important
For convenience, PyBlade can load templates referenced in the old manner using slashes-notation for forlder separation and template file's extension specification. This means PyBlade can load the view referenced with

```python
# views.py
from django.shortcuts import render

def home_view(request):
    context = {'title': 'Welcome to PyBlade', 'user': {'name': 'John Doe'}}
    return render(request, 'my_app/index.html', context)
```
:::



### In Flask

#### Organize your Flask project

Within your Flask project, create a `templates` folder if it doesn’t already exist, and place all your `.html` templates there:

```
my_flask_project/
├── app.py               # Main Flask application file
└── static/              # Folder for storing assets (images, css, js, ...)
|   └── css/
|       └── style.css
└── templates/
    ├── index.html       # PyBlade template file
    └── about.html       # Optional base layout template
```

::: warning Attention
The templates system will not work if this folder structure is not exactly as described above. Your project folder can be named anything (not only my_flask_project) as well as your main app file, but the `static` and `templates` folders must be named as shown above. The static and templates folder can contain multiple folders and files. The names of files are up to you.
:::

## Best Practices

Here are some best practices and tips to maximize efficiency and maintain clean code when using PyBlade:

- **Keep Logic in the Backend**: Our philosophy is to avoid adding business logic in templates. Use PyBlade directives to simplify rendering, but keep calculations, data processing, and complex logic in your views or controllers.
- **Organize Templates by Feature**: Create subdirectories within `templates` for different sections of your app. This structure keeps templates maintainable, especially in large applications.
- **Use PyBlade’s Components for Modular Code**: Components let you create reusable template sections, improving maintainability and reducing repetition across your templates.
- **Editor Extensions**: To speed up development, you can install **PyBlade Intellisense** extensions from your editor’s marketplace, enabling you to work seamlessly with PyBlade templates.

These best practices will help you develop faster with PyBlade while maintaining code security, clarity, and
efficiency across your Python web projects.

## What is next ?

Now that you've successfully installed and run PyBlade for your Django project, you're ready to dive deeper into the core of PyBlade — its powerful directives and features.

PyBlade is more than just a template engine — it’s a complete development tool designed to enhance your workflow. With its clean and expressive syntax, writing dynamic templates becomes faster and more intuitive. You're not just writing HTML; you're writing Python code that's both secure and maintainable.

Here’s what you can explore next to unlock the full potential of PyBlade:

### 1. PyBlade: The Template Engine

PyBlade provides a rich set of directives that can help you add logic and interactivity to your HTML templates, all while keeping the code simple and readable. These directives will allow you to control the flow of your templates in a way that’s both powerful and easy to follow.

- Learn how to [display data](6-displaying-data) in your templates.
- Learn how to use [pyblade directives](7-pyblade-directives) like `@if`, `@for` and `@include` in your templates.
- Use [PyBlade components](#) to create reusable UI blocks with data encapsulation.
- Understand [template inheritance and layouts](#) for creating modular templates.

### 2. Liveblade : for interactive components

Beyond templating, PyBlade comes with Liveblade, which serves as a frontend framework by offering real-time UI updates, dynamic components, and more. With PyBlade’s Liveblade integration, you can create reusable components that can be updated dynamically—without requiring server-side rendering.

All without writing a single line of JavaScript code. You stay in the comfort of Python, and the magic happens behind the scenes.

- Learn how to create live-reloading components.  
- Use bindings like `b-click`, `b-change`, and `b-model` to handle user interactions. 
- Build real-time applications without leaving the comfort of Python.  

### 3. PyBlade CLI

PyBlade comes with a user-friendly and a powerful CLI, making project setup and management more efficient. It makes less time consuming for you to:

- Manage your project with simple commands.
- Migrate databases, create models, and run tests easily.
- Install and configure third-party packages.

### 4. Boost productivity with editor extensions
PyBlade makes your development experience even better with editor extensions for popular IDEs like VSCode, Sublime Text, and JetBrains. These extensions bring intelligent code completion, snippets, syntax highlighting, and more to `.html` files. This ensures you can write PyBlade templates with ease and confidence, reducing the time spent on looking up syntax and improving your overall workflow.

Download Pyblade IntelliSense for [VS Code](#), [Sublime Text](#), [JetBrains IDEs](#).

---
Once you have a good grasp of the basics, you’ll be able to fully leverage the power of PyBlade to create beautiful, dynamic templates that integrate seamlessly with your Django or Flask backend. So, get ready to explore the power of PyBlade’s directives, and start building more efficient, secured and maintainable web applications today !