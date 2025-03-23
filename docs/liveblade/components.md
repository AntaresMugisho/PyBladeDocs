# Liveblade Components

Liveblade components are self-contained, reusable UI elements that encapsulates both **logic** (Python class) with **presentation** (PyBlade templates). They allow you to build dynamic, interactive user interfaces using only Python — without writing JavaScript.  These components handle user interactions, maintain state on the server, and update the UI dynamically.

>[!tip] PyBlade Components vs Liveblade Components
>it's important to make the diffence between PyBlade components and Liveblade Components. PyBlade components are simple HTML reusable pieces of UI for your frontend while Liveblade components has also the capabilities of being dynamic. They can be updated without full page reloading. 

## Creating components

A Liveblade component consists of two parts:

- A **Python class**  that inherits `pyblade.liveblade.Component`. It is responsible of handling logic and state.

- A **PyBlade template** that defines the component’s UI.

To create a new component, use the `pyblade make:liveblade` command:


```shell
pyblade make:liveblade TodoList
```

If you prefer _kebab-cased_ names, you can use them as well:

```shell
pyblade make:liveblade todo-list
```

After running this command, PyBlade will create two new files in your application.
The first will be the component's class located at `<root>/liveblade/todo_list.py` where `root` is the root folder of your project: 

```python
from pyblade import liveblade

class TodoList(liveblade.Component):

    def render(self):
        return self.view("liveblade.todo-list")
```

The second will be the component's PyBlade template located at `<root>/templates/liveblade/todo_list.html` where again `root` is the root folder of your project: 

```html
<div>
    {# ... #}
</div>
```

Alternatively, you can create these files manually.

You may use dot-notation to create your components in sub-directories. For example, given the following folder structure :

```
my_project/
├── my_app/
│   ├── views.py
│   ├── models.py
│   └── templates/
├── templates/
└── manage.py
```

The following command will create a `TodoList` component in the `tasks` sub-directory which will be created if it doesn't exist:

```shell
pyblade make:liveblade Tasks.TodoList
```

These commands whould create two files: `my_project/liveblade/tasks/todo_list.py` and `my_project/templates/liveblade/tasks/todo_list.html`. Resulting in the following folder structure:

Here is a sample folder structure of `my_project`:
```text{6-8,10-12}
my_project/
├── my_app/
│   ├── views.py
│   ├── models.py
│   └── templates/
├── liveblade/         
│   └──tasks/         
│      └── todo_list.py 
├── templates/
│   └── liveblade/     
│       └──tasks/         
│           └── todo_list.html   
└── manage.py
```

>[!note] Note
>Generated files and subfolders are always named in _snake_case_ while the component classes are in _PascalCase_.

### Inline components

If your component is fairly small, you may want to create an _inline_ component. Inline components are single-file Liveblade components whose view template is contained directly in the `render` method rather than a separate file:

```python{7-9}
from pyblade import liveblade

class TodoList(liveblade.Component):

    def render(self):
        return self.inline("""
            <div>
                {# Your content goes here #}
            </div>
            """
        )
```

You can create inline components by adding the `--inline` flag to the `make:liveblade` command:

```shell
pyblade make:liveblade TodoList --inline
```

### Omitting the render method

To reduce boilerplate in your components, you can omit the `render` method entirely and Liveblade will use its own underlying `render` method, which returns a template with the conventional name corresponding to your component:

```python
from pyblade import liveblade

class TodoList(liveblade.Component):
    ...
```

If the component above is rendered on a page, Liveblade will automatically determine it should be rendered using the `templates/liveblade/todo_list.html` template.

## Rendering components

The **preferred way** to include a Liveblade component in your PyBlade template is by using a **Liveblade component tag**. Liveblade component tags start with `liveblade:`, followed by the _kebab-cased_ component name without extension.  

```html
<liveblade:todo-list />
```

If the component class is nested deeper within the `liveblade` directory, you may use the `.` character to indicate directory nesting. For example, if we assume a component is located at `liveblade/tasks/todo_list.py`, we may render it like so:

```html
<liveblade:tasks.todo-list />
```

> [!warning] Warning
> Always use _kebab-case_ or _snake\_case_ version of the component name. Using the _PascalCase_ version of the component name (`<liveblade:TodoList />`) is invalid and won't be recognized by Liveblade.

### The `@liveblade` directive 
PyBlade also provides an alternative way to render Liveblade components using the `@liveblade` directive:  

```html
@liveblade("counter")
```

```html
@liveblade("todo-list")
```

While this method works, **it is not as intuitive as using liveblade component tags**. The tag-based syntax is visually clearer and aligns with HTML syntax.


### Add `key` attribute when looping

When looping through data in a Liveblade component's template using `@for`, you must add a **unique** `key` attribute to the root element rendered by the loop.

Without a `key` attribute present within a PyBlade loop, Liveblade won't be able to properly match old elements to their new positions when the loop changes. This can cause many hard to diagnose issues in your application.

For example, if you are looping through a list of tasks, you may set the `key` attribute to the task's ID:

```html
<div>
    @for (task in tasks)
        <div key="{{ task.id }}">  // [!code highlight]
            {# ... #}
        </div>
    @endfor
</div>
```

>[!tip] Pro advisory
> The syntax in the 2 following code snippets may be unfamiliar to you, but don't worry as we will cover it in the [Passing data to components](#passing-data-to-components) section just after !

If you are looping through a list that is rendering Liveblade components you may set the `key` as a tag attribute when using Liveblade component tags:

```html
<div>
    @for (task in tasks)
        <liveblade:task-item :task="task" :key="task.id"/> // [!code highlight]
    @endfor
</div>
```
Or pass the `key` as a third argument when using the `@liveblade` directive.

```html
<div>
    @for (task in tasks)
        @liveblade("task-item", props={"task": task}, key=task.id) // [!code highlight]
    @endfor
</div>
```

## Passing data to components

Liveblade allows you to pass initial values to component properties directly from the template.

To pass outside data into a Liveblade component, you can use attributes on the liveblade component tag. This is useful when you want to initialize a component with specific data.

For example, to pass an initial value to the `title` property of the `TodoList` component, you can use the following syntax:

```html
<liveblade:todo-list title="Initial Title" />
```

If you need to pass dynamic values or variables to a component, you can write Python expressions in component attributes by prefixing the attribute with a colon:

```html
<liveblade:todo-list :title="initial_value" />
```

>[!tip] Reminder
>You may already know the difference between  what we call **Normal attributes** and **Bound attributes** when you learned about PyBlade components. The concept is the same with Liveblade components.
>If not you can read [this section](../components#normal-vs-bound-attributes) again.

Data passed to components from templates are received through the `mount()` lifecycle hook as method parameters. In this case, to assign the `title` parameter to a property, you would write a `mount()` method like the following:

```python

from pyblade import liveblade

class TodoList(liveblade.Component):

    def mount(self, title: str):
        self.title = title

    def render(self)
        return self.view("liveblade.todo-list")
```

In this example, the `title` property will be initialized with the value "Initial Title".

You can think of the `mount()` method as a class constructor, the equivalent of the `__init__()` method. It runs on the initial load of the component, but not on subsequent requests within a page. 

We will learn more about `mount()` and other helpful lifecycle hooks within the [Lifecycle hooks](lifecycle-hooks) section.

You can alternatively omit the `mount()` method and Liveblade will automatically set any properties on your component with names matching the passed in values, however, this will be done if and only if you explicitely declared those typed properties in your component.

```python
from pyblade import liveblade

class TodoList(liveblade.Component):

    title: str # [!code highlight]

    def render(self)
        return self.view("liveblade.todo-list")
```

This is effectively the same as assigning `title` inside a `mount()` method.

> [!warning] These properties are not reactive by default
> The `title` property will not update automatically if the outer `:title="initial_value"` changes after the initial component load. This is a common point of confusion when using Liveblade, especially for developers who have used JavaScript frameworks like Vue or React and assume these "parameters" behave like "reactive props" in those frameworks. But, don't worry, Liveblade allows you to opt-in to [making your props reactive](#).

## Including custom JavaScripts
>[!danger] 404 : Not found
>Coming soon ! 


## Full-page components

>[!info] Missing feataure
> This feature is not yet available. This part of documentation is for informative purposes only.

Liveblade allows you to assign components directly to a route in your Django application. These are called "full-page components". You can use them to build standalone pages with logic and templates, fully encapsulated within a Liveblade component.

To create a full-page component, define a route in your `urls.py` file and use the `as_view()` method on the component class. For example, let's imagine you want to render the `TodoList` component at the dedicated route: `tasks/`.

You can accomplish this by adding the following line to your `urls.py` file:

```python
from django.urls import path
from liveblade import TodoList

urlpatterns = [
    path('tasks/', TodoList.as_view()) # [!code highlight]
]
```

Now, when you visit the `tasks/` path in your browser, the `TodoList` component will be rendered as a full-page component and all templates inside may be updated without the need of full page relaod. This may be interesting if you're building an SPA (Single Page Application).

### Accessing route parameters

When working with full-page components, you may need to access route parameters within your Liveblade component.

To demonstrate, first, define a route with a parameter in your `urls.py` file:

```python
from django.urls import path
from liveblade import TodoList

urlpatterns = [
    path('tasks/<int:id>', TodoList.as_view()) # [!code highlight]
]
```

Here, we've defined a route with an `id` parameter which represents a task's ID.

Next, update your Liveblade component to accept the route parameter in the `mount()` method:

```python
from pyblade import liveblade
from app.models import Task

class TaskDetail(liveblade.Component):

    def mount(self, id: int):
        self.task = Task.objects.get(id)

    def render(self):
        return self.view("task-detail")
```

In this example, because the parameter name `id` matches the route parameter `<int:id>`, if the `/tasks/1` URL is visited, Liveblade will pass the value of `1` as `id`.
