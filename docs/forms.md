---
next: "Liveblade: Reactive UIs"
---


# Forms

Forms are essential in web applications, allowing users to submit data for processing. PyBlade provides some usefull directives that simplifies form rendering, enhance security, improve flexibility.  


## **CSRF protection with `@csrf`**  

Security is a major concern when handling form submissions, especially against **Cross-Site Request Forgery (CSRF) attacks**. The `@csrf` directive is designed to prevent unauthorized form submissions by ensuring that every request includes a CSRF token. This token is validated by the server before processing the request.  

When a form contains `@csrf`, a hidden input field is automatically generated, embedding the CSRF token provided by the backend framework.  

 
```html
<form action="/submit" method="POST">
    @csrf
    
    <input type="text" name="email" placeholder="Enter your email">
    <button type="submit">Subscribe</button>
</form>
```

This should output something similar to :

```html
<form action="/submit" method="POST">
    <input type="hidden" name="csrf-token" value="random-token-value">
    
    <input type="text" name="email" placeholder="Enter your email">
    <button type="submit">Subscribe</button>
</form>
```

Many Python frameworks, including **Django** and **Flask**, implement CSRF protection by checking for the token in POST, PUT, PATCH, and DELETE requests. If the token is missing or invalid, the request is rejected.  

### CSRF protection in AJAX requests

AJAX requests modifying data (POST, PUT, DELETE) **must include a CSRF token** to prevent security risks. Since browsers don’t automatically add it, you may include it in headers by accessing to the `csrf_token` variable which is made available in the template context by default. 

```html
<head>
    <meta name="csrf-token" content="{{ csrf_token }}">
</head>
```

Then you may access it in your AJAX requests calls :

```js
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/submit-data', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "Hello" })
});
```

### Handling HTTP Methods with `@method`  

HTML forms natively support only **GET** and **POST** methods, but web applications often require **PUT**, **PATCH** and **DELETE** for resource management. The `@method` directive allows you to define the intended HTTP method while keeping the form’s method as `POST`.  

When a form contains `@method`, a hidden input field is automatically generated, embedding the HTTP method.

```html
<form action="/update-profile" method="POST">
    @csrf
    @method("PUT")
    
    <input type="text" name="username" value="JohnDoe">
    <button type="submit">Update Profile</button>
</form>
```

This outputs something like this:

```html
<form action="/update-profile" method="POST">
    <input type="hidden" name="csrf-token" value="random-token-value">
    <input type="hidden" name="_method" value="PUT">
    
    <input type="text" name="username" value="JohnDoe">
    <button type="submit">Update Profile</button>
</form>
```

>[!warning]
>This may not be detected, and therefor, not useful in some frameworks that have their proper methods of determining the HTTP method.


## Conditional Input attributes

In PyBlade, you can conditionally apply form input attributes using directives like `@checked`, `@selected`, `@disabled`, `@readonly`, `@required`, and more. These directives provide a clean, declarative way to manage form attributes based on conditions.


When used without arguments, these conditional attribute directives are resolved as `True`, meaning the corresponding attribute is appliyed on the input.

```html
<input type="text" name="username" @disabled>
```

This disables the form field unconditionally.

```html
<input type="text" name="username" disabled>
```

### The `@checked` directive

For convenience, you can use the `@checked` directive to conditionally mark checkboxes as "checked" if a given condition evaluates to `True`. This is useful when you need to retain form values after a submission or apply conditional logic.

```html
<input
    type="checkbox"
    name="active"
    value="active"
    @checked(user.status == "active")
/>
```

This directive will add the `checked` attribute to the checkbox if the condition `user.status == "active"` evaluates to `True`.


### The `@selected` directive

Likewise, the `@selected` directive is used to mark an option as "selected" in a `<select>` element, based on a condition.

This directive will add the `selected` attribute to the `<option>` tag if the condition `form.version.data == version` evaluates to `true`.

```html
<select name="version">
    @for(version in product.versions)
        <option value="{{ version }}" @selected(preferences.version == version)>
            v{{ version }}
        </option>
    @endfor
</select>
```

### The `@disabled` directive

The `@disabled` directive can be used to conditionally disable an HTML element, such as a button or input, based on a given condition.

```html
<button type="submit" @disabled(form.errors)>Submit</button>
```

### The `@readonly` directive

The `@readonly` directive conditionally marks an input field as "readonly", preventing the user from changing its value.

```html
<input
    type="email"
    name="email"
    value="email@domain.com"
    @readonly(user.is_not_admin())
/>
```

This directive will add the `readonly` attribute to the input field if the condition `form.user.is_not_admin()` is `true`.

### The `@required` directive

The `@required` directive conditionally applies the `required` attribute to a form input, making it mandatory for submission.

```html
<input
    type="text"
    name="title"
    value="title"
    @required(user.is_admin())
/>
```

### The `@autofocus` directive

This directive would  conditionlly apply the `autofocus` attribute, making an input field focused automatically when the page loads.

```html
<input
    type="text"
    name="username"
    @autofocus(True)
/>
```

### The `@autocomplete` directive

The `@autocomplete` directive controls whether browser autocomplete should be enabled or disabled for form inputs.

```html
<input
    type="text"
    name="email"
    @autocomplete(preferences.autocomplete_enabled)
/>
```

This applies the `autocomplete="on"` attribute if the condition resolves to `True`.

### The `@multiple` directive

For fields that allow multiple selections, you could have a `@multiple` directive to conditionally apply the `multiple` attribute.

```html
<select name="options" @multiple(user.is_admin())>
    <!-- options here -->
</select>
```

## Generating form fields

The `@field` directive in **PyBlade** simplifies form rendering by generating HTML input elements directly from Django (or other frameworks’) form fields. It automatically applies attributes like **classes, required fields, and other HTML properties**, making form handling more customizable.  


Let's assume you have a `ContactForm` class in your Django application,

```python
# forms.py
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    subject = forms.ChoiceField(choices=[
        ('general', 'General Inquiry'),('support', 'Technical Support'), ('feedback', 'Feedback')],
        required=True
    )
    message = forms.TextField(widget=forms.Textarea(attrs={'rows': 5}), required=True)
    subscribe = forms.BooleanField(required=False, initial=True, label='Subscribe to newsletter')
```
... and want to customize the rendered inputs.

```python
# view.py
from django.shortcuts import render
from .forms import ContactForm

def contact(request):

    if request.method == "POST":
        form = ContactForm(request.POST)
    else:
        form = ContactForm()
    
    return render(request, template='contact-us', context={"form": form})    
```

You may render each input individually and pass whatever attribute you want with the `@field` directive.

```html
<form>
    @csrf
    
    @field(form.name, class="form-control" placeholder="Enter your name" required)
    @field(form.email, class="form-control")
    ...
</form>
```

This would output :

```html
<input type="text" name="name" id="id_name" class="form-control" placeholder="Enter your name" required>
```

Passing an attribute that exists from the Django form will override it.

## Input error handling  

The `@error` directive in **PyBlade** simplifies error handling for form fields by **automatically checking for validation errors** and making the error message available in the `message` variable.  

```html
@field(form.email, class="form-control")
@error(form.email)
    <small class="text-red-500">{{ message }}</small>
@enderror
```
If validation fails, let's say the user omitted the email while it is a required field, the generated output would be:  

```html
<input type="email" name="email" id="id_email" class="form-control">
<small class="text-red-500">This field is required.</small>
```

If there’s no validation error, only the input field appears (no `<small>` tag).  

## Pro tip

Imagine creating forms in your web application with minimal code, but still maintaining dynamic behavior and error handling — all while keeping your templates clean and readable. That's what we are going to release just now.

With PyBlade, you can easily build reusable form components that automatically handle input fields and validation errors. 

By combining **components** with powerful directives like `@field` and `@error`, you can generate form fields dynamically, ensuring that every input is properly rendered and that errors are displayed automatically if validation fails. We are going to implement this powerfull functionality in simple 3 steps.

### Let's start:

1. **Define a Component**

Create a reusable component that handles field rendering and error display. I will call it `text-input`.

```bash
pyblade make:component text-input
```

2. **Write the component code**

```html
<!-- templates/components/text-input.html -->

<div class="flex flex-col gap-2">
    @field(field, {{ attributes.merge({"class":"bg-slate-300 rounded-md border border-slate-500 hover:border-sky-500"}) }})
    @error(field)
        <small class="text-red-500">{{ message }}</small>
    @enderror
</div>
```

In this small component, the `@field` directive generates the input field with required attributes, and `@error` automatically displays any validation messages tied to that field.

3. **Use the component in your template**

With just a field name, you can easily render the field with validation error handling.

```html
<form method="POST" action="/submit">
    @csrf

    <b-text-input :field="form.name" placeholder="Enter your name" required/>
    <b-text-input :field="form.email" placeholder="Enter your email"/>
    <b-text-input :field="form.subject" placeholder="Enter the subject of your message"/>
    <b-text-input :field="form.message" class="min-h-[200px]" placeholder="Type your message here..."/>

    <button type="submit">Submit</button>
</form>
```

All done, this makes your code more cleaner !
