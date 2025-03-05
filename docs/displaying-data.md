# Displaying data in PyBlade

In PyBlade, displaying data inside templates is straightforward and designed to feel intuitive for developers, especially those familiar with Blade from Laravel. To display variables, PyBlade uses the <span v-pre>`{{ }}`</span> syntax, which is both secure and simple to use.

Here's how you can display data in PyBlade templates:

## Basic variable display

To display a variable, simply wrap it within double curly braces <span v-pre>`{{ }}`</span>.

**Example**

Assuming you have a variable named `name` passed to the template, you can display it like this:

```python
# views.py
from django.shortcuts import render

def show_greeting(request):
    context = {'name': 'John Doe'}
    return render(request, 'greeting', context)
```

```html
<!-- greeting.html -->
<p>Hello, {{ name }} !</p>
```

**Output**
```html
<p>Hello, John Doe !</p>
```
---

When you insert data using this syntax, PyBlade will automatically escape the content to protect against common vulnerabilities like Cross-Site Scripting (XSS) attacks. For cases where you need to output unescaped HTML, there is another syntax.

## Displaying unescaped HTML data

For data that includes HTML, such as `<strong>`, `<em>`, or custom HTML content, use `{!! !!}` to output the data without escaping. This is useful for displaying HTML content stored in your variables.

**Example**

If a variable `message` contains HTML, such as `"<strong>Welcome back!</strong>"`, you can display it like this:

```python
# views.py
from django.shortcuts import render

def show_message(request):
    context = {'message': '<strong>Welcome back!</strong>'}
    return render(request, 'welcome', context)
```

```html
<!-- welcome.html -->
<p>{!! message !!}</p>
```

**Output**
```html
<p><strong>Welcome back!</strong></p>
```

::: warning
Use `{!! !!}` with caution. Always ensure that the content is safe to display to avoid security risks.
:::

### The `@autoescape` directive
---

When rendering dynamic content in a web application, security is a top priority. That's why by default, PyBlade escapes all output. This is a good practice, but sometimes, you may want to disable auto-escaping for specific cases.

### **Controlling Auto-Escaping with `@autoescape()`**  

The `@autoescape()` directive in PyBlade controls whether HTML escaping is applied to variables within its block. By default, PyBlade automatically escapes all variable output to prevent security risks like Cross-Site Scripting (XSS). However, in some cases, you might want to disable this behavior to allow safe HTML content to be rendered as intended.  

The directive takes either `on` or `off` as an argument (or alternatively, `True` and `False` for the same effect). It must be closed with `@endautoescape`.  

#### **Basic Usage**  

When auto-escaping is enabled, all variables are automatically escaped, meaning that any HTML tags inside them are treated as plain text.  

```pyblade
@autoescape(on)
    <p>{{ user.bio }}</p>
@endautoescape
```

If `user.bio` contains `<strong>Developer</strong>`, the output will be:  

```
<strong>Developer</strong>
```

This prevents HTML from being rendered, ensuring that user-generated content does not break the page structure or introduce security vulnerabilities.  

On the other hand, if you want to allow HTML content to be displayed as intended, you can disable auto-escaping:  

```pyblade
@autoescape(off)
    <p>{{ user.bio }}</p>
@endautoescape
```

Now, the output will be properly rendered as:  

**Developer**  

#### **Handling Pre-Escaped Content**  

Some variables might already be marked as "safe," meaning they do not require additional escaping. This can happen when the variable is pre-processed or when certain filters are applied to it.  

For example, if `user.bio` is explicitly set as safe in your backend logic, disabling auto-escaping will allow it to be displayed as HTML.  

```pyblade
@autoescape(off)
    <p>{{ user.bio }}</p>
@endautoescape
```

However, if you want to ensure that any user-provided content is always escaped, you can manually apply the `@autoescape(on)` directive or use an escape filter when needed.  

#### **Effects on Filters**  

When auto-escaping is disabled, filters applied to variables may behave differently. Consider the following example where we join a list of values into a string and then apply the `escape` filter:  

```pyblade
@autoescape(off)
    {{ my_list|join(", ")|escape }}
@endautoescape
```

Since auto-escaping is turned off, `join(", ")` executes first, creating a string that is marked as "safe." The `escape` filter then applies to the already safe string, which may not have the intended effect of escaping individual items.  

To ensure each element in a sequence is properly escaped, use an appropriate escaping filter before joining:  

```pyblade
@autoescape(off)
    {{ my_list|escapeseq|join(", ") }}
@endautoescape
```

This ensures that every item in `my_list` is safely escaped before joining them into a single string.  

>![!warning] 
>Always be cautious when turning off auto-escaping, especially with user-generated content, to maintain security best practices.

## Displaying data with default values

In PyBlade, you can also define default values for variables. This is helpful in cases where the variable might not always be defined.

**Example**

If you want to display `name`, but fallback to "Guest" if it’s undefined, you can use the following syntax:

```html
<p>Hello, {{ name or 'Guest' }} !</p>
```

If `name` is undefined, the output will be:

```html
<p>Hello, Guest !</p>
```

## Using methods on variables

In PyBlade, you can not only display variables but also call methods on them directly within the curly braces.

For example, if you have a string variable like `name`, you can use Python string methods such as `.upper()` or `.capitalize()` directly within <span v-pre>`{{ }}`</span> to transform the data before displaying it.

**Example**

If `name` is a string variable, you can call `.upper()` to display it in uppercase:

```python
# views.py
from django.shortcuts import render

def show_greeting(request):
    context = {'name': 'Jane'}
    return render(request, 'greeting', context)
```

```html
<!-- greeting.html -->
<p>Hello, {{ name.upper() }} !</p>
```

**Output**
```html
<p>Hello, JANE !</p>
```

This flexibility allows you to use any method that is available on the variable type (e.g., strings, lists, dictionaries), including custom methods if the variable is an object.


::: warning
Avoid using too many methods or computationally expensive operations within <span v-pre>`{{ }}`</span> in your templates. While PyBlade supports calling methods directly on variables, it’s best to keep these calls minimal and efficient. Overusing or relying on time-consuming methods can slow down rendering, impacting user experience.
:::

### Other useful examples

Here are a few more examples to illustrate the versatility of using methods directly in the template.

#### Capitalizing a String

If you want to capitalize only the first letter of `name`, you can use `.capitalize()`:

```html
<p>Welcome, {{ name.capitalize() }}!</p>
```

### Getting the length of a list
::: info Upcoming feature
This feature is not yet implemented but should be ready in the next version. This part of documentation is provided for informative purpose only.
:::

If you have a list called `items`, you can display its length with `len()`:

```html
<p>You have {{ len(items) }} items in your list.</p>
```

#### Accessing Dictionary Keys

If a variable `user` is a dictionary with a key `email`, you can access it like this:

```html
<p>Your email: {{ user.get('email') }}</p>
```

Using methods within curly braces allows for greater flexibility and keeps your template expressions clear and readable.

:::tip
For best performance and maintainability, follow the principle of “Logic in the code, templates are for display only.” Perform complex logic and data transformations in your views or controllers, passing only the final, display-ready data to your templates. This keeps templates focused solely on presentation, enhancing readability and performance.
:::

## PyBlade and JavaScript Frameworks
Since many JavaScript frameworks also use "curly" braces to indicate a given expression should be displayed in the browser, you may use the `@` symbol to inform the PyBlade rendering engine an expression should remain untouched. For example:

```html
<div class="container">
    Hello, @{{ name }}.
</div>
```

In this example, the `@` symbol will be removed by PyBlade; however, <span v-pre>`{{ name }}`</span> expression will remain untouched by the PyBlade Template engine, allowing it to be rendered by your JavaScript framework.

If you are displaying JavaScript variables in a large portion of your template, you may wrap the HTML in the [`@verbatim`](#the-verbatim-directive) directive so that you do not have to prefix each "curly" braces statement with an `@`symbol.

```html
@verbatim
    <div class="container">
        Hello, {{ name }}.
    </div>
@endverbatim
```
## The `@verbatim` directive

The `@verbatim` directive in PyBlade prevents the engine from parsing the enclosed content, rendering it exactly as written. This is useful when working with JavaScript frameworks or when displaying raw template syntax.

**Example**

```html
@verbatim
    <script>
        let app = {
            message: "{{ message }}"
        }
    </script>

    @if(True)
        This won't be processed by PyBlade.
    @endif
@endverbatim
```

**Output**

```html
<script>
    let app = {
        message: "{{ message }}"
    }
</script>

@if(True)
    This won't be processed by PyBlade.
@endif
```

**Explaination**

- **Without `@verbatim`**: The template engine would try to parse <span v-pre>`{{ message }}`</span> and the `@if` statement, assuming it's a PyBlade directive.
- **With `@verbatim`**: The engine ignores the enclosed content and outputs it exactly as written.

## The `@spaceless` directive


## Comments

In PyBlade, comments allow you to include notes within your templates without rendering them in the final output. This is useful for adding explanations, reminders, or temporary code blocks without affecting the generated HTML.

To add a comment in PyBlade, wrap your comment text inside `{# #}` placeholders. Any content within `{# #}` will be ignored during rendering, so it won’t appear in the HTML output.

**Example**

```html
<div class="content">
    {# This is a comment and will not appear in the rendered HTML #}
    <p>Welcome to our website!</p>

    {# Temporarily hiding this section
    <p>Check back soon for updates.</p>
    #}
</div>
```

**Output**

```html
<div class="content">
    <p>Welcome to our website!</p>
</div>
```

For convenience, PyBlade also provide a `@comment` directive for adding comments.

Sample usage:
```html
@comment
<p>Commented out text</p>
@endcomment
```

## Debugging

PyBlade provides a debugging feature that allows you to display variables and other information in your templates. This is useful for debugging and development purposes.

- @debug
- @lorem
