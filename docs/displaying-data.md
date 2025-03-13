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

When rendering dynamic content in a web application, security is a top priority. That's why by default, PyBlade escapes all variable output to prevent security risks like. However, in some cases, you might want to disable this behavior to allow safe HTML content to be rendered as intended.

The `@autoescape` directive in PyBlade controls whether HTML escaping is applied to variables within its block. It takes either `True` or `False` as an argument. It must be closed with `@endautoescape`.  

**Basic Usage** 

When auto-escaping is enabled, all variables are automatically escaped, meaning that any HTML tags inside them are treated as plain text.  

```html
@autoescape(True)
    <p>{{ user.bio }}</p>
@endautoescape
```

If `user.bio` contains `<strong>Developer</strong>`, the output will be:  

```
<strong>Developer</strong>
```

This prevents HTML from being rendered, ensuring that user-generated content does not break the page structure or introduce security vulnerabilities.  

On the other hand, if you want to allow HTML content to be displayed as intended, you can disable auto-escaping:  

```html
@autoescape(False)
    <p>{{ user.bio }}</p>
@endautoescape
```

Now, the output will be properly rendered as:  

**Developer**  


>[!warning] Warning
>Always be cautious when turning off auto-escaping, especially with user-generated content, to maintain security best practices.

To make it even clearer, the `@autoescape` directive also accepts `on` or `off` as arguments, so `@autoescape(True) `works the same way as `@autoescape(off)`, and `@autoescape(False)` is the same as `@autoescape(off)`

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
For best performance and maintainability, follow the principle of “Logic in the backend”, templates are for display only. Perform complex logic and data transformations in your views or controllers, passing only the final, display-ready data to your templates. This keeps templates focused solely on presentation, enhancing readability and performance.
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

Normally, when you write HTML, you might format it for readability, introducing extra spaces and line breaks:  

```html
<p>
    <a href="foo/">Foo</a>
</p>
```

While this makes the template more readable, it also adds unnecessary whitespace to the rendered HTML. Using `@spaceless`, you can remove these spaces between tags without affecting the actual content:  

```html
@spaceless
    <p>
        <a href="foo/">Foo</a>
    </p>
@endspaceless
```

This will render as:  

```html
<p><a href="foo/">Foo</a></p>
```

As you can see, all unnecessary spaces between the HTML tags have been removed, making the output cleaner and more efficient.  

The `@spaceless` directive in PyBlade removes whitespace between HTML tags. This includes tab characters and newlines.


The directive only removes space between HTML tags — it does not strip spaces inside text content. Consider the following example:  

```html
@spaceless
    <strong>
        Hello
    </strong>
@endspaceless
```

The output will still include the space around "Hello":  

```html
<strong> Hello </strong>
```

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

When developing a web application, debugging plays a crucial role in identifying issues and understanding how data flows within your templates. Whether you are troubleshooting missing data, unexpected outputs, or just trying to understand what’s available in your template, PyBlade provides an easy-to-use debugging directive.

### The `@debug` directive

One of the simplest ways to gain insights into your template execution is by using the `@debug` directive. This directive prints a detailed breakdown of the current template context, imported modules, and other relevant information about your template, helping you analyze the available variables and their values.

Using `@debug` is as simple as adding it inside your template:

```html
@debug
```

This outputs a structured overview of the template context, helping you identify missing variables or unexpected values.

>[!info]
>In Django applications, the `@debug` directive only works when debugging is enabled (`DEBUG=True`). In production (`DEBUG=False`), it outputs nothing, ensuring sensitive data remains hidden.

### The `@lorem` directive

The `@lorem` directive generates random "lorem ipsum" text, which is commonly used as placeholder content in templates. This can be particularly useful when designing a template or layout, as it helps visualize how text will appear without needing to write out actual content. The generated text can either be a standard "lorem ipsum" or, when specified, random Latin words or paragraphs.

The `@lorem` directive can be used with up to three optional arguments:

```blade
@lorem([count], [method], [random])
```

Here's a breakdown of each argument:

- **`count`**:  
  The number of items (paragraphs or words) you want to generate. This can either be a fixed number or a context variable that holds the number. By default, it will generate one paragraph/word.

- **`method`**:  
  Specifies the type of content to generate. It can be one of the following:
  - `w` for **words**: Will generate random Latin words.
  - `p` for **HTML paragraphs**: Will generate full paragraphs wrapped in `<p>` tags.
  - `b` for **plain-text paragraph blocks**: Will generate plain-text paragraphs without any HTML tags. This is the default option.

- **`random`**:  
  If the word `random` is provided, it will ensure that the generated content is random Latin text, instead of the usual standard "Lorem ipsum dolor sit amet..." paragraph. This adds variability in the generated text.
  
  For example, the following will output three paragraphs, each wrapped in `<p>` tags, containing the standard "lorem ipsum" text.

   ```html
   @lorem(3, p)
   ```
   