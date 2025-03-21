# Installation

Liveblade is included as part of PyBlade, so installing PyBlade is the first step to using it. Follow these steps to install and set up Liveblade in your project.

## Install PyBlade
Before using Liveblade, ensure you have a Python virtual environment set up. If you haven’t already created one, do so using:

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


## Initialize a PyBlade project
Liveblade works within a PyBlade project. To start a new PyBlade project, run the following command:

```sh
pyblade init
```

During initialization, PyBlade will prompt you with several configuration options, including:

- **Use Liveblade?** (Yes/No)

If you choose **Yes**, Liveblade will be installed and configured automatically. If you select **No**, you can enable it later.

>[!Tip]Tip
>You can learn more about PyBlade installation and configuration  as well as project initialization in the [Getting started](../getting-started) section of PyBlade documentation.

## Enable Liveblade in an existing project
If you accidently chosed not to enable Liveblade during `pyblade init`, or if you have an existing PyBlade project without Liveblade configuration and now want to add it, you can do so by running:

```sh
pyblade liveblade:install
```

This command will add the necessary Liveblade configuration to your project to ensure that your PyBlade templates support Liveblade components and
real-time component interaction.

## Manual configuration (Optional)
For those who are curious or prefer a more hands-on setup, you can manually configure Liveblade in your project.

If you want to use Liveblade in your Django project, add it to the list of installed apps in `settings.py`.

```python
# settings.py
INSTALLED_APPS = [
    ...,
    pyblade.liveblade # [!code highlight]
]
```
You will also need to enable it by setting `use_liveblade` to `true` in the `pyblade.json` file.

```json
{   
    "use_liveblade": true,
}
```

>[!warning] Warning
>For this to work, you must ensure you're project is configured to use the PyBlade Template Engine. This is setup automatically when you initialize a **new** PyBlade project with the `pyblade init` command.
>But if you have an old Django project and would like to use PyBlade Template Engine, please check our [Migration guide](../migration-guide).

After completing these steps, your Django project will be ready to use Liveblade, allowing you to build dynamic and interactive components without living the Python comfort.


## Ready ?

With Liveblade installed, you are now ready to create components that bring interactivity to your PyBlade-powered applications. In the next section, we will explore how to define and use Liveblade components.

Let's start !

