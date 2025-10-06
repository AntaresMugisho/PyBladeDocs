---
editLink: false
---

# PyBlade CLI Overview

Learn how to use the PyBlade command-line interface (CLI) to manage and configure your PyBlade projects from the command line. The PyBlade CLI allows you to interact with your PyBlade environment efficiently, whether you're working with Django or Flask. With it, you can streamline your development workflow, manage templates, and configure settings, all from the terminal.

The PyBlade CLI allows you to streamline your development workflow, making it easy to manage components, databases, templates, and settings, whether you're working locally on a project or automating tasks. By leveraging the CLI, you can simplify many common tasks involved in web development, from generating new components to running migrations, all within a terminal environment.


    
## Installing PyBlade CLI

To get started with PyBlade and its CLI, you first need to install the PyBlade package. When you install PyBlade, it includes the PyBlade CLI by default, so you won’t need to install it separately. To install PyBlade globally on your system, run the following command:

```bash
pip install pyblade[cli]
```

This command will install the PyBlade package along with the command-line interface, allowing you to begin using the full set of features right away. Once installed, you can use the PyBlade CLI to manage your templates and components more efficiently.

---

## Updating PyBlade CLI

PyBlade CLI is regularly updated to include new features, bug fixes, and improvements. If there is a new version of PyBlade CLI available, you will be notified whenever you run any PyBlade command. To ensure you're using the latest version, you can update the CLI by running the installation command again:

```bash
pip install --upgrade pyblade[cli]
```

This will automatically update PyBlade and its CLI to the most recent version. If you encounter any issues related to permissions during the update, you may need to use elevated privileges (e.g., `sudo` on Unix-based systems) or consult the official Python documentation on managing package installations.

---

## Checking the Version of PyBlade CLI

If you ever need to check which version of PyBlade CLI you have installed, you can easily do so by using the `--version` flag with the `pyblade` command:

```bash
pyblade --version
```

This will display the version number of the PyBlade CLI installed on your system. It's a useful command when troubleshooting issues or ensuring you're using a compatible version with other tools or components in your project.

---

## Getting Help with PyBlade CLI

The PyBlade CLI provides detailed help and documentation directly from the terminal. To view a list of all available commands and their descriptions, simply run:

```bash
pyblade --help
```

This will output a list of available commands, along with a brief explanation of what each one does. If you need more specific guidance on how to use a particular command, you can access detailed help for that command by appending the `--help` flag to it. For example, to learn more about how to generate a new component, you can run:

```bash
pyblade make:component --help
```

This will provide detailed information about the `make:component` command, including its arguments, options, and any available examples. The help system is an excellent resource for learning about PyBlade CLI commands as you work through your development process.


