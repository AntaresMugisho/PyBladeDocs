# Lifecycle Hooks

Liveblade provides various lifecycle hooks that allow you to execute code at specific points during a component's lifecycle. These hooks let you perform actions before or after certain events, such as initializing the component, updating properties, or rendering the template.

Here’s a list of the available lifecycle hooks:

| Hook Method          | Description                                                                   |
|----------------------|-------------------------------------------------------------------------------|
| `mount()`           | Called when a component is initialized the first time                                            |
| `boot()`            | Called at the beginning of every request, both initial and subsequent         |
| `update()`        | Called when a component is updated                                   |
| `serialize()`         | Called when a component is re-hydrated at the beginning of a subsequent request |
| `deserialize()`       | Called at the end of every component request                                  |
| `render()`        | Called after `render()` is called                                             |
| `exception(e, stop_propagation)` | Called when an exception is thrown                     |                    |

## Mount

In a typical Python class, a constructor (`__init__()`) initializes an object’s state. However, in Liveblade components, the `mount()` method is used instead because components are _reconstructed_ on each network request, and we only want to initialize the component once when it is first created.

Here's an example of how to use the `mount()` method to initialize `name` and `email` in an `UpdateProfile` component:

```python
from pyblade import liveblade
from pyblade.liveblade import auth

class UpdateProfile(liveblade.Component):

    def mount(self):
        user = auth()
        self.name = user.name
        self.email = user.email
```

The `mount()` method can also receive parameters when the component is initialized:

```python
from pyblade import Component
from app.models import Post

class UpdatePost(Component):

    def mount(self, post: Post):
        self.title = post.title
        self.content = post.content
```


The `mount()` method plays a crucial role in initializing Liveblade components. Here are some common use cases:

- Initializing properties  
- Receiving data from parent components and templates  
- Accessing route parameters  

---

## Boot

While `mount()` is helpful, it only runs **once** when the component is first created. However, sometimes you may need to run logic at the beginning of every single request to the server for a given component

For this purpose, Liveblade provides the `boot()` method where you can write component setup code that you intend to run every single time the component class is booted: both on initialization and on subsequent requests.

The `boot()` method can be useful for things like initializing private properties, which are not persisted between requests. Below is an example of initializing a private property as a Post model:

```python
from pyblade import liveblade
from app.models import Post

class ShowPost(liveblade.Component):
    _post_id = 1  # Private property that users cannot access or change

    def boot(self):
        self._post = Post.objects.get(id=self._post_id)
```

This approach allows you to have full control over initializing a property in a Liveblade component.

>[!note] Note 
> In many cases, using a **computed property** may be a better alternative.

>[!warning] Warning 
> Always use private properties for sensitive data.
> Since `_post_id` is used to fetch a post, it should not be modified by users. In Liveblade, public properties should be carefully validated before use.


## Update

Client-side users can update public properties in many different ways, most commonly by modifying an input with `b-model` on it.

Liveblade provides convenient hooks to intercept the updating of a property so that you can validate or authorize a value before it's set or ensure a property is set in a given format.

### The `updating()` method

Below is an example of using `updating()` to prevent the modification of the `post_id` property.

It's worth noting that for this particular example, in an actual application, you should use a **private attributes** instead, as demonstrated in the previous sections.


```python
from pyblade import liveblade

class PostDetail(liveblade.Component):
    post_id = 1
    
    def updating(self, property: str, value):
        """
        property: The name of the current property being updated
        value: The value about to be set to the property
        """
       
        if property == "post_id":
            raise ValueError("Modifying post_id is not allowed.")
```

The `updating()` method runs **before** the property is updated, allowing you to catch invalid input and prevent changes. 

### The `updated()` method

Below is an example of using `updated()` to ensure a property's value stays consistent:


```python
from pyblade import Component

class CreateUser(Component):
    username = ""
    email = ""
    
    def updated(self, property: str):
        """
        property: The name of the current property that was updated
        """
        
        if property == "username":
            self.username = self.username.lower()
```

Now, anytime the `username` property is updated client-side, Liveblade will ensure that the value remains lowercase.

### Direct Property Hook Naming

Because you are often targeting a specific property when using update hooks, Liveblade allows you to specify the property name directly as part of the method name. Here's the same example from above but rewritten utilizing this technique:

```python
from pyblade import Component

class CreateUser(Component):
    username = ""
    email = ""
    
    def updated_username(self):
        self.username = self.username.lower()
```

Of course, you can also apply this technique to the `updating` hook.


## Serialize & Deserialize

Serialize and deserialize are lesser-known and lesser-utilized hooks. However, there are specific scenarios where they can be powerful.

The terms "serialize" and "deserialize" refer to a Liveblade component being converted to JSON for the client-side and then converted back into a Python object on the subsequent request.

We often use the terms "serialize" and "deserialize" to refer to this process throughout Liveblade's codebase and documentation. 
<!-- If you'd like more clarity on these terms, you can learn more by [consulting our serialization documentation](#). -->

Let's look at an example that uses both `mount()`, `serialize()`, and `deserialize()` all together to support using a custom [data transfer object (DTO)](https://en.wikipedia.org/wiki/Data_transfer_object) instead of a Django model to store the Post data in the component:

```python
from pyblade import liveblade

class ShowPost(liveblade.Component):
    post = None
    
    def mount(self, title, content):
        # Runs at the beginning of the first initial request...
        
        self.post = PostDto({
            'title': title,
            'content': content,
        })
    
    def serialize(self):
        # Runs at the beginning of every "subsequent" request...
        # This doesn't run on the initial request ("mount" does)...
        
        self.post = PostDto(self.post)
      
    
    def deserialize(self):
        # Runs at the end of every single request...
        self.post = self.post.to_dict()
        
```

Now, from actions and other places inside your component, you can access the `PostDto` object instead of primitive data.

The above example mainly demonstrates the abilities and nature of the `serialize()` and `deserialize()` hooks. 

## Render

If you want to hook into the process of rendering a component's Pyblade template, you can use the `rendering()` and `rendered()` hooks:

```python
from pyblade import livablade
from app.models import Post

class ShowPosts(livablade.Component):
    def render(self):
        return self.view("show-posts", {
            "posts": Post.objects.all()
        })
    
    def rendering(self, template, context):
        # Runs BEFORE the provided template is rendered...
        #
        # template: The name of the template about to be rendered
        # context: The data provided to the view
        pass
    
    def rendered(self, template, html):
        # Runs AFTER the provided template is rendered...
        #
        # template: The name of the rendered template
        # html: The final, rendered HTML
        pass
```

These hooks allow you to modify data before rendering and process the final output after rendering if needed.

## Exception

Sometimes, it can be helpful to intercept and catch errors, such as customizing error messages or ignoring specific types of exceptions. The `exception()` hook allows you to do just that. You can check the error type and use the `stop_propagation()` method to prevent further execution.

```python
from pyblade import liveblade
from app.models import Post

class ShowPost(liveblade.Component):

    def mount(self):
        self.post = Post.objects.get(id=1)
    
    def exception(self, exc, stop_propagation):
        if isinstance(exc, Post.DoesNotExist):
            self.notify("Post not found")
            stop_propagation()
```
This hook enables better error handling and control over exceptions in Liveblade components.