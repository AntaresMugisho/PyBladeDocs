# Building Layouts 

Most web applications share a common structure across multiple pages. Repeating the entire layout in every view would be inefficient and difficult to maintain. With PyBlade, you can define a layout as a single component and reuse it throughout your application.

## Layouts using Components

### Defining the layout component  
For instance, let's say we are creating a task management application. We can define a layout component like this:

```html
<!-- templates/components/layout.html -->

<html>
    <head>
        <title>{{ title or 'Task Manager' }}</title>
    </head>
    <body>
        <h1>Task List</h1>
        <hr/>
        {{ slot }}
    </body>
</html>
```

### Applying the layout component  
Once the layout component is defined, we can use it in different templates. Below is a simple example that displays a list of tasks:

```html
<!-- templates/tasks.html -->

<b-layout>
    {% for task in tasks %}
        <div>{{ task }}</div>
    {% endfor %}
</b-layout>
```

Any content passed into a component will be available inside the default `slot` variable. Additionally, if a `title` slot is provided, it will replace the default title. We can customize the title using a named slot:

```html
<!-- templates/tasks.html -->

<b-layout>
    <b-slot:title>Custom Task Title</b-slot>

    {% for task in tasks %}
        <div>{{ task }}</div>
    {% endfor %}
</b-layout>
```

### Rendering the template in Django  
To return thi `tasks.html` template in a Django application, you can simply use the `render` function in the `views.py` file:

```python
from django.shortcuts import render
from .models import Task

def task_list(request):
    tasks = Task.objects.all()
    return render(request, 'tasks.html', {'tasks': tasks})
```

With this approach, PyBlade allows you to create reusable layouts, making your views cleaner and easier to maintain.

## Layouts using Template Inheritance

In addition to using components for building layouts, PyBlade allows you to structure your application using template inheritance.

Template inheritance allows you to define a **base layout** that multiple pages can extend. This keeps your templates clean and maintains a consistent structure across your application. 

### Defining a Layout  

A layout is a reusable template that other templates can inherit from. Below is an example of a **base layout**:

```html
<!-- templates/layouts/base.html -->

<html>
    <head>
        <title>My App - {{ title }}</title>
    </head>
    <body>
        <header>
            <h1>Welcome to My App</h1>
        </header>

        <aside>
            @yield('sidebar', '<p>This is the default sidebar.</p>')
        </aside>

        <main>
            @yield('content')
        </main>

        <footer>
            © 2025 - My App
        </footer>
    </body>
</html>
```

As you can see, this file contains typical HTML markup. However, take note of the `@yield` directive. The `@yield` directive is used in the layout to display the contents of a given section. Additionally, `@yield` can accept a default value, ensuring that if a section is not overridden, a fallback content is provided.

You should also notice the presence of the `title` variable inside the `<title>` tag in the document's `<head>` section. Rather than using `@yield` for this, we will create a **named slot** to allow child templates to provide a custom page title dynamically.

Now that we have defined a layout for our application, let's create a child page that inherit the layout.

### Extending a Layout

In PyBlade, to extend a layout in a child template, you can use the `@extends` directive. This tells PyBlade which parent layout to inherit, allowing the child template to inject content into specific sections of the layout using the `@section` directive. The sections defined in the child template will then replace the corresponding `@yield` directives in the layout.

For example, let’s say we have the following child view:

```html
<!-- templates/child.html -->
 
@extends('layouts.base')

<b-slot:title>Page Title</b-slot>

@section('sidebar')
    @parent
    <p>This is appended to the master sidebar.</p>
@endsection

@section('content')
    <p>This is my body content.</p>
@endsection
```

Here, the `@extends('layouts.app')` means that this child template is inheriting from `layouts.base`.

>[!info] Note
>It’s important to note that in PyBlade, we use **dot notation** to refer to template files, which helps represent nested directories or files.
>By using `@extends('layouts.base')`, you're telling PyBlade that this child template should inherit from the `base.html` layout, which resides in the `templates/layouts/` folder.


Instead of using `@section` for the title, we use a **named slot**. In the child template, we define the title with `<b-slot:title>Page Title</b-slot>`. In the layout, we access this slot as a variable.

For the `sidebar` section, we use the `@parent` directive. This means we’re appending new content to the layout’s original sidebar rather than replacing it completely. The `@parent` directive outputs whatever is defined in the parent layout's sidebar section (`@yield('sidebar')`), then adds the new content specified in the child template.

The `@section` and `@endsection` directives are used to define content for each section, and PyBlade will automatically replace the `@yield` directive in the layout with the content from the child.


### The `@block` directive  

For convenience, PyBlade provides a `@block` directive that is **an alias for `@section`**.

Example:

```html
@extends('layouts.base')

@block('content')
    <p>This is the main content.</p>
@endblock
```

This behaves exactly like:

```html
@section('content')
    <p>This is the main content.</p>
@endsection
```


>[!warning] Important
> Unlike Django's Default Template engine, where the `block tag` is used in both the layout and child templates, PyBlade uses the `@section` or `@block` directives to define content in child templates, while `@yield` is used in the layout to display these sections.

