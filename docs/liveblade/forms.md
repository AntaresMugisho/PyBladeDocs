# Forms

Because forms are the backbone of most web applications, Liveblade provides loads of helpful utilities for building them. From handling simple input elements to complex things like real-time validation or file uploading, Liveblade has simple, well-documented tools to make your life easier and delight your users.

Let's dive in.

## Basic usage

Let's start by looking at a very simple form in a `PostCreate` component. This form will have two simple text inputs and a submit button, as well as some code on the backend to manage the form's state and submission:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):

    title: str = ""
    content: str = ""

    def save(self):
        Post.objects.create(title=self.title, content=self.content)
        # self.flash('status', 'Post successfully created.') Comming soon feature
        return self.redirect('/posts')

    def render(self):
        return self.view("liveblade.post-create")
```

```blade
<form b-submit="save">
    <input type="text" b-model="title">

    <input type="text" b-model="content">

    <button type="submit">Save</button>
</form>
```

As you can see, we are "binding" the public `title` and `content` properties in the form above using `b-model`. This is one of the most commonly used and powerful features of Liveblade.

In addition to binding `title` and `content`, we are using `b-submit` to capture the `submit` event when the "Save" button is clicked and invoking the `save()` action. This action will persist the form input to the database.

After the new post is created in the database, we redirect the user to the `ShowPosts` component page and show them a "flash" message that the new post was created.


## Live-updating fields

By default, Liveblade only sends a network request when the form is submitted (or any other [action](/liblade/actions) is called), not while the form is being filled out.

Take the `CreatePost` component, for example. If you want to make sure the "title" input field is synchronized with the `title` property on the backend as the user types, you may add the `.live` modifier to `b-model` like so:

```blade
<input type="text" b-model.live="title">
```

Now, as a user types into this field, network requests will be sent to the server to update `title`. This is useful for things like a real-time search, where a dataset is filtered as a user types into a search box.


### Debouncing input

When using `.live` on a text input, you may want more fine-grained control over how often a network request is sent. By default, a debounce of "250ms" is applied to the input; however, you can customize this using the `.debounce` modifier:

```blade
<input type="text" b-model.live.debounce.150ms="title" >
```

Now that `.debounce.150ms` has been added to the field, a shorter debounce of "150ms" will be used when handling input updates for this field. In other words, as a user types, a network request will only be sent if the user stops typing for at least 150 milliseconds.

### Throttling input

As stated previously, when an input debounce is applied to a field, a network request will not be sent until the user has stopped typing for a certain amount of time. This means if the user continues typing a long message, a network request won't be sent until the user is finished.

Sometimes this isn't the desired behavior, and you would rather send a request as the user types, not when they've finished or taken a break.

In these cases, you can instead use `.throttle` to signify a time interval to send network requests:

```blade
<input type="text" b-model.live.throttle.150ms="title" >
```

In the above example, as a user is typing continuously in the "title" field, a network request will be sent every 150 milliseconds until the user is finished.

### Live-updating only on _blur_

For most cases, `b-model.live` is fine for real-time form field updating; however, it can be overly network resource-intensive on text inputs.

If instead of sending network requests as a user types, you want to instead only send the request when a user "tabs" out of the text input (also referred to as "blurring" an input), you can use the `.blur` modifier instead:

```blade
<input type="text" b-model.blur="title" >
```

Now the component class on the server won't be updated until the user presses tab or clicks away from the text input.



## Form validation

To avoid storing incomplete or dangerous user input, most forms need some sort of input validation.

Liveblade makes validating your forms as simple as using the `@rules` decorator above the properties you want to be validated. This is similar to the python built-in `@property` decorator. So we are going to define our properties like methods.

Once a method has a `@rules` decorator attached to it, the validation rule will be applied to the property's value any time it's updated server-side.

Let's add some basic validation rules to the `title` and `content` properties in our `CreatePost` component:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):

    @rules("required") # [!code highlight]
    def title(self): pass

    @rules("required") # [!code highlight]
    def content(self): pass

    def save(self):
        self.validate() # [!code highlight]
        Post.objects.create(title=self.title, content=self.content)
        # self.flash('status', 'Post successfully created.') Comming soon feature
        return self.redirect('/posts')

    def render(self):
        return self.view("liveblade.post-create")
```

We'll also modify our PyBlade template to show any validation errors on the page. We will achieve this using the PyBlade `@error` directive.

```blade
<form b-submit="save">
    <input type="text" b-model="title">
    <div>
        @error('title') <span class="error">{{ message }}</span> @enderror <!-- [!code highlight] -->
    </div>

    <input type="text" b-model="content">
    <div>
        @error('content') <span class="error">{{ message }}</span> @enderror <!-- [!code highlight] -->
    </div>

    <button type="submit">Save</button>
</form>
```


Now, if the user tries to submit the form without filling in any of the fields, they will see validation messages telling them which fields are required before saving the post.

>[!Note]
>Validation rules may be a list strings, or a string of `|` (pipe) separated values.

You may also use the `rules()` method within your component to define validation rules. The method must return a `dictionary` where `keys` represent the names of properties you want to validate and `values` are the validation rules to apply, either a string of pipe-separated values or a list.
```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component):

    title: str = ""
    content: str = ""

    def rules(self): # [!code highlight:5]
        return {
            "title" : "required|min:5",
            "content" : ["required", "min:5"]
        }

    def save(self):
        self.validate() # [!code highlight]
        Post.objects.create(title=self.title, content=self.content)
        # self.flash('status', 'Post successfully created.') Comming soon feature
        return self.redirect('/posts')

    def render(self):
        return self.view("liveblade.post-create")
```

### Real-time validation

Sometimes, you may want to show validation errors as the user fills out the form. This way, they are alerted early that something is wrong instead of having to wait until the entire form is filled out.

Liveblade handles this sort of thing automatically. By using `.live` or `.blur` modifiers on `b-model`, Liveblade will send network requests as the user fills out the form. Each of those network requests will run the appropriate validation rules before updating each property. If validation fails, the property won't be updated on the server and a validation message will be shown to the user:

```blade
<input type="text" b-model.blur="title">

<div>
    @error('title') <span class="error">{{ message }}</span> @enderror
</div>
```

```python
from pyblade import liveblade
...
    @rules('required|min:5')
    def title(self)
```

Now, if the user only types three characters into the "title" input, then clicks on the next input in the form, a validation message will be shown to them indicating there is a five character minimum for that field.

>[!info]
>Liveblade has a lot more validation features to offer. For more information, visit our dedicated documentation page on [Validation](features/validation).

## Showing a loading indicator

By default, Liveblade will automatically disable submit buttons and mark inputs as `readonly` while a form is being submitted, preventing the user from submitting the form again while the first submission is being handled.

However, it can be difficult for users to detect this "loading" state without extra affordances in your application's UI.

Here's an example of adding a small loading spinner to the "Save" button via `b-loading` so that a user understands that the form is being submitted:

```blade
<button type="submit">
    Save

    <div b-loading>
        <svg>...</svg> <!-- SVG loading spinner -->
    </div>
</button>
```

Now, when a user presses "Save", a small, inline spinner will show up.

>[!info]
>You can learn more about the `b-loading` directive and other Liveblade directives in the [Liveblade Directives](liveblade-directives#b-loading) documentation.

## Real-time form saving

If you want to automatically save a form as the user fills it out rather than wait until the user clicks "submit", you can do so using Liveblade's `updated()` hook:

```python
from pyblade import liveblade
from app.models import Post

class PostUpdate(liveblade.Component):

    post: Post

    def rules(self):
        return {
            "title": "required"
            "content": "required"
        }

    def mount(self, post: Post):
        self.post = post
        self.title = post.title
        self.content = post.content

    def updated(self, property, value): # [!code highlight:3]
        setattr(self.post, property, value)
        self.post.save()

    def render(self):
        return view('liveblade.post-update')
```

```blade
<form b-submit>
    <input type="text" b-model.blur="title">
    <div>
        @error('title') <span class="error">{{ message }}</span> @enderror
    </div>

    <input type="text" b-model.blur="content">
    <div>
        @error('content') <span class="error">{{ message }}</span> @enderror
    </div>
</form>
```

In the above example, when a user completes a field (by clicking or tabbing to the next field), a network request is sent to update that property on the component. Immediately after the property is updated on the class, the `updated()` hook is called for that specific property name and its new value.

We can use this hook to update only that specific field in the database.

Additionally, because we have validation rules attached to those properties, the validation rules will be run before the property is updated and the `updated()` hook is called.

>[!info]
>To learn more about the `updated()` hook and other livecycle hooks, visit the [Lifecycle hooks](lifecycle-hooks) documentation.

## Showing dirty indicators

In the real-time saving scenario discussed above, it may be helpful to indicate to users when a field hasn't been persisted to the database yet.

For example, if a user visits an `PostUpdate` page and starts modifying the title of the post in a text input, it may be unclear to them when the title is actually being updated in the database, especially if there is no "Save" button at the bottom of the form.

Liveblade provides the `b-dirty` directive to allow you to toggle elements or modify classes when an input's value diverges from the server-side component:

```blade
<input type="text" b-model.blur="title" b-dirty.class="border-yellow">
```

In the above example, when a user types into the input field, a yellow border will appear around the field. When the user tabs away, the network request is sent and the border will disappear; signaling to them that the input has been persisted and is no longer "dirty".

If you want to toggle an entire element's visibility, you can do so by using `b-dirty` in conjunction with `b-target`. `b-target` is used to specify which piece of data you want to watch for "dirtiness". In this case, the "title" field:

```blade
<input type="text" b-model="title">

<div b-dirty b-target="title">Unsaved...</div>
```

## Extracting a form object

If you are working with a large form and prefer to extract all of its properties, validation logic, etc., into a separate class, Liveblade offers form objects.

>[!tip] Pro tip !
>If you are using Django, you may use Django  built-in Form objects. They are supported out of the box. Liveblade Form objects are made available for other frameworks that don't natively provide them.

Form objects allow you to re-use form logic across components and provide a nice way to keep your component class cleaner by grouping all form-related code into a separate class.

You can either create a form class by hand or use the convenient PyBlade CLI command:

```bash
pyblade livewire:form PostForm
```

The above command will create a file called `my_project/liveblade/forms/post_form.py`.

Let's rewrite the `PostCreate` component to use a `PostForm` class:

```python
from pyblade.liveblade import forms

class PostForm(forms.Form):
    title = forms.TextField(required=True, min_length=5)
    content = forms.TextField(required=True, min_length=5)
```

```python
from pyblade import liveblade
from components.forms import PostForm

class CreatePost(liveblade.Component)

    form: PostForm # [!code highlight]

    def save(self):
        if self.form.is_valid():
            Post.objects.create(
                title=self.form.title, # [!code highlight:2]
                content=self.form.content 
            )

        return self.redirect('/posts')

        def render(self):
                return self.view("liveblade.post-create")
```

```blade
<form b-submit="save">
    <input type="text" b-model="form.title">
    <div>
        @error(form.title) <span class="error">{{ message }}</span> @enderror
    </div>

    <input type="text" b-model="form.content">
    <div>
        @error(form.content) <span class="error">{{ message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

If you'd like, you can also exclude the post creation logic from the component by using a `ModelForm` like so:


```python
from pyblade.liveblade import forms
from app.models import Post

class PostForm(forms.ModelForm): # [!code highlight]
    class Meta:
        model = Post
        fields = ["title", "content"]
```

Now, from the component, you can call the `save()` method on the form which first validates itself before persisting data to database.


```python
from pyblade import liveblade
from components.forms import PostForm

class CreatePost(liveblade.Component)

    form: PostForm

    def save()
        self.form.save() # [!code highlight]
        return self.redirect('/posts')
```

Model Forms offer many advanges: you can use them for both creating and updating objects. When it comes to update a model, the form fields are rendered with the actual data of the Model being updated.

Form objects are not required when working with Liveblade, but they do offer a nice abstraction for keeping your components free of repetitive boilerplate.


## Extracting input fields to PyBlade components

Even in a small Liveblade component such as the `PostCreate` example we've been discussing, we end up duplicating lots of form field boilerplate like validation messages and labels.

It can be helpful to extract repetitive UI elements such as these into dedicated [PyBlade components](/components) to be shared across your application.

For example, below is the original PyBlade template from the `PostCreate` component. We will be extracting the following two text inputs into dedicated PyBlade components:

```blade
<form b-submit="save">
    <input type="text" b-model="title"> <!-- [!code highlight:4] -->
    <div>
        @error('title') <span class="error">{{ message }}</span> @enderror
    </div>

    <input type="text" b-model="content"> <!-- [!code highlight:4] -->
    <div>
        @error('content') <span class="error">{{ message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

Here's what the template will look like after extracting a re-usable PyBlade component called `text-input`:

```blade
<form b-submit="save">
    <b-text-input name="title" b-model="title" /> <!-- [!code highlight] -->

    <b-text-input name="content" b-model="content" /> <!-- [!code highlight] -->

    <button type="submit">Save</button>
</form>
```

Next, here's the source for the `text-input` component:

```blade
<!-- templates/components/text-input.html -->

@props(['name'])

<input type="text" name="{{ name }}" {{ attributes }}>

<div>
    @error(name) <span class="error">{{ message }}</span> @enderror
</div>
```

As you can see, we took the repetitive HTML and placed it inside a dedicated PyBlade component.

For the most part, the PyBlade component contains only the extracted HTML from the original component. However, we have added two things:

* The `@props` directive
* The <span v-pre>`{{ attributes }}`</span> statement on the input

Let's discuss each of these additions:

By specifying `name` as a "prop" using `@props(['name'])` we are telling PyBlade: if an attribute called "name" is set on this component, take its value and make it available inside this component through a variable called `name`.

For other attributes that don't have an explicit purpose, we used the <span v-pre>`{{ attributes }}`</span> statement. This is used for "attribute forwarding", or in other words, taking any HTML attributes written on the PyBlade component and forwarding them onto an element within the component.

This ensures `b-model="title"` and any other extra attributes such as `disabled`, `class="..."`, or `required` still get forwarded to the actual `<input>` element.