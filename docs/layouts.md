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