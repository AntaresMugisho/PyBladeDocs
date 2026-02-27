---
prev: "PyBlade: Template Engine"
---

# Displaying data in PyBlade

In PyBlade, displaying data inside templates is straightforward and designed to feel intuitive for developers. To display data, PyBlade uses the <span v-pre>`{{ }}`</span> syntax, which is both secure and simple to use.

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

When you insert data using this syntax, PyBlade will automatically escape the content to protect against common vulnerabilities like Cross-Site Scripting (XSS) attacks. For cases where you need to render unescaped HTML, there is [another syntax](#rendering-unescaped-html).

## Displaying data with default values

In PyBlade, you can define fallback values directly inside <span v-pre>`{{ ... }}`</span> using the Python `or` operator.
This is particularly useful when a variable may be undefined or evaluates to a falsy value (`None`, empty string, etc.).

**Example**

If you want to display `name`, but fall back to `"Guest"` when `name` is not defined or is falsy, you can write:
```html
<p>Hello, {{ name or 'Guest' }} !</p>
```

## Rendering unescaped HTML

By default, PyBlade automatically escapes all output inside <span v-pre>`{{ ... }}`</span>.
This means HTML tags are converted into safe text.

For example:

```html
{{ message }}
```

If:

```python
message = "<strong>Welcome back!</strong>"
```

The browser will render:

```html
&lt;strong&gt;Welcome back!&lt;/strong&gt;
```

So the `<strong>` tag is displayed as text — not interpreted as HTML.


But, in some cases, you may intentionally want the browser to interpret the HTML tags. For that purpose, you can use the `{!! !!}` syntax as following:

```html
{!! message !!}
```

With

```python
message = "<strong>Welcome back!</strong>"
```

The browser will render

```html
<strong>Welcome back!</strong>
```

Now the `<strong>` tag is parsed and applied correctly.

::: warning
Rendering unescaped content is dangerous especially if the data comes from users.
Use `{!! !!}` with caution. Always ensure that the content is trusted and safe before rendering.
:::

## Dictionary key access with dot notation

In PyBlade, dictionary keys can be accessed using **dot notation** when the key is a valid identifier.

This means you can write:

```html
{{ my_dict.key }}
```

Instead of:

```html
{{ my_dict["key"] }}
```
Both are equivalent and will produce the same result.

**Example**

Given:

```python
context = {
    "user": {
        "name": "Alice",
        "email": "alice@example.com",
    }
}
```

You can write:

```html
{{ user.name }}
```

Output:

```
Alice
```


::: info Good to know
Dictionary key access with dot notation works only if the key is a valid alphanumeric identifier.

If the key contains whitespaces or unsupported special characters, use bracket syntax:

```html
{{ my_dict.key }}           # valid  // [!code ++]
{{ my_dict.other_key }}     # valid  // [!code ++]
{{ my_dict.1 }}             # valid  // [!code ++]
{{ my_dict.first-name }}    # invalid  // [!code --]
{{ my_dict.first name }}    # invalid  // [!code --]
{{ my_dict.user id }}       # invalid  // [!code --]
```
:::

## Index access with dot notation

PyBlade allows convenient access to data of type `list` and `tuple` using the `.index` notation.

**Example**

Given the following context:
```python
context = {
    "countries": ["France", "Germany", "Japan"],
}
```

Instead of writing bracket syntax:

```html
{{ countries[0] }}
```

You can access elements like this:

```html
{{ countries.0 }}
```

**Output:**
```
France
```

Both methods work, but the dot-index notation is more readable and less verbose.

### Chained access

Dot-index notation also works in nested expressions:

```python
context = {
    "countries": [
        {"name": "France"},
        {"name": "Germany"},
        {"name": "Japan"},
    ]
}
```

You may combine attribute access and index access freely:

```html
{{ countries.1.name }}
```

**Output:**
```
Germany
```

### Negative indexing

You can also use negative index to access elements from the end of a list:

```html
{{ countries.-1.name }}
```

**Output:**
```
Japan
```



## Using filters on variables

PyBlade allows you to not only display variables but also _transform_ them directly in templates using __filters__.
Instead of calling methods on objects like `name.upper()`, PyBlade uses a **dot-based filter syntax**.

### What are filters ?

Filters are simple functions that accept a _value_ and optionally additional arguments, and return a _transformed value_.

### Filter Syntax

Filters are applied directly after a variable using dot notation.
Arguments, if any, are placed inside parentheses:

```html
{{ title.upper.truncate(20) }}
```

This applies the `upper` filter first, then the `truncate(20)` filter on the result.

Filters can be **chained** in any order, and PyBlade will evaluate them left to right. This means expressions like `user.name.upper.slugify` work naturally.

### Built-in filters

Below is a categorization of PyBlade’s built-in filters, organized by data type.

#### String & Text filters

| Filter             | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `upper`            | Convert text to UPPERCASE                                         |
| `lower`            | Convert text to lowercase                                         |
| `title`            | Convert text to Title Case                                        |
| `capitalize`       | Capitalize First character                                        |
| `strip`            | Trim whitespace from both ends                                    | 
| `slugify`          | Convert to URL-friendly slug (lowercase, hyphens, no punctuation) | 
| `truncate(length)` | Truncate to a maximum of `length` characters                      | 

#### Collection filters (Lists, Tuples, Dicts)

| Filter      | Description                             |
| ----------- | --------------------------------------- |
| `length`    | Number of items in the collection       |
| `first`     | First item or element                   |
| `last`      | Last item or element                    |
| `join(sep)` | Join items into a string with separator |


#### Numeric filters

| Filter        | Description       |
| ------------- | ----------------- |
| `add(x)`      | Add a number      |
| `subtract(x)` | Subtract a number |
| `multiply(x)` | Multiply          |
| `divide(x)`   | Divide            |


#### Date & Time filters

| Filter        | Description                            |
| ------------- | -------------------------------------- |
| `format(fmt)` | Format a `datetime` according to `fmt`. Date format specifiers follow the standard Python `strftime` conventions (e.g. `%Y` for year, `%m` for month). |
| `humanize`    | Show relative time (e.g. "2 hours ago") |

:::tip Pro Tip
Keep template logic simple; heavy computations should occur in view code, passing only the final, display-ready data to your templates. This keeps templates focused solely on presentation, enhancing readability and performance.
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

As you can see, all spaces between the HTML tags have been removed, making the output cleaner.  

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
## Debugging

When developing a web application, debugging plays a crucial role in identifying issues and understanding how data flows within your templates. Whether you are troubleshooting missing data, unexpected outputs, or just trying to understand what’s available in your template, PyBlade provides an easy-to-use debugging directive.

### The `@debug` directive

One of the simplest ways to gain insights into your template execution is by using the `@debug` directive. This directive prints a detailed breakdown of the current template context, helping you analyze the available variables and their values.

Using `@debug` is as simple as adding it inside your template:

```html
@debug
```

This outputs a structured overview of the template context, helping you identify missing variables or unexpected values.

>[!info]
>The `@debug` directive only works when debugging is enabled (`DEBUG=True`). In production (`DEBUG=False`), it outputs nothing, ensuring sensitive data remains hidden.

### The `@lorem` directive

The `@lorem` directive generates random "lorem ipsum" text, which is commonly used as placeholder content in templates. This can be particularly useful when designing a template or layout, as it helps visualize how text will appear without needing to write out actual content. The generated text can either be a standard "lorem ipsum" or, when specified, random Latin words or paragraphs.

The `@lorem` directive can be used with up to three optional arguments:

```html
@lorem([count], [method], [random])
```

Here's a breakdown of each argument:

- **`count`**:  
  The number of items (paragraphs or words) you want to generate. This can either be a fixed number or a context variable that holds the number. By default, it will generate one paragraph.

- **`method`**:  
  Specifies the type of content to generate. It can be one of the following:
  - `'w'` for **words**: Will generate random Latin words.
  - `'p'` for **HTML paragraphs**: Will generate full paragraphs wrapped in `<p>` tags.
  - `'b'` for **plain-text paragraph blocks**: Will generate plain-text paragraphs without any HTML tags. This is the default option.

- **`random`**:  
  If the set to `True`, it will ensure that the generated content is random Latin text, instead of the usual standard "Lorem ipsum dolor sit amet..." paragraph. This adds variability in the generated text.
  
  For example, the following will output three paragraphs, each wrapped in `<p>` tags, containing the standard "lorem ipsum" text.

   ```html
   @lorem(3, 'p')
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


   
