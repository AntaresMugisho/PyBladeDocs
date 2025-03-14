# Forms

Forms are essential in web applications, allowing users to submit data for processing. However, they come with security and method-handling challenges, which PyBlade simplifies through built-in directives. These directives enhance security, improve flexibility, and provide better compatibility across different Python web frameworks that support templates, such as **Django, Flask, and FastAPI**.  

---

## **CSRF Protection with `@csrf`**  

Security is a major concern when handling form submissions, especially against **Cross-Site Request Forgery (CSRF) attacks**. The `@csrf` directive is designed to prevent unauthorized form submissions by ensuring that every request includes a CSRF token. This token is validated by the server before processing the request.  

When a form contains `@csrf`, a hidden input field is automatically generated, embedding the CSRF token provided by the backend framework.  

#### **Example Usage in PyBlade:**  
```blade
<form action="/submit" method="POST">
    @csrf  {{-- Generates a CSRF token field --}}
    
    <input type="text" name="email" placeholder="Enter your email">
    <button type="submit">Subscribe</button>
</form>
```

#### **Expected HTML Output:**  
```html
<form action="/submit" method="POST">
    <input type="hidden" name="csrfmiddlewaretoken" value="random-token-value">
    
    <input type="text" name="email" placeholder="Enter your email">
    <button type="submit">Subscribe</button>
</form>
```

Many Python frameworks, such as **Django, Flask with WTForms, and FastAPI**, implement CSRF protection by checking for the token in POST, PUT, PATCH, and DELETE requests. If the token is missing or invalid, the request is rejected.  

##### **Key Takeaways:**
- Always include `@csrf` in forms that **modify data** (POST, PUT, PATCH, DELETE).  
- CSRF tokens are automatically generated and must be sent with form submissions.  
- Frameworks like **Django, Flask, and FastAPI** provide built-in CSRF validation.  

---

### **CSRF Protection in AJAX Requests**  

AJAX requests modifying data (POST, PUT, DELETE) **must include a CSRF token** to prevent security risks. Since browsers don’t automatically add it, we manually include it in headers.  

#### **1. Add CSRF Token in the Template**  
```blade
@csrf
<meta name="csrf-token" content="{{ csrf_token }}">
```

#### **2. Attach CSRF Token in AJAX Requests**  

**Using Fetch API**  
```js
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/submit-data', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "Hello" })
});
```

**Using jQuery AJAX**  
```js
$.ajaxSetup({ headers: { "X-CSRFToken": $('meta[name="csrf-token"]').attr("content") } });
$.post("/submit-data", { message: "Hello" }, response => console.log(response));
```

### **3. Backend Handling**  
- **Django**: Reads `X-CSRFToken` or uses `@csrf_exempt` (not recommended).  
- **Flask**: CSRF handled via `wtforms.csrf_token`.  
- **FastAPI**: Middleware validates CSRF tokens.  



## **Handling HTTP Methods with `@method`**  

HTML forms natively support only **GET** and **POST** methods, but web applications often require **PUT, PATCH, and DELETE** for resource management. The `@method` directive allows developers to define the intended HTTP method while keeping the form’s method as `POST`.  

This is useful for frameworks like **Django, Flask, and FastAPI**, which detect a hidden `_method` field and process the request accordingly.  

#### **Example Usage in PyBlade:**  
```blade
<form action="/update-profile" method="POST">
    @csrf
    @method("PUT")  {{-- Simulating a PUT request --}}
    
    <input type="text" name="username" value="JohnDoe">
    <button type="submit">Update Profile</button>
</form>
```

#### **Expected HTML Output:**  
```html
<form action="/update-profile" method="POST">
    <input type="hidden" name="csrfmiddlewaretoken" value="random-token-value">
    <input type="hidden" name="_method" value="PUT">
    
    <input type="text" name="username" value="JohnDoe">
    <button type="submit">Update Profile</button>
</form>
```

##### **How It Works Across Frameworks:**
- **Django** → Middleware detects `_method` and processes the request as a `PUT`.  
- **Flask** → Using `request.form['_method']`, the server processes the request accordingly.  
- **FastAPI** → Supports method overriding through request handling techniques.  

##### **Key Takeaways:**
- `@method` helps simulate **PUT, PATCH, and DELETE** within `POST` forms.  
- Many backend frameworks detect the `_method` field and handle it properly.  
- This ensures RESTful API compatibility without needing JavaScript tricks.  

---

### **Combining `@csrf` and `@method`**  

A common pattern in secure form handling is **combining** these two directives. This ensures that:
1. **The request is protected from CSRF attacks**.  
2. **The correct HTTP method is simulated**, even though HTML only supports GET and POST.  

#### **Example: Deleting a User Account**  
```blade
<form action="/delete-user" method="POST">
    @csrf
    @method("DELETE")  {{-- Simulating a DELETE request --}}
    
    <p>Are you sure you want to delete your account?</p>
    <button type="submit">Delete</button>
</form>
```

#### **Expected HTML Output:**  
```html
<form action="/delete-user" method="POST">
    <input type="hidden" name="csrfmiddlewaretoken" value="random-token-value">
    <input type="hidden" name="_method" value="DELETE">
    
    <p>Are you sure you want to delete your account?</p>
    <button type="submit">Delete</button>
</form>
```

This method ensures that:
- **CSRF protection** is enforced.  
- **The backend processes the request as a DELETE**.  
- **Security vulnerabilities are minimized**.  

---

### **Using These Directives in Different Python Web Frameworks**  

Since PyBlade is designed for **flexibility**, it can be used in different Python web frameworks that support templates.  

| **Framework** | **CSRF Handling** | **Method Handling** |
|--------------|------------------|--------------------|
| **Django**   | Uses `csrfmiddlewaretoken` and rejects missing tokens. | Supports `_method` for form method overriding. |
| **Flask**    | CSRF protection available via extensions like Flask-WTF. | Can detect `_method` in `request.form`. |
| **FastAPI**  | Uses CSRF protection through middleware solutions. | Supports method overriding via form data. |

These directives **enhance compatibility** across frameworks, making it easier for developers to build secure and flexible forms.  

---

### **Final Thoughts**  

By using `@csrf` and `@method`, PyBlade helps ensure that forms are **secure, flexible, and compatible** with multiple frameworks. These directives simplify handling complex form submissions while enforcing security best practices.  

When designing forms:  
✅ **Use `@csrf`** for security on non-GET requests.  
✅ **Use `@method`** when you need `PUT`, `PATCH`, or `DELETE`.  
✅ **Combine both** for a secure and RESTful experience.  

Would you like to see more advanced usage scenarios, such as AJAX requests with CSRF tokens? 🚀


Here’s how we can adapt the given text to correspond with the PyBlade directives using Python code, and address missing directives with examples:

---

## Conditional Input attributes

In PyBlade, similar to Laravel’s Blade, you can conditionally apply form input attributes using directives like `@checked`, `@selected`, `@disabled`, `@readonly`, `@required`, and more. These directives provide a clean, declarative way to manage form attributes based on conditions.

### **1. @checked Directive**

For convenience, you can use the `@checked` directive to conditionally mark checkboxes as "checked" if a given condition evaluates to true. This is useful when you need to retain form values after a submission or apply conditional logic.

- **Example**:
    ```python
    @checked(form.active.data == 'active')
    ```
    This directive will add the `checked` attribute to the checkbox if the condition `form.active.data == 'active'` evaluates to `true`.

    ```html
    <input
        type="checkbox"
        name="active"
        value="active"
        @checked(form.active.data == 'active')
    />
    ```

### **2. @selected Directive**

Likewise, the `@selected` directive is used to mark an option as "selected" in a `<select>` element, based on a condition.

- **Example**:
    ```python
    @selected(form.version.data == version)
    ```
    This directive will add the `selected` attribute to the `<option>` tag if the condition `form.version.data == version` evaluates to `true`.

    ```html
    <select name="version">
        {% for version in product.versions %}
            <option value="{{ version }}" @selected(form.version.data == version)>
                {{ version }}
            </option>
        {% endfor %}
    </select>
    ```

### **3. @disabled Directive**

The `@disabled` directive can be used to conditionally disable an HTML element, such as a button or input, based on a given condition.

- **Example**:
    ```python
    @disabled(form.errors)
    ```
    If there are any validation errors (`form.errors`), the button will be disabled.

    ```html
    <button type="submit" @disabled(form.errors)>Submit</button>
    ```

### **4. @readonly Directive**

The `@readonly` directive conditionally marks an input field as "readonly", preventing the user from changing its value.

- **Example**:
    ```python
    @readonly(form.user.is_not_admin())
    ```
    This directive will add the `readonly` attribute to the input field if the condition `form.user.is_not_admin()` is `true`.

    ```html
    <input
        type="email"
        name="email"
        value="email@domain.com"
        @readonly(form.user.is_not_admin())
    />
    ```

### **5. @required Directive**

The `@required` directive conditionally applies the `required` attribute to a form input, making it mandatory for submission.

- **Example**:
    ```python
    @required(form.user.is_admin())
    ```
    If the user is an admin (`form.user.is_admin()` is `true`), the input field will be required.

    ```html
    <input
        type="text"
        name="title"
        value="title"
        @required(form.user.is_admin())
    />
    ```

---

### **Additional Missing Directives**

While the directives above cover common use cases, you can also imagine the following hypothetical PyBlade directives for various other attributes. These would work similarly:

#### **@autofocus Directive**

This directive would apply the `autofocus` attribute, making an input field focused automatically when the page loads.

- **Example**:
    ```python
    @autofocus(form.username.focus)
    ```

    ```html
    <input
        type="text"
        name="username"
        @autofocus(form.username.focus)
    />
    ```

#### **@autocomplete Directive**

The `@autocomplete` directive controls whether browser autocomplete should be enabled or disabled for form inputs.

- **Example**:
    ```python
    @autocomplete(form.autocomplete_enabled)
    ```

    ```html
    <input
        type="text"
        name="email"
        @autocomplete(form.autocomplete_enabled)
    />
    ```

#### **@multiple Directive**

For select fields that allow multiple selections, you could have a `@multiple` directive to conditionally apply the `multiple` attribute.

- **Example**:
    ```python
    @multiple(form.options.allow_multiple)
    ```

    ```html
    <select name="options" @multiple(form.options.allow_multiple)>
        <!-- options here -->
    </select>
    ```

### **Summary**

These PyBlade directives (`@checked`, `@selected`, `@disabled`, `@readonly`, `@required`, and more) are a powerful way to conditionally apply form attributes based on conditions in your Python backend. They make your templates cleaner and your code more readable, while keeping your logic neatly separated from the presentation layer.

- Use `@checked` for checkboxes.
- Use `@selected` for select options.
- Use `@disabled`, `@readonly`, `@required` for form inputs based on logic.
- Additional directives like `@autofocus`, `@autocomplete`, and `@multiple` provide more flexibility in controlling input behavior.

This approach aligns with common patterns in modern web development frameworks, and in PyBlade, it makes it easy to build dynamic forms with clean templates.


## **Form Input Attribute Directives in PyBlade**

These directives are designed to conditionally apply attributes to form elements. They follow a pattern similar to Laravel's Blade directives, and allow for a clean and declarative way to handle common form input attributes such as `required`, `disabled`, `readonly`, `autocomplete`, `autofocus`, `selected`, and `checked`.

#### **1. @required Directive**
The `@required` directive is used to conditionally add the `required` attribute to a form field. This makes the field mandatory when submitting the form.

- **Without Arguments**: 
    ```blade
    @required
    ```
    This applies the `required` attribute unconditionally.
    ```html
    <input type="text" name="email" required>
    ```

- **With Conditional Expression**: 
    ```blade
    @required(form.email.required)
    ```
    If `form.email.required` is `true`, it will apply the `required` attribute.
    ```html
    <input type="text" name="email" required>
    ```

#### **2. @disabled Directive**
The `@disabled` directive adds the `disabled` attribute to the form element, preventing the user from interacting with it.

- **Without Arguments**: 
    ```blade
    @disabled
    ```
    This disables the form field unconditionally.
    ```html
    <input type="text" name="username" disabled>
    ```

- **With Conditional Expression**: 
    ```blade
    @disabled(form.user.disabled)
    ```
    The `disabled` attribute is applied only if `form.user.disabled` evaluates to `true`.
    ```html
    <input type="text" name="username" disabled>
    ```

#### **3. @readonly Directive**
The `@readonly` directive is used to mark an input field as read-only, preventing the user from editing the value but still allowing it to be submitted.

- **Without Arguments**:
    ```blade
    @readonly
    ```
    This makes the input field read-only.
    ```html
    <input type="text" name="address" readonly>
    ```

- **With Conditional Expression**:
    ```blade
    @readonly(form.address.isReadonly)
    ```
    The `readonly` attribute is applied only if `form.address.isReadonly` is `true`.
    ```html
    <input type="text" name="address" readonly>
    ```

#### **4. @autocomplete Directive**
The `@autocomplete` directive controls whether the browser should autocomplete the form input.

- **Without Arguments**:
    ```blade
    @autocomplete
    ```
    This applies the `autocomplete="on"` attribute.
    ```html
    <input type="text" name="email" autocomplete="on">
    ```

- **With Conditional Expression**:
    ```blade
    @autocomplete(form.autocomplete.enabled)
    ```
    If `form.autocomplete.enabled` evaluates to `true`, the `autocomplete` attribute is applied.
    ```html
    <input type="text" name="email" autocomplete="on">
    ```

#### **5. @autofocus Directive**
The `@autofocus` directive is used to automatically focus the input field when the page loads.

- **Without Arguments**:
    ```blade
    @autofocus
    ```
    This adds the `autofocus` attribute unconditionally.
    ```html
    <input type="text" name="username" autofocus>
    ```

- **With Conditional Expression**:
    ```blade
    @autofocus(form.username.focus)
    ```
    The `autofocus` attribute will only be added if `form.username.focus` is `true`.
    ```html
    <input type="text" name="username" autofocus>
    ```

#### **6. @selected Directive**
The `@selected` directive is used for `<option>` elements in `<select>` dropdowns. It marks an option as the selected option.

- **Without Arguments**:
    ```blade
    @selected
    ```
    This marks the option as selected.
    ```html
    <option value="option1" selected>Option 1</option>
    ```

- **With Conditional Expression**:
    ```blade
    @selected(form.options.selected == 'option1')
    ```
    The option will be selected if the condition `form.options.selected == 'option1'` is true.
    ```html
    <option value="option1" selected>Option 1</option>
    ```

#### **7. @checked Directive**
The `@checked` directive is used for checkboxes and radio buttons to mark them as checked.

- **Without Arguments**:
    ```blade
    @checked
    ```
    This checks the checkbox or radio button.
    ```html
    <input type="checkbox" name="subscribe" checked>
    ```

- **With Conditional Expression**:
    ```blade
    @checked(form.subscribe.checked)
    ```
    The checkbox will be checked if `form.subscribe.checked` evaluates to `true`.
    ```html
    <input type="checkbox" name="subscribe" checked>
    ```

---

### **Summary of Usage**

- These directives are **simple and clean** to use.
- You can apply them **conditionally** by passing expressions or leave them **unconditional**.
- They're **powerful** for handling common form attributes like `required`, `readonly`, `disabled`, etc.
- These directives help make the template code **readable and maintainable**.

---

### **Example: Putting It All Together**

```blade
@field(form.username, class="form-control", placeholder="Enter your username")
@required(form.username.required)
@readonly(form.username.readonly)
@autofocus(form.username.focus)

@field(form.newsletter, type="checkbox")
@checked(form.newsletter.checked)

@field(form.language, type="select")
@selected(form.language.selected == 'english')
```

This structure helps ensure form attributes are conditionally applied and keeps your templates concise and clean.

### Generating form fields
### **The `@field` Directive in PyBlade**  

The `@field` directive in **PyBlade** simplifies form rendering by generating HTML input elements directly from Django (or other frameworks’) form fields. It automatically applies attributes like **classes, required fields, and other HTML properties**, making form handling more elegant and readable.  

---

### **1. Basic Usage**  
```blade
@field(form.name, class="form-control p-2" required)
```
**Equivalent HTML output:**  
```html
<input type="text" name="name" id="id_name" class="form-control p-2" required>
```
✅ It **extracts attributes** (like name, type, and ID) from `form.name`.  
✅ **Automatically applies** custom attributes (`class`, `required`).  

---

### **2. Handling Different Field Types**  
`@field` adapts based on the form field type:  

```blade
@field(form.email, type="email", class="form-control")
```
Generates:  
```html
<input type="email" name="email" id="id_email" class="form-control">
```

For textareas:  
```blade
@field(form.description, class="form-control", rows=5)
```
```html
<textarea name="description" id="id_description" class="form-control" rows="5"></textarea>
```

For checkboxes:  
```blade
@field(form.accept_terms, type="checkbox")
```
```html
<input type="checkbox" name="accept_terms" id="id_accept_terms">
```

---

### **3. Automatically Binding Values**  
When rendering a form with data, `@field` ensures that **submitted values are retained**:  
```blade
@field(form.username, value=request.POST.username)
```
```html
<input type="text" name="username" id="id_username" value="john_doe">
```
Even after a failed submission, users won’t lose their input.  

---

### **4. Error Handling**  
To display validation errors, combine with `@error`:  
```blade
@field(form.password, class="form-control")
@error(form.password, class="text-danger")
```
This shows an error message below the input if validation fails:  
```html
<input type="password" name="password" id="id_password" class="form-control">
<span class="text-danger">This field is required.</span>
```

---

### **5. Why Use `@field`?**  
✅ **Reduces repetitive HTML** → No need to manually write `<input>` tags.  
✅ **Ensures consistency** → Uses the Django form structure.  
✅ **Easily customizable** → Supports additional attributes.  
✅ **Works in any Python web framework** supporting PyBlade (not just Django).  

**In short, `@field` simplifies form creation while keeping your templates clean and readable!** 🚀



## input error handling  

The `@error` directive in **PyBlade** simplifies error handling for form fields by **automatically checking for validation errors** and making the error message available in the `message` variable.  

---

### **1. Basic Usage**  
```blade
@error(form.phone)
    <small style="color:red;">{{ message }}</small>
@enderror
```
**What happens?**  
- If `form.phone` has a validation error, the directive **renders the error message** inside a `<small>` tag.  
- If there’s no error, nothing is displayed.  

---

### **2. Example with a Form Field**  
```blade
@field(form.phone, class="form-control")
@error(form.phone)
    <small style="color:red;">{{ message }}</small>
@enderror
```
✅ **If validation fails**, it generates:  
```html
<input type="text" name="phone" id="id_phone" class="form-control">
<small style="color:red;">This field is required.</small>
```
✅ **If there’s no error, only the input field appears** (no `<small>` tag).  

---

### **3. Customizing the Error Display**  
You can modify how the error appears using classes or styles:  
```blade
@error(form.email)
    <div class="alert alert-danger">{{ message }}</div>
@enderror
```
This would render:  
```html
<div class="alert alert-danger">Invalid email address.</div>
```

---

### **4. Works with Any Form Field**  
You can use `@error` for any field, such as passwords:  
```blade
@field(form.password, type="password", class="form-control")
@error(form.password)
    <span class="text-danger">{{ message }}</span>
@enderror
```
This makes it easy to handle errors without cluttering your templates with conditional checks.  

---

### **5. Why Use `@error`?**  
✅ **Removes manual error checking** → No need for `if` statements.  
✅ **Keeps templates clean** → Automatically binds the error message.  
✅ **Works seamlessly with Django and other frameworks** → Uses form validation logic.  

💡 **In short, `@error` makes handling validation errors elegant and effortless!** 🚀

## Cool example

Imagine creating forms in your web application with minimal code, but still maintaining dynamic behavior and error handling—all while keeping your templates clean and readable. That's the power of PyBlade.

With PyBlade, you can easily build reusable form components that automatically handle input fields and validation errors. By combining components with powerful directives like `@field` and `@error`, you can generate form fields dynamically, ensuring that every input is properly rendered and that errors are displayed automatically if validation fails.

### Here's how it works:

1. **Define a Component**: Create a reusable component that handles field rendering and error display.

    ```html
    <div>
        @field(field, class="form-control p-2" required)
        @error(field)
            <small style="color:red;">{{ message }}</small>
        @enderror
    </div>
    ```

2. **Use the Component in Your Form**: With just a field name, you can easily render the field with validation error handling.

    ```html
    <form method="POST" action="/submit">
        {% csrf_token %}
        <b-text-input :field="field.name"/>
        <button type="submit">Submit</button>
    </form>
    ```

3. **Automatic Behavior**: The `@field` directive generates the input field with required attributes, and `@error` automatically displays any validation messages tied to that field.

This approach allows you to focus on your application's logic while PyBlade handles form field rendering and error handling, all in a clean, declarative style.

### Why It’s Powerful:
- **Reusable Components**: Easily use the same component for multiple fields.
- **Dynamic Field Rendering**: Fields are generated based on data passed to them, making your templates more flexible.
- **Automatic Error Handling**: Validation errors are automatically displayed, without having to manually check or write conditions for each field.

With PyBlade, you can build forms faster, cleaner, and with less effort.