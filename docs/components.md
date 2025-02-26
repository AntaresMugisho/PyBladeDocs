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

The **preferred way** to include a component in your template is by using a **PyBlade component tag**. Component tags start with `b-`, followed by the component file name without extension.  

For example, if you have a component file named `alert.html`, you can include it in your template like this:  

```html
<b-alert/>
```

Similarly, for a `user-profile.html` component, you would write:  

```html
<b-user-profile/>
```


A PyBlade component tag can be **self-closing** – When the component does not need any inner content,
```html
<b-alert/>
```
or **paired** – When you need to include content inside the component.

```html
<b-alert>
    This is an important message!
</b-alert>
```

### The `@component` directive 
PyBlade also provides an alternative way to render components using the `@component` directive:  

```html
@component('alert')
```

```html
@component('user-profile')
```

While this method works, **it is not as intuitive as using component tags**. The tag-based syntax is visually clearer and aligns with modern web development practices.  

### Handling nested components  
If your components are stored inside subdirectories within `templates/components`, you can indicate this hierarchy using a **dot notation** in both approaches.  

For instance, if you have a component file located at `templates/components/inputs/button.html`, you can render it as follows:  
  
```html
<b-inputs.button/>
```

or, alternatively:

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

## Component attributes  

We have already discussed about passing data attributes to a component. However, sometimes you may need to include additional HTML attributes — such as `class` — that are not directly related to the component’s logic but are useful for styling or behavior. These extra attributes should be applied to the root element of the component template.  

For example, let's say we want to render an alert component:  

```html
<b-alert type="error" :message="message" class="mt-4"/>
```  

All additional attributes are automatically available through the `attributes` variable inside the component. You can apply them to the component’s root element by simply outputting `attributes`:  

```html
<div {{ attributes }}>
    <!-- Component content -->
</div>
```  

This ensures that any extra attributes passed to the component are seamlessly integrated without requiring manual handling.

### Default and Merged attributes

In some cases, you might want to define default values for attributes or merge additional values into certain attributes of your component. For instance, this is useful when setting default CSS classes that should always be applied to a component, while also allowing flexibility to add or override them during component usage.

To do this, you can use the `merge` method available on the `attributes` variable. Here's an example of how to set a default class and merge it with an additional class passed to the component:

```html
<div {{ attributes.merge({'class': 'alert alert-' + type}) }}>
    {{ message }}
</div>
```

If you use the component like this:

```html
<b-alert type="error" :message="message" class="mb-4"/>
```

The final HTML rendered will be:

```html
<div class="alert alert-error mb-4">
    <!-- Contents of the message variable -->
</div>
```

This approach allows you to seamlessly merge default attributes with those passed to the component.

### Conditionally merging classes

Sometimes, you may want to merge classes only under certain conditions. The `class_` method can help achieve this. It takes a dictionary where the `key` is the class you want to add, and the `value` is a boolean expression. If the expression evaluates to `True`, the class will be included. 

Here's how to conditionally merge classes:

```html
<div {{ attributes.class_({'p-4': True, 'bg-red': has_error}) }}>
    {{ message }}
</div>
```

In this example, the class `p-4` will always be applied, and the class `bg-red` will only be applied if the `has_error` condition is `True`.

<!-- Must be sure the method chaining is available on the class_ methos of the attributes variable.

If you need to merge non-class attributes along with the `class_` method, you can chain the `merge` method:

```html
<button {{ attributes.class_({'p-4': true}).merge({'type': 'button'}) }}>
    {{ slot }}
</button>
``` -->


### Non-Class attribute merging

When merging attributes other than `class`, the values passed to the `merge` method will be treated as "default" values for the attribute. Unlike the `class` attribute, these values will overwrite any injected values. Here's an example of merging a `type` attribute:

```html
<button {{ attributes.merge({'type': 'button'}) }}>
    {{ slot }}
</button>
```

If you use the component as follows:

```html
<b-button type="submit">
    Submit
</b-button>
```

The rendered HTML will be:

```html
<button type="submit">
    Submit
</button>
```

<!-- If you want a non-class attribute to merge with injected values rather than be overwritten, you can use the `prepends` method. For instance:

```html
<div {{ attributes.merge({'data-controller': attributes.prepends('profile-controller')}) }}>
    {{ slot }}
</div>
``` -->

### Retrieving and filtering attributes
You may need to retrieve a specific attribute’s value, or filter attributes based on their keys. To retrieve a specific attribute’s value, you can use the `get` method:

```html
{{ attributes.get('class') }}
```

You may pass a default value to the `get` method. The default value will be returned if the attribute is not found:

```html
{{ attributes.get('class', 'default-class') }}
```

To retrieve all attributes whose keys start with a certain string, you can use the `where_starts_with` method:

```html
{{ attributes.where_starts_with('data-') }}
```

On the other hand, if you want to exclude attributes starting with a particular string, use the `where_does_not_start_with` method:

```html
{{ attributes.where_does_not_start_with('data-') }}
```


### Checking if attributes exist

You may check if an attribute is present using the `has` method. It returns `True` if the attribute exists:

```html
@if (attributes.has('class'))
    <div>Class attribute is present</div>
@endif
```

You can also check for multiple attributes by separating them with a comma:

```html
@if (attributes.has('name', 'class'))
    <div>Both 'name' and 'class' attributes are present</div>
@endif
```

To check if at least one of the some specific attributes exists, you can use the `has_any` method:

```html
@if (attributes.has_any('href', ':href'))
    <div>One of the attributes is present</div>
@endif
```

## Slots in PyBlade

You will often need to pass additional content to your component via **slots**. Component slots are rendered by echoing the `slot` variable. To explore this concept, let's imagine that an `alert` component has the following markup:

```html
<div class="alert alert-danger">
    {{ slot }}
</div>
```

You may pass content to the `slot` by injecting content inside the component tag:

```html
<b-alert>
    <strong>Whoops!</strong> Something went wrong!
</b-alert>
```

### Named slots

Sometimes, a component may need to render multiple different slots in different locations within the component. Let's modify our alert component to allow for the injection of a `title` slot:

```html
<span class="alert-title">{{ title }}</span>

<div class="alert alert-danger">
    {{ slot }}
</div>
```

You may define the content of the named slot using the `<b-slot>` tag. Any content not within an explicit `<b-slot>` tag will be passed to the component in the `slot` variable:

```html
<b-alert>
    <b-slot name="title">
        Server Error
    </b-slot>

    <strong>Whoops!</strong> Something went wrong !
</b-alert>
```

This will render:

```html
<span class="alert-title">Server Error</span>

<div class="alert alert-danger">
    <strong>Whoops!</strong> Something went wrong!
</div>
```

### Checking if a slot is empty

You can check if a slot contains content by using an `@if` statement with the `is_empty` method available on any slot object:

```html
<span class="alert-title">{{ title }}</span>

<div class="alert alert-danger">
    @if(slot.is_empty())
        This is default content if the slot is empty.
    @else
        {{ slot }}
    @endif
</div>
```

### Checking if slot has actual content

Additionally, you can use the `has_actual_content` method to determine if the slot contains any "actual" content that is not an HTML comment:

```html
@if(slot.has_actual_content())
    The scope has non-comment content.
@endif
```


### Slot attributes

Like Blade components, you can assign additional attributes to slots, such as CSS class names:

```html
<b-card class="shadow-sm">
    <b-slot name="heading" class="font-bold">
        Heading
    </b-slot>

    Content

    <b-slot name="footer" class="text-sm">
        Footer
    </b-slot>
</b-card>
```

To interact with slot attributes, you can access the `attributes` property of the slot's variable:
