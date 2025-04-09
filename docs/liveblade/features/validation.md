# Validation

Liveblade aims to make validating a user's input and giving them feedback as pleasant as possible. By building on top of Django's validation features, Liveblade leverages your existing knowledge while also providing you with robust, additional features like real-time validation.

Here's an example `PostCreate` component that demonstrates the most basic validation workflow in Liveblade:

```python
from pyblade import liveblade

class PostCreate(liveblade.Component):

    title: str = ""
    content: str = "

    def save(self):
        validated = self.validate({  # [!code highlight:3]
            'title': 'required|min:3',
            'content': 'required|min:3',
        })
        
        Post.objects.create(**validated)

        return self.redirect('/posts')

    def render(self):
        return self.view('liveblade.create-post');
```

```blade
<form b-submit="save">
    <input type="text" b-model="title">
    <div>@error('title') {{ message }} @enderror</div>

    <textarea b-model="content"></textarea>
    <div>@error('content') {{ message }} @enderror</div>

    <button type="submit">Save</button>
</form>
```

As you can see, Liveblade provides a `validate()` method that you can call to validate your component's properties. It returns the validated set of data that you can then safely insert into the database.

On the frontend, you can use PyBlade's existing directives to show validation messages to your users.

