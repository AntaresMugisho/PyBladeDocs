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

### Authentication directives

When working with authentication, you often need to conditionally display content based on whether a user is logged in. Instead of manually checking `@if(user.is_authenticated)`, PyBlade provides `@auth` and `@guest` directives for a cleaner, more readable approach.  


The `@auth` directive ensures that the enclosed content is visible only to lauthenticated users. It’s useful for dashboards, account settings, or other user-specific content.  

```html
@auth
    <p>Welcome back, {{ user.name }}!</p>
    <a href="/dashboard">Go to Dashboard</a>
@else
    <p>You must log in to access this section.</p>
    <a href="/login">Log in here</a>
@endauth
```

Here, if the user is authenticated, they see their name and a dashboard link. Otherwise, they see a message prompting them to log in.  

On the other hand, the `@guest` directive is the opposite of `@auth`. It ensures the content is displayed only to "guests" (users who are not authenticated). 

```html
@guest
    <p>Welcome! Please <a href="/login">log in</a> or <a href="/register">sign up</a>.</p>
@else
    <p>Hello {{ user.name }}, you are already logged in.</p>
@endguest
```

If the user is not logged in, they see login and signup links. Otherwise, they are reminded that they are already authenticated.  

>[!tip]
> The `@anonymous` directive is an alias for `@guest`, so you can use either one interchangeably.  


## Match Case statements

Similar to Python, PyBlde also provides support for `@match` statements, which are useful for handling multiple conditions based on the value of a single variable. This can help simplify templates by reducing the need for multiple `@if`, `@elif`, and `@else` statements.

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

---
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

>[!Tip] Tip
>For those accustomed to Django's syntax, PyBlade provides the `@widthratio` directive which can be used as a convenient alias for the `@ratio` directive, performing the same function.

---
### The `@cycle` directive 

When displaying elements in a repeating structure, alternating between values can improve readability and usability.

The `@cycle` directive allows you to alternate between a set of values each time it is encountered. It cycles through the given arguments one by one, and when it reaches the end, it starts over from the first argument.  

This is particularly useful inside loops.

A common use case is in a table, where each row should have alternating background colors to enhance readability.

```html
<table>
    @for(book in books)
        <tr class="@cycle('bg-gray-100', 'bg-white')">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
        </tr>
    @endfor
</table>
```

In this example, each row will alternate between `bg-gray-100` and `bg-white`, so, the first row gets the class `bg-gray-100`, the second gets `bg-white`, the third gets `bg-gray-100` again, and so on.  

#### Using variables in `@cycle`  
---

You can also cycle through variables instead of fixed values. Suppose you have two CSS classes stored in variables:  

```html
@with(row1='highlight', row2='normal')
    @for(product in products)
        <tr class="@cycle(row1, row2)">
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
        </tr>
    @endfor
@endwith
```  

The values in the cycle will be automatically escaped for safety. However, if you need to disable auto-escaping, you can wrap it in an [`@autoescape`](displaying-data.html#the-autoescape-directive) block. 

```html
@for(product in products)
    <tr class="@autoescape(False) @cycle(row1, row2) @endautoescape">
        <td>{{ product.name }}</td>
        <td>{{ product.price }}</td>
    </tr>
@endfor
```  

You’re not limited to just variables or just strings — you can mix them as well:  

```html
@for(product in products)
    <tr class="@cycle('first', row1, 'last')">
        <td>{{ product.name }}</td>
        <td>{{ product.price }}</td>
    </tr>
@endfor
```

This will alternate between `"first"`, the value of `row2`, and `"last"`.  

#### Storing and reusing a Cycle  
---

If you need to reference the current value of a cycle without advancing it, you can assign it a name using the `as` keyword:  

```html
@cycle('red', 'blue' as color)
<p style="color: {{ color }}">This text alternates between red and blue.</p>
```  

Later in the template, you can use `@cycle(color)` to advance to the next value:  

```html
<p style="color: @cycle(color)">This text will continue cycling through the same colors.</p>
```  

#### Using `silent` to define a Cycle without output  
---

When using the `@cycle` directive with the `as` keyword, the cycle automatically produces the first value from the list of provided values. However, this behavior might not always be desirable, especially if you want to store the cycle's value for later use but don’t want it to be output immediately. That's where the `silent` keywork comes into play.

This keyword prevents the cycle from displaying its value **at the point where it's declared**, but still allows you to use the cycle in subsequent code.  


For example, if you're using the cycle within a loop and want to store the current value in a variable without outputting the first value right away, you can add the `silent` keyword. 

```html
@for(item in products)
    @cycle('row1', 'row2' as rowcolors silent)
    <tr class="{{ rowcolors }}">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
    </tr>

    @include('subtemplate')
@endfor
```

In this example, the first cycle value (`'row1'`) is not output immediately up to the `<tr>` tag. Instead, it is stored in the `rowcolors` variable, which is then used in the `<tr>` tag. The included subtemplate will also have access to the `rowcolors` variable in its context and the value will match the current cycle value.

For the above code, the output would look something like this:

```html
<tr class="row1">
    <td>Product 1</td>
    <td>$10</td>
</tr>
<tr class="row2">
    <td>Product 2</td>
    <td>$20</td>
</tr>
<tr class="row1">
    <td>Product 3</td>
    <td>$30</td>
</tr>
```

But without the `silent` keyword, **row1** and **row2** would be output right away as normal text, outside the `<tr>` elements resulting in something like this:

```html
row1
<tr class="row1">
    <td>Product 1</td>
    <td>$10</td>
</tr>
row2
<tr class="row2">
    <td>Product 2</td>
    <td>$20</td>
</tr>
row1
<tr class="row1">
    <td>Product 3</td>
    <td>$30</td>
</tr>
```
---

Once the `silent` keyword is used, it will apply to all subsequent uses of the same cycle until the end of the block or template. This means that you don't need to specify `silent` in every cycle call within that scope; it's automatically implied.
  

```html
@cycle('row1', 'row2' as rowcolors silent)
<tr class="{{ rowcolors }}">
    <td>{{ item.name }}</td>
    <td>{{ item.price }}</td>
</tr>

@cycle(rowcolors)  <!-- This will not output anything because silent is active -->
```

In this example, the cycle for `rowcolors` won't output anything, even when called again later.

#### Restarting a Cycle with `@resetcycle`  

If needed, you can reset a cycle so that it starts from the first value again the next time it is used:  

```html
@for(section in sections)
    @cycle('section-a', 'section-b' as section_class)
    <div class="{{ section_class }}">
        <h2>{{ section.title }}</h2>
        <p>{{ section.content }}</p>
    </div>
    
    @if(loop.last)
        @resetcycle(section_class)  <!-- Reset cycle to start from the first value -->
    @endif
@endfor
```

---
### The `@firstof` directive

Data often comes from different sources, and sometimes, multiple fields might store the same type of information with different levels of availability.

In PyBlade, the `@firstof` directive helps you select and display the first variable that holds a **meaningful** value. This means it will output the first argument that exists and is not empty, is not a `False` boolean value, is not `None` and is not a `0` numeric value. 

If all the provided variables are "falsy" (empty, `None`, `False`, or `0`), nothing is shown.

For example, consider this usage:  

```html
@firstof(var1, var2, var3)
```  

This is equivalent to writing:  

```html
@if(var1)
    {{ var1 }}
@elif(var2)
    {{ var2 }}
@elif(var3)
    {{ var3 }}
@endif
```  

You may also provide a fallback value that will be displayed if none of the variables hold a valid value.

For example, let's say you're building an online job portal. Job seekers may provide multiple ways for employers to contact them, such as a phone number, LinkedIn profile, or a general support email. Instead of manually checking each option, `@firstof` helps streamline the process:  

```html
<p>Contact: @firstof(user.phone, user.linkedin, 'support@jobportal.com')</p>
```  

If `user.phone` is available, it will be displayed. If not, it falls back to `user.linkedin`, and if both are missing, `'support@jobportal.com'` ensures there's always a valid contact option shown.

>[!info] Note
>By default, PyBlade automatically escapes output to prevent security risks. If you want to disable escaping for certain reasons, you can wrap the `@firstof` block in an [`@autoescape`](displaying-data.html#the-autoescape-directive) one.  
>```html
>@autoescape(False)
>    @firstof(var1, var2, var3, "<strong>Fallback Value</strong>")
>@endautoescape
>```  

<!--
Or if only some variables should be escaped, you can use the `|safe` filter:  

```html
@firstof(var1, var2|safe, var3, "<strong>Fallback Value</strong>"|safe)
```   -->

Sometimes, you may need to store the selected value in a variable for later use. You can assign it a name using the `as` keyword:

```html
@firstof(var1, var2, var3 as chosen_value)
<p>The selected value is: {{ chosen_value }}</p>
```  

This will make the `chosen_value` variable available in the context and you may use it later in the template.

---
### The `@regroup` directive  

When dealing with categorized data, grouping is often necessary for clarity and organization. The `@regroup` directive is used to categorize a list of similar objects based on a shared attribute. Instead of manually organizing the data, this directive automatically groups related items together for easier presentation.

This complex directive is best illustrated by way of an example. Let's say that `cities` is a list of cities represented by dictionaries containing `"name"`, `"population"`, and `"country"` keys:  

```python
cities = [
    {"name": "Mumbai", "population": "19,000,000", "country": "India"},
    {"name": "Calcutta", "population": "15,000,000", "country": "India"},
    {"name": "New York", "population": "20,000,000", "country": "USA"},
    {"name": "Chicago", "population": "7,000,000", "country": "USA"},
    {"name": "Tokyo", "population": "33,000,000", "country": "Japan"},
]
```

… and you’d like to display a hierarchical list that is ordered by country, like this:  

- India
    - Mumbai: 19,000,000
    - Calcutta: 15,000,000
- USA
    - New York: 20,000,000
    - Chicago: 7,000,000
- Japan
    - Tokyo: 33,000,000


You can use the `@regroup` directive to group the list of cities by country. The following snippet of template code would accomplish this:  

```html
@regroup(cities by country as country_list)

<ul>
@for(country in country_list)
    <li>{{ country.grouper }}
    <ul>
        @for(city in country.list)
          <li>{{ city.name }}: {{ city.population }}</li>
        @endfor
    </ul>
    </li>
@endfor
</ul>
```

Let’s walk through this example. `@regroup` takes three arguments: the list you want to regroup, the attribute to group by, and the name of the resulting list. Here, we’re regrouping the `cities` list by the `country` attribute and calling the result `country_list`.  

`@regroup` produces a list (in this case, `country_list`) of group objects. Group objects are instances of `namedtuple()` with two fields:  

- `grouper` – the item that was grouped by (e.g., the string `"India"` or `"Japan"`).  
- `list` – a list of all items in this group (e.g., a list of all cities with `country='India'`).  

Because `@regroup` produces `namedtuple()` objects, you can also write the previous example as:  


```html
@regroup(cities by country as country_list)

<ul>
@for(country, local_cities in country_list)
    <li>{{ country }}
    <ul>
        @for(city in local_cities)
          <li>{{ city.name }}: {{ city.population }}</li>
        @endfor
    </ul>
    </li>
@endfor
</ul>
```
>[!info] 💡 Note
> The `@regroup` directive does not order its input! Our example relies on the fact that the `cities` list was ordered by `country` in the first place. If the `cities` list did not order its members by `country`, the regrouping would naively display more than one group for a single country.  



For example, say the `cities` list was set to this (note that the countries are not grouped together):  

```python
cities = [
    {"name": "Mumbai", "population": "19,000,000", "country": "India"},
    {"name": "New York", "population": "20,000,000", "country": "USA"},
    {"name": "Calcutta", "population": "15,000,000", "country": "India"},
    {"name": "Chicago", "population": "7,000,000", "country": "USA"},
    {"name": "Tokyo", "population": "33,000,000", "country": "Japan"},
]
```


With this input for `cities`, the example `@regroup` template code above would result in the following output:  


- India
  - Mumbai: 19,000,000
- USA
  - New York: 20,000,000
- India
  - Calcutta: 15,000,000
- USA
  - Chicago: 7,000,000
- Japan
  - Tokyo: 33,000,000


The easiest solution to this gotcha is to make sure in your view code that the data is ordered according to how you want to display it.  

#### Grouping on other properties
---

If you use PyBlade in a Django application, it's important to note that any valid template lookup is a legal grouping attribute for the `@regroup` directive, including methods, attributes, dictionary keys, and list items.  

For example, if the `country` field is a foreign key to a class with an attribute `description`, you could use:  

```html
@regroup(cities by country.description as country_list)
```

Or, if `country` is a field with choices, it will have a `get_FOO_display()` method available as an attribute, allowing you to group on the display string rather than the choices key:  

```html
@regroup(cities by get_country_display as country_list)
```

<span v-pre>`{{ country.grouper }}`</span> will now display the value fields from the choices set rather than the keys.


---
### The `@ifchanged` directive

The `@ifchanged` directive in PyBlade is used **only inside loops** and helps you detect when a value changes between iterations. You might find it very useful to conditionally render content based on whether a variable has changed compared to its previous state.  

When used without arguments, `@ifchanged` checks its own rendered contents against its previous state and only displays the content if it has changed.  For example, this displays a list of days, only displaying the month if it changes:

```html
<h1>Archive for {{ year }}</h1>

@for(date in dates)
    @ifchanged
        <h3>{{ date.strftime('%B') }}</h3>
    @endifchanged
    <a href="/{{ date.strftime('%m/%d').lower() }}">{{ date.strftime('%d') }}</a>
@endfor
```

If given one or more variables as arguments to `@ifchanged` directive, it checks whether any variable has changed. For example, the following shows the date every time it changes, while showing the hour if either the hour or the date has changed:

```html
@for(date in dates)
    @ifchanged (date.date)
        <strong>{{ date.date }}</strong>
    @endifchanged
    
    @ifchanged (date.hour, date.date)
        <span>{{ date.hour }}</span>
    @endifchanged
@endfor
```

You can use an `@else` clause inside `@ifchanged` to define an alternative output when the value has **not** changed. For example, the following alternates between `red` and `blue` colors when `ballot_id` changes, otherwise uses `gray`:  

```html
@for(match in matches)
    <div style="background-color:
        @ifchanged(match.ballot_id)
            @cycle('red', 'blue')
        @else
            gray
        @endifchanged
    ">
        {{ match }}
    </div>
@endfor
```

---
### Capturing the present with `@now`

The `@now` directive is used to display the current date and time in a template. It takes a string format time based on Python’s standard [datetime module syntax](https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior).  

For example, if you want to show the full date and time, you can write:  

```html
It is @now("%Y-%m-%d %H:%M:%S")
```

If the current date and time is March 12, 2025, at 14:30:45, the output will be:  

```
It is 2025-03-12 14:30:45
```

Sometimes, you may need to store the output of `@now` in a variable to reuse it in different parts of the template. This can be done using the `as` keyword.  

```html
@now("%B" as current_month)

@if(current_month == "December")
    <p>Happy holidays! It's {{ current_month }}, the festive season.</p>
@else
    <p>Welcome to {{ current_month }}! Hope you have a great month.</p>
@endif
```

>[!Note]
> When the `as` keyword is used within the `@now` directive to store the current date and time in a variable, the directive does not produce any output on that line.


The table below outlines some of the most commonly used  datetime format specifiers from Python’s `datetime` module:  

| Format  | Description               | Example Output (March 12, 2025, 14:30:45) |
|---------|---------------------------|------------------------------------------|
| `%Y`    | Full year                  | `2025`                                   |
| `%y`    | Short year (last two digits) | `25`                                  |
| `%m`    | Month (zero-padded)         | `03`                                   |
| `%B`    | Full month name             | `March`                                |
| `%b`    | Short month name            | `Mar`                                  |
| `%d`    | Day (zero-padded)           | `12`                                   |
| `%A`    | Full weekday name           | `Wednesday`                            |
| `%a`    | Short weekday name          | `Wed`                                  |
| `%H`    | Hour (24-hour format)       | `14`                                   |
| `%I`    | Hour (12-hour format)       | `02`                                   |
| `%M`    | Minutes                     | `30`                                   |
| `%S`    | Seconds                     | `45`                                   |
| `%p`    | AM/PM                       | `PM`                                   |

## URL Handling and links

### `@url` Directive in PyBlade  

The `@url` directive generates an absolute path (a URL without the domain name) based on a named route and optional parameters. Any special characters in the resulting URL are automatically encoded.  

This directive helps keep templates clean and maintainable by avoiding hardcoded links, ensuring that changes in URL patterns do not require modifications in multiple places.  

#### Generating URLs with `@url`  

To generate a URL, pass the route name as the first argument, followed by any required parameters. The parameters should be separated by spaces.  

```blade
<a href="@url('some-url-name', v1, v2)">Click here</a>
```

In this example, the generated URL will dynamically include the values of `v1` and `v2` in the appropriate placeholders defined in the route configuration.  

#### Using Keyword Arguments  

Instead of positional arguments, keyword arguments can be used for better clarity:  

```blade
<a href="@url('some-url-name', arg1=v1, arg2=v2)">Click here</a>
```

It is important to note that positional and keyword arguments cannot be mixed within the same `@url` directive. Additionally, all required parameters must be provided to avoid errors.  

#### Example with Dynamic Route  

Consider a view function `client()` inside the `app_views.py` file, which requires a client ID as a parameter. Its corresponding route might look like this:  

```python
path("client/<int:id>/", app_views.client, name="app-views-client")
```

If this route is included under `"clients/"` in the main project’s URLs, the correct way to generate a link in a template would be:  

```blade
<a href="@url('app-views-client', client.id)">View Client</a>
```

If `client.id` is `123`, the generated URL would be:  

```
/clients/client/123/
```

#### Handling Missing Routes  

If the named route does not exist, PyBlade raises a `NoReverseMatch` exception, which could result in an error page. To avoid this, you can use the `as` keyword to store the URL in a variable before using it:  

```blade
@url('some-url-name', arg, arg2, as_="the_url")

<a href="{{ the_url }}">I'm linking to {{ the_url }}</a>
```

The variable `the_url` will only be available within the block where it is defined.  

If the route is optional, it can be conditionally checked before rendering a link:  

```blade
@url('some-url-name', as_="the_url")

@if the_url:
    <a href="{{ the_url }}">Link to optional content</a>
@endif
```

This ensures that broken links do not appear in the rendered page.  

#### Using Namespaced Routes  

For applications using namespaced URLs, specify the fully qualified name:  

```blade
<a href="@url('myapp:view-name')">Visit MyApp</a>
```

PyBlade will resolve the namespace according to the context, ensuring that the correct URL is generated.  

#### Important Note  

Always enclose the route name in quotes. If omitted, PyBlade will interpret the value as a context variable, leading to unexpected results.


### `@urlis` Directive in PyBlade  

The `@urlis` directive checks whether the current URL matches a given named route and returns `True` if it does, or `False` otherwise. This can be particularly useful for defining active states in navigation menus or conditionally rendering elements based on the active page.  

#### Checking the Current URL  

To use `@urlis`, pass the name of the route as the first argument. It will evaluate to `True` if the current page matches the provided route.  

```blade
@if @urlis('home')
    <span>You are on the homepage!</span>
@endif
```

If the current URL matches the `home` route, the message will be displayed. Otherwise, it will not render anything.  

#### Using `@urlis` for Navigation Menus  

A common use case is applying an `active` class to navigation links:  

```blade
<li class="@if @urlis('dashboard') active @endif">
    <a href="@url('dashboard')">Dashboard</a>
</li>
<li class="@if @urlis('profile') active @endif">
    <a href="@url('profile')">Profile</a>
</li>
```

When the user is on the "dashboard" page, the first `<li>` will have the `active` class. When they navigate to "profile," the second `<li>` will become active instead.  

#### Matching URLs with Parameters  

The `@urlis` directive can also be used for routes that include parameters. For example, if the current URL is `/clients/client/123/`, the following check will return `True` for `client.id = 123`:  

```blade
@if @urlis('app-views-client', client.id)
    <span>Viewing client {{ client.id }}</span>
@endif
```

This ensures that the check remains dynamic, adapting to different URL parameters.  

#### Combining `@urlis` and `@url`  

The `@urlis` directive pairs well with `@url` for improved navigation handling. A more structured navigation bar example:  

```blade
<ul>
    <li class="@if @urlis('home') active @endif">
        <a href="@url('home')">Home</a>
    </li>
    <li class="@if @urlis('about') active @endif">
        <a href="@url('about')">About</a>
    </li>
    <li class="@if @urlis('contact') active @endif">
        <a href="@url('contact')">Contact</a>
    </li>
</ul>
```

This approach ensures that the correct navigation item is highlighted based on the current route, enhancing the user experience.  

#### Important Considerations  

- `@urlis` strictly compares the full route, including parameters if provided.  
- If no parameters are given, it checks the base route only.  
- This directive is useful for styling elements dynamically without relying on JavaScript.  

By combining `@urlis` with `@url`, PyBlade makes route handling in templates more flexible and maintainable.


### `@static` Directive in PyBlade  

In PyBlade, the `@static` directive is used to link to static files that are saved in a predefined directory. This is similar to Django's static handling, which provides a convenient way to link to images, stylesheets, JavaScript files, and other resources that are served from a static folder.  

To link to a static file, use the `@static` directive with the path to the file. This will generate the appropriate URL for the static resource. The format of the URL is typically determined by the project's static settings.  

#### Basic Example  

If you want to link to an image stored in the `STATIC_ROOT` directory, you would do it like this:

```blade
<img src="@static('images/hi.jpg')" alt="Hi!">
```

This will resolve to the appropriate URL for the image, ensuring it is properly linked according to your static file configuration.  

#### Using Context Variables  

You can also pass context variables to the `@static` directive, similar to how Django’s static tag works. For example, if you have a `user_stylesheet` variable passed from the view, you can use it to dynamically link to a user's custom stylesheet:

```blade
<link rel="stylesheet" href="@static(user_stylesheet)" media="screen">
```

This way, the value of `user_stylesheet` will be treated as the path to the stylesheet, which can be modified based on the current user’s preferences or other dynamic conditions.  

#### Storing Static URL in a Variable  

If you want to retrieve a static URL without displaying it immediately, you can store the URL in a variable for later use. You can do this by using the `as` keyword, similar to other directives that assign values:

```blade
@static('images/hi.jpg' as myphoto)
<img src="{{ myphoto }}" alt="Hi!">
```

This stores the static URL for the image in the `myphoto` variable, which you can then use anywhere in the template.  

### `@get_static_prefix` Directive  

If you need more control over how the static URL is injected into the template, you can use the `@get_static_prefix` directive. This will give you the static URL prefix, which is typically the base URL for static files.  

```blade
<img src="@get_static_prefix()images/hi.jpg" alt="Hi!">
```

This allows you to explicitly append the path to the static resource to the URL prefix.  

Alternatively, you can store the static prefix in a variable to avoid repeated processing of the same value:

```blade
@get_static_prefix() as STATIC_PREFIX
<img src="{{ STATIC_PREFIX }}images/hi.jpg" alt="Hi!">
<img src="{{ STATIC_PREFIX }}images/hi2.jpg" alt="Hello!">
```

By doing this, the static prefix is stored in the `STATIC_PREFIX` variable, making it easier to use the same prefix multiple times throughout the template.  

### `@get_media_prefix` Directive  

Similar to `@get_static_prefix`, the `@get_media_prefix` directive provides the media URL prefix. This is useful when you need to link to media files, which are typically served separately from static files.  

For example, you can use `@get_media_prefix` to set a data attribute for media URLs:

```blade
<body data-media-url="@get_media_prefix()">
```

By storing the media prefix in a data attribute, you ensure it’s appropriately escaped if you need to use it in JavaScript, reducing the risk of issues such as invalid URL formatting or security vulnerabilities.  

- @querystring

## Internationalization

- @translate
- @blocktranslate
- @plural

## Raw Python code

In PyBlade, the focus is on maintaining a clear separation between logic and presentation, which is why we've opted not to include raw Python code execution within templates. Although technically possible, embedding raw Python can quickly lead to complex, hard-to-maintain templates, reducing readability and performance.

However, we understand that in some cases, direct Python code might seem useful. If there is strong demand from the community, we would consider adding a `@python` directive. This directive could allow developers to execute Python code within templates, but we encourage handling complex logic in the view layer or controller instead.

If you feel strongly about adding raw Python capabilities in PyBlade, please reach out! We are open to suggestions and would love to hear more about how this feature might help your projects.
