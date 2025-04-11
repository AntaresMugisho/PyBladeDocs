# Validation

Liveblade provides a flexible and intuitive validation system that can be used to validate both individual **properties** and entire **forms**.

Here’s an example `PostCreate` component that demonstrates the most basic validation workflow in Liveblade:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):
	title: str = ""
	content: str = ""

	def save(self):
		validated = self.validate({  # [!code highlight:3]
			'title': 'required|string|min:3',
			'content': 'required|string|max:5000',
		})

		Post.objects.create(**validated)

		return self.redirect('/posts')

	def render(self):
		return self.view('liveblade.create-post')
```

As you can see, Liveblade provides a `validate()` method you can call inside any component action to validate the component’s state. It returns the validated data, which you can safely use — for example, to create a database record.

On the frontend, validation errors are displayed using existing PyBlade directives like `@error`.

```blade
<form b-submit="save">
	<input type="text" b-model="title">
	<div>@error('title') {{ message }} @enderror</div>

	<textarea b-model="content"></textarea>
	<div>@error('content') {{ message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

## Property-Based validation with `@validators`

If you prefer to keep your validation rules close to the properties they apply to, Liveblade offers a convenient `@validators` decorator.

By attaching validation rules directly to component properties using `@validators`, Liveblade will automatically validate those properties whenever they are updated. This is especially useful for real-time validation and cleaner component logic.

However, when you're about to **persist data** (e.g., saving to a database), it's important to still call `self.validate()` manually. This ensures that **all** properties are validated — including those that haven't changed during the current interaction.

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):

    @property
    @validators("required|string|min:3")
    def title(self): pass

    @property
    @validators("required|string|max:5000")
    def content(self): pass

    def save(self):
        self.validate()
        Post.objects.create(title=self.title, content=self.content)
        return self.redirect('/posts')

    def render(self):
        return self.view('liveblade.create-post')
```

>[!Note]
>Validation rules may be a list of strings, or a string of `|` (pipe) separated values.


> [!tip] Pro Tip !
> You can omit the `@property` decorator. When using `@validators`, Liveblade automatically treats the method as a property for you.

### Disabling auto-validation

If you want **full control** over when validation happens, you can disable the automatic validation behavior by setting `on_update=False` in the `@validators` decorator. This tells Liveblade not to validate the property on every update—you’ll handle validation manually instead, typically using `self.validate()` in your action methods:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):

    @validators("required|string|min:3", on_update=False)
    def title(self): pass

    @validators("required|string|max:5000", on_update=False)
    def content(self): pass

    def save(self):
        validated = self.validate()  # [!code highlight]
        Post.objects.create(**validated)
        return self.redirect('/posts')
```

This approach is useful when you only want to validate inputs at specific points in the workflow, such as right before form submission or a save operation.


### Disabling Localization

By default, PyBlade will localize validation messages using your framework's translation system, if available, else, PyBlade translation system will be used.

To disable automatic translation and keep messages exactly as defined, set `translate=False` in the decorator:

```python
class PostCreate(liveblade.Component):

    @validators("required", message="Please provide a post title", translate=False)
    def title(self): pass
```

This ensures the validation message is displayed exactly as written, without being passed through a translation layer.


## Customizing error messages

Out-of-the-box, PyBlade provides sensible validation messages like "The title field is required." if the `title` property has the `required` rule attached to it.

However, you may need to customize the language of these error messages to better suite your application and its users.

### Custom property names

Sometimes the property you are validating has a name that isn't suited for displaying to users. For example, if you have a database field in your app named `dob` that stands for "Date of birth", you would want to show your users _"The date of birth field is required"_ instead of _"The dob field is required"_.


Liveblade allows you to specify an alternative name for a property using the `aslias` parameter in `@validators` decorator :

```python
@validators('required', alias='date of birth')
def dob(self): pass
```

Now, if the validation fails, PyBlade will use **"date of birth"** instead of **"dob"** in the error message. So instead of saying _"The dob field is required"_, the message will read: _"The date of birth field is required"_.

### Custom validation messages

Sometimes, customizing the property name isn't enough. You may need to customize the entire validation message.
To override the default validation message provided by PyBlade, you can use the `message` parameter inside the `@validators` decorator:

```python
class PostCreate(liveblade.Component):

    @validators("required", message="Please provide a post title")
    def title(self): pass
```

Now, if validation fails, the message will be: _"Please provide a post title"_ instead of the default _"The title field is required"_.

You can also define different messages for different rules by passing a diactionnary to the `message` parametter :

```python
class PostCreate(liveblade.Component):

    @validators("required|min", message={"required": "Please provide a post title", "min": "This title is too short"})
    def title(self): pass
```

In this case:
- If the field is empty, the message will be _"Please provide a post title"_
- If it's too short, it will show: _"This title is too short"_


## Defining a `validators()` method

As an alternative to Liveblade's `@validators` decorator, you can define a method in your component called `validators()` and return a list of fields and corresponding validation rules.

These rules will then be applied when you run `self.validate()` inside the component. You also can define the `validation_attributes` and `messages()` functions.

Here's an example:

```python
from pyblade import livablade
from app.models import Post

class PostCreate(liveblade.Component):

    def validators(self): # [!code highlight:5]
        return {
            'title' => "required|min:3",
            'content' => 'required|min:20|max:5000',
        }

    def messages(self): # [!code highlight:5]
        return {
            'content.required': 'The content are missing.',
            'content.min': 'The content is too short.',
        }

    def validation_attributes(self): # [!code highlight:2]
        return {'dob' => 'date of birth'}

    def save(self)
        self.validate()
		Post.objects.create(title=self.title, content=self.content)
```

> [!warning] The `validators()` method doesn't validate on data updates
> When defining rules via the `validators()` method, Liveblade will ONLY use these validation rules to validate properties when you run `self.validate()`. This is different than standard `@validators` decorators which are applied every time a field is updated via something like `b-model`. To apply these validation rules to a property every time it's updated, you can still use `@validators` with no extra parameters.

> [!warning] Don't conflict with Liveblade's mechanisms
> While using Liveblade's validation utilities, your component should **not** have properties or methods named `validators`, `messages` or `validation_attributes`, unless you're customizing the validation process. Otherwise, those will conflict with Liveblade's mechanisms.


## Form classes

As more properties and validation rules are added to a Liveblade component, it can begin to feel too crowded. To alleviate this pain and also provide a helpful abstraction for code reuse, Liveblade offers **Form classes**, inspired by Django-style forms. These are especially useful for Python web frameworks that don’t offer form validation features out of the box.

Below is the same `PostCreate` example, but now the properties and rules have been extracted to a dedicated form class named `PostForm`:

```python
# livablade/forms.py
from pyblade import forms # [!code highlight]

class PostForm(forms.Form):
    title = forms.CharField(required=True, min_lenght=3)
    content = forms.TextField(required=True,max_length=5000)
```

The `PostForm` above can now be defined as a property on the `CreatePost` component:

```python{6,9,10}
from pyblade import liveblade
from .forms import PostForm

class PostCreate(liveblade.Component):

    form: PostForm

    def save(self):
        if self.form.is_valid(): 
            Post.objects.create(**self.form.validated)

		return redirect('/posts')
    ...
```

As you can see, instead of listing out each property individually, we can retrieve all the property values using the `.validated` attribute on the form class.

Also, when referencing the property names in the template, you must prepend `form.` to each instance:

```blade
<form b-submit="save">
	<input type="text" b-model="form.title">
    <div>@error('form.title') {{ message }} @enderror</div>

	<textarea b-model="form.content"></textarea>
    <div>@error("form.content") {{ message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

Form classes are a useful abstraction for most larger datasets and a variety of additional features that make them even more powerful. For more information, check out the comprehensive [form objects documentation](/liveblade/forms#extracting-a-form-object).

