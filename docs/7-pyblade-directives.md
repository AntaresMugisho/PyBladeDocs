# PyBlade Directives

## If statements

PyBlade provides a set of intuitive and developer-friendly directives for conditional statements, allowing you to control the flow of your templates easily. These conditionals work similarly to Python’s `if`, `elif`, and `else` statements, making it simple to render content based on certain conditions.

### Using `@if`, `@elif`, and `@else`

To create conditional statements in PyBlade, use the `@if` directive followed by `@elif` and `@else` as needed. This structure is useful for checking various conditions and displaying content accordingly.

**Example**

Suppose you have a variable `status` that can hold values like `'active'`, `'pending'`, or `'inactive'`. You can display different messages based on the value of `status` using conditional statements:

```python
# views.py
from django.shortcuts import render

def show_status(request):
    context = {'status': 'active'}
    return render(request, 'status', context)
```

```html
<!-- status.html -->
@if(status == 'active')
    <p>Your account is active.</p>
@elif (status == 'pending')
    <p>Your account is pending approval.</p>
@else
    <p>Your account is inactive.</p>
@endif
```

**Output**

If `status` is `'active'`, the output will be:

```html
<p>Your account is active.</p>
```

If `status` is `'pending'`, the output will be:

```html
<p>Your account is pending approval.</p>
```

And if `status` is anything else, the output will be:

```html
<p>Your account is inactive.</p>
```

:::info
In PyBlade, you can use the `@if` directive alone, pair it with `@else`, or chain multiple conditions with `@elif`, just like in Python. Do not forget to end your conditional statement with the `@endif` directive.
:::

### Using `@unless`

The `@unless` directive works as a negation of `@if`. It executes the block only if the condition evaluates to `False`. This is useful for cases where you want to check if a variable does **not** meet a specific condition.

**Example**

If you want to display a message when a user does not have admin privileges:

```html
<!-- admin_check.html -->
@unless (user.is_admin)
    <p>You do not have admin privileges.</p>
@endunless
```

**Output**

If `user.is_admin` is `False`, the output will be:

```html
<p>You do not have admin privileges.</p>
```

If `user.is_admin` is `True`, nothing will be displayed.

### Nested Conditionals

You can also nest conditionals to create more complex logic. However, be cautious with excessive nesting as it can make the template harder to read and maintain.

**Example**

```html
@if (user.is_authenticated)
    @if (user.is_admin)
        <p>Welcome, Admin {{ user.name }}!</p>
    @else
        <p>Welcome, {{ user.name }}!</p>
    @endif
@else
    <p>Please log in to continue.</p>
@endif
```

**Output**

If `user.is_authenticated` is `True` and `user.is_admin` is `True`, the output will be:

```html
<p>Welcome, Admin {{ user.name }}!</p>
```

If `user.is_authenticated` is `True` but `user.is_admin` is `False`, the output will be:

```html
<p>Welcome, {{ user.name }}!</p>
```

And if `user.is_authenticated` is `False`, the output will be:

```html
<p>Please log in to continue.</p>
```

In PyBlade, you can also use logical expressions such as `and`, `or`, and `not` within conditional statements, similar to Python. This allows you to combine multiple conditions in a single directive for more complex checks.

:::warning Warning: Keep logic out of templates
For performance and readability, avoid complex or time-consuming logic within conditional statements. Templates should primarily focus on displaying pre-processed data, not performing heavy logic. Keep calculations and condition checks within views or controllers wherever possible to adhere to the principle of "Logic in the code, templates are for display only."
:::


## Match (Switch) statements

PyBlde also provides support for `@match` statements, which are useful for handling multiple conditions based on the value of a single variable. This can help simplify templates by reducing the need for multiple `@if`, `@elif`, and `@else` statements.

With `@match`, you can check a variable's value and define multiple `@case` conditions. If none of the cases match, an optional `@default` can be specified as a fallback.

### Basic Syntax

The `@match` directive takes a variable as its argument. Within the `@match` block, each condition is checked using `@case`, and the code in the matching `@case` block will execute. If no cases match, the `@default` block will execute (if it is provided).

```html
@match(variable)
    @case('value1')
        <!-- Code to display if variable == 'value1' -->
    @case('value2')
        <!-- Code to display if variable == 'value2' -->
    @default
        <!-- Code to display if none of the cases match -->
@endmatch
```

**Example**

Suppose you have a variable `status` with possible values like `'active'`, `'pending'`, `'inactive'`, or others. You can use `@match` to display different messages based on `status`:

```python
# views.py
from django.shortcuts import render

def show_status(request):
    context = {'status': 'pending'}
    return render(request, 'status', context)
```

```html
<!-- status.html -->
@match(status)
    @case('active')
        <p>Your account is active.</p>
    @case('pending')
        <p>Your account is pending approval.</p>
    @case('inactive')
        <p>Your account is inactive.</p>
    @default
        <p>Status unknown.</p>
@endmatch
```

**Output**

If `status` is `'pending'`, the output will be:

```html
<p>Your account is pending approval.</p>
```

If `status` has a value other than `'active'`, `'pending'`, or `'inactive'`, the output will be:

```html
<p>Status unknown.</p>
```

### The `@switch` directive

If you are accustomed to the *switch statement* in other programming  languages, PyBlade provides the `@switch` directive which is an alias for `@match`.
Both directives function identically.

So the above example is equivalent to this:

```html
<!-- status.html -->
@switch(status)
    @case('active')
        <p>Your account is active.</p>
    @case('pending')
        <p>Your account is pending approval.</p>
    @case('inactive')
        <p>Your account is inactive.</p>
    @default
        <p>Status unknown.</p>
@endswitch
```

### Nested `@match` Statements

Just like other conditional structures, `@match` statements can be nested, though it’s best to keep templates as simple as possible to maintain readability.



## Loops

PyBlade supports looping through lists, dictionaries, and other iterable data structures using the `@for` directive. These loops are similar to Python’s `for` loops and make it easy to display repeated elements in your templates.


### `@for` loop example

If you have a list of items, you can use `@for` to loop through them:

```python
# views.py
from django.shortcuts import render
def show_items(request):
    context = {'fruits': ['Apple', 'Banana', 'Cherry']}
    return render(request, 'my_app.index', context)
```

```html
<!-- In items.html -->
<ul>
    @for (fruit in fruits)
        <li>{{ fruit }}</li>
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
</ul>
```

### The `@empty` directive

Somethimes, you may need to handle cases where a loop has no items to iterate over. That's why PyBlade provides an `@empty` directive that specifies a fallback to display content if the list or iterable is empty.

```python
# views.py
from django.shortcuts import render

def show_fruits(request):
    context = {'fruits': []}  # An empty list of fruits
    return render(request, 'fruits', context)
```

```html
<!-- In fruits.html -->
<ul>
    @for(fruit in fruits)
        <li>{{ fruit }}</li>
    @empty
        <li>No fruits available.</li>
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li>No fruits available.</li>
</ul>
```

Using `@empty` ensures that the template provides meaningful feedback in cases where a list or iterable is empty, improving user experience.

### Using the `loop` Variable

In addition, PyBlade provides a special `loop` variable inside each loop, giving you helpful information about the current iteration. This variable allows you to access details like the current index, whether it’s the first or last iteration, and more.

Here is a full list of available properties on the loop variable.


| Property         | Description|
| -------------    | ---------- |
| `loop.index`     | The index of the current loop iteration (starts at 0).|
| `loop.iteration` | The current loop iteration (starts at 1).|
| `loop.first`     | Whether this is the first iteration through the loop.|
| `loop.last`      | Whether this is the last iteration through the loop.|
| `loop.count`     | The total number of iterations.|
| `loop.remaining` | The iterations remaining in the loop.|
| `loop.even`      | Whether this is an even iteration through the loop.|
| `loop.odd`       | Whether this is an odd iteration through the loop.|


**Example** with `loop` Variable

Let’s enhance the previous example to use the `loop` variable for displaying additional information about each item:

```html
<!-- items.html -->
<ul>
    @for(fruit in fruits)
        <li>
            @if(loop.first)
                First item:
            @elif(loop.last)
                Last item:
            @else
                Item {{ loop.iteration }} of {{ loop.count }}:
            @endif
            {{ item }}
        </li>
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li>First item: Apple</li>
    <li>Item 2 of 3: Banana</li>
    <li>Last item: Cherry</li>
</ul>
```

::: warning Missing feature
Nested loops are not supported yet.
:::


### Skipping and ending loop iterations

In PyBlade, you can use the `@continue` directive to skip the current iteration and move on to the next one, or the `@break` directive to exit the loop entirely based on a condition.

**Example** with `@continue` and `@break`

Suppose you have a list of fruits, and you want to display each fruit's name but want to skip "Banana" and stop the loop entirely once you reach "Date."

```python
# views.py
from django.shortcuts import render

def show_fruits(request):
    context = {'fruits': ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']}
    return render(request, 'fruits', context)
```

```html
<!-- fruits.html -->
<ul>
    @for(fruit in fruits)
        @if(fruit == 'Banana')
            @continue
        @endif

        <li>{{ fruit }}</li>

        @if(fruit == 'Date')
            @break
        @endif
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li>Apple</li>
    <li>Cherry</li>
</ul>
```

In this example:
- The `@continue` directive skips the iteration for "Banana," so "Banana" does not appear in the list.
- The `@break` directive stops the loop entirely when it reaches "Date," so "Elderberry" is not displayed.

### Simplified `@continue` and `@break` with Conditions

You can also include the condition directly within the `@continue` and `@break` directives to make your code more concise.

```html
<ul>
    @for fruit in fruits
        @continue(fruit == 'Banana')
        <li>{{ fruit }}</li>
        @break(fruit == 'Date')
    @endfor
</ul>
```

This has the same output as the previous example. By including the condition directly within the `@continue` and `@break` directives, you make the code shorter and clearer.

### Why the `@while` directive is missing in PyBlade ?

In PyBlade, we’ve chosen not to include a `@while` directive to encourage best practices in template design. While loops, if not carefully controlled, can introduce risks such as infinite loops, which can significantly impact performance and even cause server issues. Since templates should ideally focus on presenting data rather than complex logic or repeated condition-based iterations, we prioritize directives that maintain a clean separation between logic and presentation.

#### Recommended approach

Instead of a `@while` directive, we recommend:
- **Handling Loops in the View Layer**: Perform complex or condition-based iterations in the view or controller, passing the results to the template.
- **Using the `@for` Directive**: For most display needs, the `@for` directive is well-suited for iterating over collections, lists, or dictionaries, providing sufficient flexibility for typical use cases in templates.

#### Future considerations

If there is strong demand from the community and a clear use case for `@while`, we may consider adding it in future updates. However, we encourage users to leverage the view layer for more control over complex logic.

## Conditional Classes

The `@class` directive in PyBlade lets you conditionally apply CSS classes based on specific conditions. It accepts a dictionary where `keys` represent the class or classes you wish to add, while `values` are booleans or boolean expressions. If an expression evaluates to `True`, the associated class is applied.

**Example**

In this example, we apply the `list-item` class to each item and `favorite` class to items marked as a favorite:

```python
# views.py
from django.shortcuts import render

def show_fruits(request):
    context = {
        'fruits': [
            {'name': 'Apple', 'is_favorite': True},
            {'name': 'Banana', 'is_favorite': False},
            {'name': 'Cherry', 'is_favorite': True},
        ]
    }
    return render(request, 'fruits', context)
```

```html
<!-- fruits.html -->
<ul>
    @for fruit in fruits
        <li @class({"list-item": True, "favorite": fruit.is_favorite})>{{ fruit.name }}</li>
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li class="list-item favorite">Apple</li>
    <li class="list-item">Banana</li>
    <li class="list-item favorite">Cherry</li>
</ul>
```

## Conditional inline Styles

The `@style` directive works similarly to `@class`, but it controls inline CSS styles. It also takes a dictionary where `keys` are CSS properties, and `values` are booleans or expressions. When an expression evaluates to `True`, the associated style is applied to the element.

**Example**

Here, we set a red color for fruits that are not favorites:

```html
<ul>
    @for(fruit in fruits)
        <li @style({"color: red;": not fruit.is_favorite})>{{ fruit.name }}</li>
    @endfor
</ul>
```

**Output**

```html
<ul>
    <li>Apple</li>
    <li style="color: red;">Banana</li>
    <li>Cherry</li>
</ul>
```

## Including partials

In PyBlade, partials allow you to include smaller template sections within a template file. This modular approach is useful for reusing common components (e.g., headers, footers, or menus) across multiple templates, keeping your code organized and reducing redundancy.

Use the `@include` directive to insert a partial within a template. The path to the partial is specified as a string, excluding the `.html` extension and separating direcoties using **dot notation**.

**Example**

```html
<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
    @include("header")
</head>
<body>
    <main class="content">
        The main content goes here !
    </main>
    @include("footer")
</body>
</html>
```

## Variable manipulation  

PyBlade provides some useful directives for handling variables dynamically within templates. These directives allow efficient data manipulation without writing additional logic in the backend. Let’s go through them one by one.

### The `@with` directive

The `@with` directive allows you to assign a temporary variable within a block. This is useful when a value needs to be referenced multiple times within a small section of the template.  

For example, in a web application where users have profiles, the display name might depend on whether they have a full name set. Instead of checking this multiple times, `@with` can be used to assign a `display_name` variable and use it throughout the block.  

```html
@with(display_name=user.full_name or user.username)
    <h1>Welcome, {{ display_name }} !</h1>
    <p>Your are logged in as {{ display_name }}</p>
@endwith
```

Here, the `display_name` variable stores either `user.full_name` if available or falls back to `user.username`. This ensures that both the `<h1>` and `<p>` tags reference the same calculated value without repeating the logic.

Another use-case way of the `@with` directive is to store the result of a complex expression in a simpler variable. This is particularly helpful when dealing with operations that require significant processing, such as querying the database multiple times.  

For example:  

```html
@with(total=business.employees.count)
    {{ total }} employee{{ "s" if total > 1 else "" }}
@endwith
```

>[!info] Note
>The assigned variables (like `total` in the example) are only accessible within the `@with` block and will not be available outside of it.


You can also define multiple variables at once:  

```html
@with(alpha=1, beta=2)
    ...
@endwith
```  

### The `@ratio` directive  

The `@ratio` directive is useful for generating proportional values based on a given scale. This is commonly seen in progress indicators, performance metrics, or any scenario where values need to be mapped to a percentage or a fixed range.

Consider a dashboard that displays the progress of a software project based on completed tasks. If there are `40` completed tasks out of `120` total, and we want to scale this to `100` for a percentage value, `@ratio` makes it easy:  

```html
<p>Project Completion: @ratio(40, 120, 100) %</p>
```

PyBlade will calculate `(40 ÷ 120) × 100`, which results in `33 %`, dynamically adjusting the percentage based on the provided values.


Sometimes, you may need to store the calculated value in a variable for later use. This can be helpful in translated text or other contexts where you need to reference the value multiple times:  


```html
@ratio(this_value, max_value, max_width as width)
    <img src="bar.png" alt="Bar" height="10" width="{{ width }}">
@endratio
```

In this example, `@ratio` is used to calculate the width of a progress bar based on the provided values. It stores the calculated value in the `width` variable for later use.  

If `this_value` is 175, `max_value` is 200, and `max_width` is 100, the resulting width will be 88 pixels. This is because `175 ÷ 200 = 0.875` and `0.875 × 100` gives `87.5`, which rounds up to `88`.  


So, the `@ratio` directive calculates the proportion of a given value relative to a maximum value and scales it according to a fixed constant.  

>[!info] Tip
>For those accustomed to Django's syntax, PyBlade provides the `@widthratio` directive which can be used as a convenient alias for the `@ratio` directive, performing the same function.


### **The `@cycle` directive**  

When displaying elements in a repeating structure like loops, alternating between values can improve readability and usability. The `@cycle` directive helps cycle through a set of values in sequential order, automatically resetting after reaching the last one.

A common use case is in a table, where each row should have alternating background colors to enhance readability.

```html
<table>
    @for(lang in programming_languages)
        <tr class="@cycle('bg-gray-100', 'bg-white')">
            <td>{{ lang.name }}</td>
            <td>{{ lang.year_released }}</td>
        </tr>
    @endfor
</table>
```

Each row will alternate between `bg-gray-100` and `bg-white`, making it easier to differentiate between rows in the rendered table.

---

### **The `@firstof()` Directive**  

Data often comes from different sources, and sometimes, multiple fields might store the same type of information with different levels of availability. The `@firstof()` directive is useful in such cases by selecting the first non-empty value from a list.

In a code repository system, developers may have multiple contact options, such as an email, a GitHub username, or a fallback support email. Instead of checking each condition manually, `@firstof()` simplifies the process:

```pyblade
<p>Contact: {{ @firstof(user.email, user.github, 'support@example.com') }}</p>
```

If `user.email` exists, it will be displayed. If not, it will fall back to `user.github`, and if both are empty, `'support@example.com'` will be used. This ensures that a valid contact option is always shown.

---

### **The `@group()` Directive**  

When dealing with categorized data, grouping is often necessary for clarity and organization. The `@group()` directive automatically arranges data based on a given attribute, making it easier to display structured content.

Imagine an API documentation page listing available endpoints grouped by HTTP method. Instead of manually organizing them, `@group()` simplifies the process:

```pyblade
@group(endpoints, 'method') as groupedEndpoints
    @for(group in groupedEndpoints)
        <h2>{{ group.key }}</h2>
        <ul>
            @for(endpoint in group.list)
                <li>{{ endpoint.name }} - {{ endpoint.path }}</li>
            @endfor
        </ul>
    @endfor
@endgroup
```

If `endpoints` contains multiple API routes with different HTTP methods (`GET`, `POST`, `DELETE`), this directive groups them accordingly, displaying each category separately with its respective endpoints.

---

Each of these directives serves a distinct purpose, streamlining data manipulation within PyBlade templates without requiring additional backend logic. By leveraging them, developers can create more efficient and readable templates while maintaining flexibility in data presentation.

## Raw Python code

In PyBlade, the focus is on maintaining a clear separation between logic and presentation, which is why we've opted not to include raw Python code execution within templates. Although technically possible, embedding raw Python can quickly lead to complex, hard-to-maintain templates, reducing readability and performance.

However, we understand that in some cases, direct Python code might seem useful. If there is strong demand from the community, we would consider adding a `@python` directive. This directive could allow developers to execute Python code within templates, but we encourage handling complex logic in the view layer or controller instead.

For now, we recommend:
- **Using the View Layer for Logic** : Prepare all necessary data and pass it to the template from the view or controller. This keeps templates cleaner and focused on displaying information.
- **Leveraging PyBlade's Existing Directives**: Use PyBlade's conditional statements, loops, and directives like `@class` and `@style` for most template logic.

If you feel strongly about adding raw Python capabilities in PyBlade, please reach out! We are open to suggestions and would love to hear more about how this feature might help your projects.
