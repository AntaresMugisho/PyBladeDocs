# Components

PyBlade provides a powerful component system that allows developers to create reusable UI elements.
Components and slots provide similar benefits to sections, layouts, and includes; however, some may find the mental model of components and slots easier to understand. 


## Creating a component  
A component is simply a `.html` file that can be created manually, but for convenience, PyBlade provides the `pyblade make:component` command to generate a new component automatically.  

By default, components must be stored inside the `components` folder, located within your `templates` directory:

```
/templates
  ├── /components
  │     ├── alert.html
  │     ├── card.html
  │     └── ...
  ├── base.html
  ├── home.html
  └── ...
```

You can manually create a component inside the `components` folder, or use the provided command to generate one:  

```bash
pyblade make:component alert
```

This command will create the file:  

```
/templates/components/alert.html
```

## Rendering components
To display a component, you may use a PyBlade component tag within one of your PyBlade templates. PyBlade component tags start with the string `b-` followed by the kebab case name of the component class:

```html
<b-alert/>
```
```html
<b-user-profile/>
```

Alternatively, you may also use the `@component` directive to include a component in a template.

```html
@component('alert')
```
```html
@component('user-profile')
```

If the component class is nested deeper within the `templates/components` directory, you may use the `.` character to indicate directory nesting. For example, if we assume a component is located at `templates/components/inputs/button.html`, we may render it like so:

```html
<b-inputs.button/>
```
```html
@component('inputs.button')
```

## Passing data to components
When creating a component, it often expects certain values (variables) to be passed in when used.
You can pass data to PyBlade components using HTML attributes. Hard-coded, primitive values may be passed to the component using simple HTML attribute strings. Python expressions and variables should be passed to the component via attributes that use the `:` character as a prefix. 

If you're using the `@component` directive to render a component, you may pass data as the second parameter, in the form of a dictionary.

**Example**

Let's assume we have the following component:

```html
<!-- templates/components/alert.html -->

<div class="alert alert-{{ type }}">
    {{ message }}
</div>
```

As you can see, the component is waiting for two variables: `type` and `message`. We can provide them in the template where we want to use it  like this:

```html
<!-- templates/home.html -->

<x-alert type="success" message="Operation completed successfully."/>
```
or:

```html
<!-- templates/home.html -->

@component('alert', {'type':'success', 'message':'Operation completed successfully.'})
```

The rendered output will look like this:

```html
<!-- templates/home.html -->

<div class="alert alert-success">
    Operation completed successfully.
</div>
```

### Normal vs Bound attributes

When using PyBlade’s component tags (`<b-component-name>`), you can pass data as *Normal HTML attributes* (without `:`) or *Bound attributes* (starting with `:`).
Both methods serve different purposes in how data is interpreted and passed to the component.

#### 1. Normal attributes (Static values)  

Normal attributes are passed as **static strings**. These values are not evaluated as Python expressions but are used as they are.  

For example:

```html
<b-alert type="success" message="Operation completed successfully." />
```

Here, `"success"` and `"Operation completed successfully."` are passed as plain strings. The component receives them as-is, without any evaluation.  


#### 2. Bound Attributes (`:` Prefix for dynamic values)  

When an attribute starts with `:`, it is treated as a **Python expression**, meaning it is evaluated before being passed to the component.  

For example, assuming we have a variable `status` with a dynamic string value, we may pass it to the component by prefixing it with the `:` character like this:

```html
<b-alert :type="status" message="Operation done." />
```

In this example, `:type="status"` passes the **value of `status`** instead of the string `"status"`.  


## The `slot` variable

When using the PyBlade's component tag, each data, the content inside it will automatically be assigned to the `slot` variable and may be accessed into the component.


```html
<!-- templates/components/card.html -->

<div class="card">
    <h3>{{ title }}</h3>
    <div class="card-body">
        {{ slot }}
    </div>
</div>
```


```html
<!-- templates/home.html -->

<b-card title="Welcome">
    <p>This is the card content.</p>
</b-card>
```

**Output**  

```html
<!-- templates/home.html -->

<div class="card">
    <h3>Welcome</h3>
    <div class="card-body">
        <p>This is the card content.</p>
    </div>
</div>
```

---

## The `@props` directive 

The `@props` directive allows you to define default values for properties (variables) inside a component. If a value is not passed when using the component, it will fallback to the default. The `@props` directive accept a dictionary.

```html
<!-- templates/components/alert.html -->

@props({'type':'info', 'message':'Default message'}) 

<div class="alert alert-{{ type }}">
    {{ message }}
</div>
```

If no `type` is provided, it defaults to `"info"`. If no `message` is provided, it defaults to `"Default message"`:  

**Example**

```html
<b-alert type="warning" />
```

**Output**  

```html
<div class="alert alert-warning">
    Default message
</div>
```




