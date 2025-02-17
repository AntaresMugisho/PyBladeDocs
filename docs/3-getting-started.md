# PyBlade Documentation
----

::: danger ⚠️ Warning: Experimental Feature
PyBlade is currently in experimental mode. While we are actively developing and testing its features, please be aware that it may contain bugs or incomplete functionality. We recommend using PyBlade exclusively in test environments or with caution in production environments.

Your feedback is invaluable as we work toward a stable release. Thank you for helping us improve PyBlade!
:::

# Quick start
PyBlade is a lightweight  template engine for Python, designed primarily for Django applications. Inspired by Laravel’s Blade and Livewire, it simplifies frontend development through developer-friendly @-based directives and interactive components.

This guide will walk you through installing PyBlade, setting up a new project, running your development server and key concepts of PyBlade.

## Setup a virtual environment

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

## Installation
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


## Run the development server  

Once your project is initialized, you can run `pyblade serve` to start the development server.

```bash
pyblade serve
```

This will launch the Django development server, and you can view your project by navigating to http://127.0.0.1:8000 in your browser.

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