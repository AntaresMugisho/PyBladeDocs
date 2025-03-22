<!-- # Magic properties Cfr Magic actions in Actions -->

# Properties

Liveblade components have properties that store data and can be easily accessed within the component's class and template. Properties are defined as attributes on component classes and can be accessed and modified on both the server and client-side. 

This section discusses the basics of adding a property to a component and using it in your application.

## Initializing properties

In a standard Python class, to initialize properties or attributes, we use the `__init__()` dunder method. However, in a Liveblade's component class, you can set initial values for properties within your component's `mount()` method.

```python
from pyblade import liveblade
from app.models import Task

class TodoList(liveblade.Component):

    def mount(self):
        self.tasks = Task.objects.all()
```

In this example, when the component renders for the first time, all the existing tasks in the database are made available through the `tasks` variable.


Alternatively, you may declare properties in your component class, making them what are known as "class attributes". For example, let's create a `title` property in the `TodoList` component:

```python
from pyblade import liveblade

class TodoList(liveblade.Component):

    title = "Learn PyBlade"

    def render(self):
        return self.view("liveblade.todo-list")
```

## Accessing properties in the template

Component properties are automatically made available to the component's context. You can reference them using standard PyBlade syntax. Here we'll display the value of the `title` property:

```html
<div>
    <h1>Title: {{ title }}</h1>
</div>
```

The rendered output of this component would be:

```html
<div>
    <h1>Title: Learn PyBlade</h1>
</div>
```

## Sharing additional data with the template

In addition to accessing class properties from the template, you can explicitly pass data to the template from the `render()` method, like you might typically do from a view in Django. This can be useful when you want to pass additional data without first storing it as a property — because properties have [specific security implications](#).

To pass data to the view in the `render()` method, you can add a dictionnary as second parameter to the returned `view()` method. For example, let's say you want to pass the task status to the template.

```python
class TodoList(liveblade.Component):

    title = "Learn PyBlade"

    def render(self):
        return self.view("liveblade.todo-list", context={"status": "In progress"}) # [!code highlight]

```


Now you may access the `status` property from the component's template like this:

```html
<div>
    <h1>Title: {{ title }}</h1>

    <span>Status: {{ status }}</span>
</div>
```


## Data binding

One of Liveblade's most powerful features is "data binding": the ability to automatically keep properties in-sync with form inputs on the page.

Liveblade supports two-way data binding through the `b-model` HTML attribute. This allows you to easily synchronize data between component properties and HTML inputs, keeping your user interface and component state in sync.

Let's use the `b-model` directive to bind the `title` property in our `TodoList` component to a basic input element:

```python
from pyblade import liveblade
from app.models import Task

class TodoComponent(liveblade.Component):

    title: str = ""

    def render(self):
        return self.view("liveblade.todo-list")
```

```html
<div>
    <h1>{{ title }}</h1>
    <input type="text" b-model="title" /> // [!code highlight] 
</div>
```

Any changes made to the text input will be automatically synchronized with the `title` property in your Liveblade component.

> [!warning] "Why isn't my component live updating as I type?"
> If you tried this in your browser and are confused why the title isn't automatically updating, it's because Liveblade only updates a component when an "action" is submitted — like pressing a submit button — not when a user types into a field. This cuts down on network requests and improves performance. To enable "live" updating as a user types, you can use `b-model.live` instead.



This is just scratching the surface of `b-model`. We will go deeper when we'll talk about [Forms](liveblade/forms) in Liveblade.

## Resetting properties

Sometimes, you may need to reset your properties back to their initial state after an action is performed by the user. In these cases, Liveblade provides a `reset()` method that accepts one or more property names and resets their values to their initial state.

In the example below, we can avoid code duplication by using `self.reset()` to reset the `title` field after the "Add Todo" button is clicked:

```python
from pyblade import liveblade
from app.models import Task

class TodoComponent(liveblade.Component):

    title = ""

    def render(self):
        return self.view("liveblade.todo-list")

```

In the above example, after a user clicks "Add Todo", the input field holding the title that has just been added will clear, allowing the user to write a new title.

> [!warning] Warning
> `reset()` won't work on values set in `mount()`.
> `reset()` will reset a property to its state before the `mount()` method was called. If you initialized the property in `mount()` to a different value, you will need to reset the property manually.

## Pulling properties

Alternatively, you can use the `pull()` method to both reset and retrieve the value in one operation.

Here's the same example from above, but simplified with `pull()`:

```python
from pyblade import liveblade
from app.models import Task

class TodoComponent(liveblade.Component):

    title = ""

    def add(self):
        if self.title:
            Task.objects.create(title=self.pull("title")) # [!code highlight]
```

---
Liveblade properties are extremely powerful and are an important concept to understand. For more information, check out the [Liveblade properties documentation](#).


## Security concerns
<!-- 
While Liveblade properties are a powerful feature, there are a few security considerations that you should be aware of before using them.

In short, always treat public properties as user input — as if they were request input from a traditional endpoint. In light of this, it's essential to validate and authorize properties before persisting them to a database — just like you would do when working with request input in a controller.

### Don't trust property values

To demonstrate how neglecting to authorize and validate properties can introduce security holes in your application, the following `UpdatePost` component is vulnerable to attack:

```python
from pyblade import liveblade
from app.models import Post

class UpdatePost(liveblade.Component)
   
    def mount(self, post: Post):
        self.id = post.id
        self.title = post.title
        self.content = post.content
      
    def update(self):        
        post = Post.objects.get(self.id)
        post.update(title=self.title, content=self.content)

    def render(self):
        return self.view('liveblade.update-post')
```

```html
<form b-submit="update">
    <input type="text" b-model="title">
    <input type="text" b-model="content">

    <button type="submit">Update</button>
</form>
```

At first glance, this component may look completely fine. But, let's walk through how an attacker could use the component to do unauthorized things in your application.

Because we are storing the `id` of the post as a public property on the component, it can be manipulated on the client just the same as the `title` and `content` properties.

It doesn't matter that we didn't write an input with `b-model="id"`. A malicious user can easily change the template to the following using their browser DevTools:

```html
<form b-submit="update">
    <input type="text" b-model="id"> // [!code highlight] 
    <input type="text" b-model="title">
    <input type="text" b-model="content">

    <button type="submit">Update</button>
</form>
```

Now the malicious user can update the `id` input to the ID of a different post model. When the form is submitted and `update()` is called, `Post.objects.get()` will return and update a post the user is not the owner of.

To prevent this kind of attack, we can use one or both of the following strategies:

* Authorize the input
* Lock the property from updates

#### Authorizing the input

Because `id` can be manipulated client-side with something like `b-model`, just like in a controller, we can use [Django's authorization](#) to make sure the current user can update the post:

```python
def update(self):
    self.authorize('update', post) # [!code highlight]
    post.update(...)
```

If a malicious user mutates the `id` property, the added authorization will catch it and throw an error.

#### Locking the property

Liveblade also allows you to "lock" properties in order to prevent properties from being modified on the client-side. You can "lock" a property from client-side manipulation using the `@locked` decorator:

```python
# Snipets example of locking properties
```

Now, if a user tries to modify `id` on the front end, an error will be thrown.

By using `@locked`, you can assume this property has not been manipulated anywhere outside your component's class.

For more information on locking properties, [consult the Locked properties documentation](#).

<!-- ### Properties expose system information to the browser -->
 -->
