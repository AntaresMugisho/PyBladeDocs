<!-- # Magic properties Cfr Magic actions in Actions -->
# Properties

Properties store and manage data inside your Liveblade components. They are defined as attributes on component classes and can be accessed and modified on both the server and client-side.

## Initializing properties

You can set initial values for properties within your component's `mount()` method.

Consider the following example:

```python
from pyblade import liveblade
from app.models import Task

class TodoList(liveblade.Component):

    def mount(self):
        self.tasks = Task.objects.all()
```

In this example, when the component renders for the first time, all the existing tasks in the database are made available through the `tasks` variable into the components template.

## Data binding

Liveblade supports two-way data binding through the `b-model` HTML attribute. This allows you to easily synchronize data between component properties and HTML inputs, keeping your user interface and component state in sync.

Let's use the `b-model` directive to bind the `title` property in our `TodoList` component to a basic input element:

```python
from pyblade import liveblade
from app.models import Task

class TodoComponent(liveblade.Component):

    title = ""

    def add(self):
        if self.title:
            Task.objects.create(title=self.title)
```

```html
<div>
    <input type="text" b-model="title" placeholder="Title..."> # [!code highlight] 

    <button b-click="add">Add Task</button>

    <ul>
        @for (task in tasks)
            <li>{{ task.title }}</li>
        @endfor
    </ul>
</div>
```

In the above example, the text input's value will synchronize with the `title` property on the server when the **"Add Todo"** button is clicked.

This is just scratching the surface of `b-model`. For deeper information on data binding, check out our [documentation on forms](#).

## Resetting properties

Sometimes, you may need to reset your properties back to their initial state after an action is performed by the user. In these cases, Liveblade provides a `reset()` method that accepts one or more property names and resets their values to their initial state.

In the example below, we can avoid code duplication by using `self.reset()` to reset the `title` field after the "Add Todo" button is clicked:

```python
from pyblade import liveblade
from app.models import Task

class TodoComponent(liveblade.Component):

    title = ""

    def add(self):
        if self.title:
            Task.objects.create(title=self.title)
            self.reset("title") # [!code highlight]

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
