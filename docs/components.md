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

## Component Attributes

We've already examined how to pass data attributes to a component; however, sometimes you may need to specify additional HTML attributes, such as `class`, that are not part of the data required for a component to function. Typically, you want to pass these additional attributes down to the root element of the component template. For example, imagine we want to render an `alert` component like so:

```html
<b-alert type="error" :message="message" class="mt-4"/>
```

All of the attributes will automatically be added to the component's "attribute bag". This attribute bag is automatically made available to the component via the `attributes` variable. All of the attributes may be rendered within the component by echoing this variable:

```html
<div {{ attributes }}>
    <!-- Component content -->
</div>
```
<a name="default-merged-attributes"></a>

### Default / Merged Attributes

Sometimes you may need to specify default values for attributes or merge additional values into some of the component's attributes. To accomplish this, you may use the attribute bag's `merge` method. This method is particularly useful for defining a set of default CSS classes that should always be applied to a component:

```html
<div {{ attributes->merge({'class': 'alert alert-' + type}) }}>
    {{ message }}
</div>
```

If we assume this component is utilized like so:

```html
<b-alert type="error" :message="message" class="mb-4"/>
```

The final, rendered HTML of the component will appear like the following:

```html
<div class="alert alert-error mb-4">
    <!-- Contents of the message variable -->
</div>
```

### Conditionally Merge Classes

Sometimes you may wish to merge classes if a given condition is `true`. You can accomplish this via the `class_` method, which accepts an array of classes where the array key contains the class or classes you wish to add, while the value is a boolean expression. If the array element has a numeric key, it will always be included in the rendered class list:

```blade
<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
    {{ $message }}
</div>
```

If you need to merge other attributes onto your component, you can chain the `merge` method onto the `class` method:

```blade
<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

> [!NOTE]  
> If you need to conditionally compile classes on other HTML elements that shouldn't receive merged attributes, you can use the [`@class` directive](#conditional-classes).

<a name="non-class-attribute-merging"></a>
#### Non-Class Attribute Merging

When merging attributes that are not `class` attributes, the values provided to the `merge` method will be considered the "default" values of the attribute. However, unlike the `class` attribute, these attributes will not be merged with injected attribute values. Instead, they will be overwritten. For example, a `button` component's implementation may look like the following:

```blade
<button {{ $attributes->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

To render the button component with a custom `type`, it may be specified when consuming the component. If no type is specified, the `button` type will be used:

```blade
<x-button type="submit">
    Submit
</x-button>
```

The rendered HTML of the `button` component in this example would be:

```blade
<button type="submit">
    Submit
</button>
```

If you would like an attribute other than `class` to have its default value and injected values joined together, you may use the `prepends` method. In this example, the `data-controller` attribute will always begin with `profile-controller` and any additional injected `data-controller` values will be placed after this default value:

```blade
<div {{ $attributes->merge(['data-controller' => $attributes->prepends('profile-controller')]) }}>
    {{ $slot }}
</div>
```

<a name="filtering-attributes"></a>
#### Retrieving and Filtering Attributes

You may filter attributes using the `filter` method. This method accepts a closure which should return `true` if you wish to retain the attribute in the attribute bag:

```blade
{{ $attributes->filter(fn (string $value, string $key) => $key == 'foo') }}
```

For convenience, you may use the `whereStartsWith` method to retrieve all attributes whose keys begin with a given string:

```blade
{{ $attributes->whereStartsWith('wire:model') }}
```

Conversely, the `whereDoesntStartWith` method may be used to exclude all attributes whose keys begin with a given string:

```blade
{{ $attributes->whereDoesntStartWith('wire:model') }}
```

Using the `first` method, you may render the first attribute in a given attribute bag:

```blade
{{ $attributes->whereStartsWith('wire:model')->first() }}
```

If you would like to check if an attribute is present on the component, you may use the `has` method. This method accepts the attribute name as its only argument and returns a boolean indicating whether or not the attribute is present:

```blade
@if ($attributes->has('class'))
    <div>Class attribute is present</div>
@endif
```

If an array is passed to the `has` method, the method will determine if all of the given attributes are present on the component:

```blade
@if ($attributes->has(['name', 'class']))
    <div>All of the attributes are present</div>
@endif
```

The `hasAny` method may be used to determine if any of the given attributes are present on the component:

```blade
@if ($attributes->hasAny(['href', ':href', 'v-bind:href']))
    <div>One of the attributes is present</div>
@endif
```

You may retrieve a specific attribute's value using the `get` method:

```blade
{{ $attributes->get('class') }}
```

<a name="reserved-keywords"></a>
### Reserved Keywords

By default, some keywords are reserved for Blade's internal use in order to render components. The following keywords cannot be defined as public properties or method names within your components:

<div class="content-list" markdown="1">

- `data`
- `render`
- `resolveView`
- `shouldRender`
- `view`
- `withAttributes`
- `withName`

</div>

<a name="slots"></a>
### Slots

You will often need to pass additional content to your component via "slots". Component slots are rendered by echoing the `$slot` variable. To explore this concept, let's imagine that an `alert` component has the following markup:

```blade
<!-- /resources/views/components/alert.blade.php -->

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

We may pass content to the `slot` by injecting content into the component:

```blade
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Sometimes a component may need to render multiple different slots in different locations within the component. Let's modify our alert component to allow for the injection of a "title" slot:

```blade
<!-- /resources/views/components/alert.blade.php -->

<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

You may define the content of the named slot using the `x-slot` tag. Any content not within an explicit `x-slot` tag will be passed to the component in the `$slot` variable:

```xml
<x-alert>
    <x-slot:title>
        Server Error
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

You may invoke a slot's `isEmpty` method to determine if the slot contains content:

```blade
<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    @if ($slot->isEmpty())
        This is default content if the slot is empty.
    @else
        {{ $slot }}
    @endif
</div>
```

Additionally, the `hasActualContent` method may be used to determine if the slot contains any "actual" content that is not an HTML comment:

```blade
@if ($slot->hasActualContent())
    The scope has non-comment content.
@endif
```

<a name="scoped-slots"></a>
#### Scoped Slots

If you have used a JavaScript framework such as Vue, you may be familiar with "scoped slots", which allow you to access data or methods from the component within your slot. You may achieve similar behavior in Laravel by defining public methods or properties on your component and accessing the component within your slot via the `$component` variable. In this example, we will assume that the `x-alert` component has a public `formatAlert` method defined on its component class:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

<a name="slot-attributes"></a>
#### Slot Attributes

Like Blade components, you may assign additional [attributes](#component-attributes) to slots such as CSS class names:

```xml
<x-card class="shadow-sm">
    <x-slot:heading class="font-bold">
        Heading
    </x-slot>

    Content

    <x-slot:footer class="text-sm">
        Footer
    </x-slot>
</x-card>
```

To interact with slot attributes, you may access the `attributes` property of the slot's variable. For more information on how to interact with attributes, please consult the documentation on [component attributes](#component-attributes):

```blade
@props([
    'heading',
    'footer',
])

<div {{ $attributes->class(['border']) }}>
    <h1 {{ $heading->attributes->class(['text-lg']) }}>
        {{ $heading }}
    </h1>

    {{ $slot }}

    <footer {{ $footer->attributes->class(['text-gray-700']) }}>
        {{ $footer }}
    </footer>
</div>
```

<a name="inline-component-views"></a>
### Inline Component Views

For very small components, it may feel cumbersome to manage both the component class and the component's view template. For this reason, you may return the component's markup directly from the `render` method:

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): string
    {
        return <<<'blade'
            <div class="alert alert-danger">
                {{ $slot }}
            </div>
        blade;
    }

<a name="generating-inline-view-components"></a>



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




