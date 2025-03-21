# Quick Start

To begin your Liveblade journey, we will create a simple "counter" component and render it in the browser. This example is a great way to experience Liveblade for the first time as it demonstrates PyBlade's _liveness_ in the simplest way possible.

## Install Liveblade

Since **Liveblade** is a part of **PyBlade**, you first need to install PyBlade inside a virtual environment. To do this, run:  

```bash
pip install pyblade
```  

Once installed, initialize a new project for your preferred Python framework:  

```bash
pyblade init
```  

During the project initialization, PyBlade will ask whether you want to enable Liveblade:  

- If you select **Yes**, Liveblade will be fully configured, and you can start using it right away.  
- If you select **No**, Liveblade won’t be set up initially, but you can enable it later by running:  

```bash
pyblade liveblade:install
```

This command will automatically configure everything for Liveblade to work inside your project.

## Create a Liveblade component

PyBlade provides a convenient command to generate new **Livablade components** quickly. Run the following command to make a new `counter` component:

```bash
pyblade make:livablade counter
```

This command will generate two new files in your project:
* `liveblade/counter.py`
* `templates/liveblade/counter.html`

## Writing the class

Open `liveblade/counter.py` and replace its contents with the following:

```python
from pyblade import liveblade

class Counter(liveblade.Component):
    count = 0

    def increment(self):
        self.count += 1

    def decrement(self):
        self.count -= 1

    def render(self):
        return self.view("liveblade.counter")
```

Here's a brief explanation of the code above:
- `count = 0` — Declares a class property named `count` with an initial value of `0`.
- `def increment(self)` — Declares a method named `increment` that increments the `count` property each time it's called. Methods like this can be triggered from the browser in a variety of ways, including when a user clicks a button.
- `def decrement(self)` — Declares a method named `decrement` that decrements the `count` property each time it's called.
- `def render(self)` — Declares a `render` method that returns a Liveblade view. This view will contain the HTML template for our component.

## Writing the template

Open the `templates/liveblade/counter.html` file and replace its content with the following:

```html
<div >
    <h1>{{ count }}</h1>

    <button b-click="decrease">-</button>
    <button b-click="increase">+</button>
</div>
```

This code will display the value of the `count` property and two buttons that decrement and increment the `count` property, respectively.

> [!warning] Warning
> In order for Liveblade to work, components must have just **one** single element as its root. If multiple root elements are detected, an exception is thrown.  Comments don't count as separate elements and can be put inside the root element.

## Create the component wrapper

You just created the liveblade component. But, how to use it ?
Now we need a HTML template for our component to render inside. Let's create one:

```bash
pyblade make:template index
```

This command will generate a file called `templates/index.html`. Open it and add the following content :

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Title</title>
    </head>
    <body>
        @liveblade("counter") // [!code ++]
    </body>
</html>
```

The _counter_ component will be rendered in place of the `@liveblade("counter")` directive in the template above.

You may have noticed there is no JavaScript or CSS assets provided by Liveblade. That is because Liveblade automatically injects any frontend assets it needs.

Now let's create the view function that will render our `index.html` template. Open the `view.py` file and add the following content:

```python
from django.shortcuts import render

def index(request):
    return render(request, "index")
```

## Register a route for the component

Open the `urls.py` file in your Django application and add the following code:

```python
from django.urls import path
from .views import index

urlpatterns = [
    path('counter/', index)
]
```

>[!warning]Warning
>Make sure the `views.py` and `urls.py` files are in the same folder.

Now, our _counter_ component is assigned to the `counter/` route, so that when a user visits the `counter/` endpoint in your application, PyBlade will load our `index.htm`l template, parse it, and when it will encouter the `@liveblade("counter")` directive, the directive will render our component, finally PyBlade Engine will render the full page.

## Test it out

With our component class and templates in place, our component is ready to test!

Start the development server by running:

```bash
pyblade serve
```

Visit whatever the link shown in your terminal plus `counter/` in your browser (most likely `http:127.0.0.1:8000/counter/`), and you should see a number displayed on the screen with two buttons to increment and decrement the number.

After clicking one of the buttons, you will notice that the count updates in **real time**, **without the page reloading**. This is the magic of Liveblade: dynamic frontend applications written entirely in Python.

We've barely scratched the surface of what Liveblade is capable of. Keep reading the documentation to see everything Liveblade has to offer.
