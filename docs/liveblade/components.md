# Liveblade Components

Components are the building blocks of your application. Liveblade make them combine state and behavior to create reusable pieces of UI for your front end. Here, we'll cover the basics of creating and rendering components.

>[!info] PyBlade vs Liveblade Components
>it's important to make the diffence between PyBlade components and Liveblade Components. PyBlade components are simple HTML reusable pieces of UI for your frontend while Liveblade components has also the capabilities of being dynamic. They can be updated without page reloading. 

## Creating components

A Liveblade component is simply a Python class that inherits `pyblade.liveblade.Component`. You can create component files by hand or use the following PyBlade command:

```shell
pyblade make:liveblade TodoList
```

If you prefer kebab-cased names, you can use them as well:

```shell
pyblade make:liveblade todo-list
```

After running this command, PyBlade will create two new files in your application.
The first will be the component's class located at the root of your project inside the `liveblade` folder : `my_project/liveblade/todo_list.py`

```python
from pyblade import liveblade

class TodoList(liveblade.Component):

    def render(self):
        return self.view("liveblade.todo-list")
```

The second will be the component's HTML template located in the **templates** folder inside the `liveblade` folder: `my_project/templates/liveblade/todo_list.html`

```blade
<div>
    {# ... #}
</div>
```

You may use dot-notation to create your components in sub-directories. For example, the following commands will create a `TodoList` component in the `tasks` sub-directory:

```shell
pyblade make:liveblade Tasks.TodoList
pyblade make:liveblade tasks.todo-list
```

These commands whould create two files: `my_project/liveblade/tasks/todo_list.py` and `my_project/templates/liveblade/tasks/todo_list.html`. 

Notice that files and subfolders are always named in snake_case while the component classes are in PascalCase.

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

## Setting properties

Liveblade components have properties that store data and can be easily accessed within the component's class and template. This section discusses the basics of adding a property to a component and using it in your application.

To add a property to a Liveblade component, declare property in your component class. For example, let's create a `title` property in the `TodoList` component:

```python
from pyblade import liveblade

class TodoList(liveblade.Component):
    title = "Learn PyBlade"

    def render(self):
        return self.view("liveblade.todo-list")
```

### Accessing properties in the template

Component properties are automatically made available to the component's context. You can reference it using standard PyBlade syntax. Here we'll display the value of the `title` property:

```blade
<div>
    <h1>Title: {{ title }}</h1>
</div>
```

The rendered output of this component would be:

```blade
<div>
    <h1>Title: Learn PyBlade</h1>
</div>
```

### Sharing additional data with the template

In addition to accessing class properties from the template, you can explicitly pass data to the template from the `render` method, like you might typically do from a view in Django. This can be useful when you want to pass additional data without first storing it as a property — because properties have [specific security implications](#).

To pass data to the view in the `render` method, you can add a dictionnary as second parameter to the returned `view` method. For example, let's say you want to pass the task status to the template.

```python
class TodoList(liveblade.Component):
    title = "Learn PyBlade"

    def render(self):
        return self.view("liveblade.todo-list", context={"status": "In progress"})
```


Now you may access the `status` property from the component's template:

```blade
<div>
    <h1>Title: {{ title }}</h1>

    <span>Status: {{ status }}</span>
</div>
```

### Adding `b-key` to `@for` loops

When looping through data in a Liveblade component template using `@for`, you must add a unique `b-key` attribute to the root element rendered by the loop.

Without a `b-key` attribute present within a PyBlade loop, Liveblade won't be able to properly match old elements to their new positions when the loop changes. This can cause many hard to diagnose issues in your application.

For example, if you are looping through a list of tasks, you may set the `b-key` attribute to the task's ID:

```blade
<div>
    @for (task in tasks)
        <div b-key="{{ task.id }}">  // [!code highlight]
            {# ... #}
        </div>
    @endfor
</div>
```

<!-- If you are looping through a liqr that is rendering Liveblade components you may set the key as a component attribute `:key` or pass the key as a third argument when using the `@liveblade` directive.

```blade
<div>
    @for (task in tasks)
        <liveblade:task-item :task="task" :key="task.id"/>

        @liveblade("task-item", {"task": task}, key=task.id)
    @endforeach
</div>
``` -->

### Binding inputs to properties

One of Liveblade's most powerful features is "data binding": the ability to automatically keep properties in-sync with form inputs on the page.

Let's bind the `title` property from the `TodoList` component to a text input using the `b-model` attribute:

```blade
<form>
    <label for="title">Title:</label>

    <input type="text" id="title" b-model="title"/> // [!code highlight]
</form>
```

Any changes made to the text input will be automatically synchronized with the `title` property in your Liveblade component.

> [!warning] "Why isn't my component live updating as I type?"
> If you tried this in your browser and are confused why the title isn't automatically updating, it's because Liveblade only updates a component when an "action" is submitted—like pressing a submit button—not when a user types into a field. This cuts down on network requests and improves performance. To enable "live" updating as a user types, you can use `b-model.live` instead. [Learn more about data binding](#).


Liveblade properties are extremely powerful and are an important concept to understand. For more information, check out the [Liveblade properties documentation](/docs/properties).

## Calling actions

Actions are methods within your Liveblade component that handle user interactions or perform specific tasks. They're often useful for responding to button clicks or form submissions on a page.

To learn more about actions, let's add a `save` action to the `CreatePost` component:

```python
from my_app.models import Task

class TodoList(liveblade.Component):
    title = "Learn PyBlade"

    def save(self):
         if self.title:
            Task.objects.create(title=self.title)

    def render(self):
        return self.view("liveblade.todo-list")
```


Next, let's call the `save` action from the component's template by adding the `b-submit` directive to the `<form>` element:

```blade
<form b-submit="save"> // [!code highlight]
    <label for="title">Title:</label>

    <input type="text" id="title" b-model="title">

    <button type="submit">Save</button>
</form>
```

When the "Save" button is clicked, the `save()` method in your Liveblade component will be executed and your component will re-render.

To keep learning about Liveblade actions, visit the [actions documentation](#).
