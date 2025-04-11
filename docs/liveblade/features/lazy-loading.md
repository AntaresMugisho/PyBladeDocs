# Lazy Loading

Liveblade allows you to lazy load components that would otherwise slow down the initial page load.

For example, imagine you have a `Revenue` component which contains a slow database query in `mount()`:

```python
from django.db.models import Sum
from pyblade import liveblade
from app.models import Transaction

class Revenue(liveblade.Component):

    amount: float

    def mount(self):
        # Slow database query...
        self.amount = Transaction.objects.month_to_date().aggregate(
            total=Sum('amount', default=0))['total']

    def render(self):
        return self.view('liveblade.revenue')
```

```blade
<div>
    Revenue this month: {{ amount }}
</div>
```

Without lazy loading, this component would delay the loading of the entire page and make your entire application feel slow.

To enable lazy loading, you can pass the `lazy` attribute into the component tag :

```blade
<liveblade:revenue lazy />
```

... or set the `lazy=True` key-word argument  when using the `@liveblade` directive:

 ```blade
@liveblade("revenue", lazy=True)
```

Now, instead of loading the component right away, Liveblade will skip this component, loading the page without it. Then, when the component is visible in the viewport, Liveblade will make a network request to fully load this component on the page.

> [!info] Lazy requests are isolated by default
> Unlike other network requests in Liveblade, lazy loading updates are isolated from each other when sent to the server. This keeps lazy loading fast, by loading each component in parallel when a page loads. [Read more on disabling this behavior here →](#disabling-request-isolation)

## Rendering placeholder HTML

By default, Liveblade will insert an empty `<div></div>` for your lazy loading component before it is fully loaded. As the component will initially be invisible to users, it can be jarring when the component suddenly appears on the page.

To signal to your users that the component is being loaded, you can define a `placeholder()` method to render any kind of placeholder HTML you like, including loading spinners and skeleton placeholders:

```python
from django.db.models import Sum
from pyblade import liveblade
from app.models import Transaction

class Revenue(liveblade.Component):

    amount: float

    def mount(self):
        # Slow database query...
        self.amount = Transaction.objects.month_to_date().aggregate(
            total=Sum('amount', default=0))['total']

    def placeholder(self):
        return self.inline("""
            <div>
                <!-- Loading spinner... -->
                <svg>...</svg>
            </div>
        """)

    def render(self):
        return self.view('liveblade.revenue')
```

Because the above component specifies a "placeholder" by returning inline HTML from a `placeholder()` method, the user will see an SVG loading spinner on the page until the component is fully loaded.

> [!warning] The placeholder and the component must share the same element type
> For instance, if your placeholder's root element type is a `<div>`, your component must also use a `<div>` as root element.

For more complex loaders, such as **skeletons**, you can return a template from the `placeholder()` similar to `render()`.

```python
def placeholder(self):
    return self.view('liveblade.placeholders.skeleton', context={})
```

<!-- Any parameters from the component being lazy loaded will be available as an `params` argument passed to the `placeholder()` method. -->


If you want to set a default placeholder template for all your lazy-loaded components, you can do so by referencing the view in the `pyblade.json` config file:

```json
"liveblade":{
    "enabled": true,
    "lazy_placeholder": "liveblade.placeholders.default", // [!code highlight]
}
```

Now, when a component is lazy-loaded and no `placeholder()` method is defined, Liveblade will use the configured PyBlade component (`liveblade.placeholders.default` in this case.)

## Lazy loading outside of the viewport

By default, Lazy-loaded components aren't full loaded until they enter the browser's viewport, for example when a user scrolls to one.

If you'd rather lazy load all components on a page as soon as the page is loaded, without waiting for them to enter the viewport, you can do so by passing "on_load" into the `lazy` parameter:

```blade
<liveblade:revenue lazy="on_load" />
```

... or set the `lazy="on_load"` key-word argument  when using the `@liveblade` directive:

```blade
@liveblade("revenue", lazy="on_load")
```

Now this component will load after the page is ready without waiting for it to be inside the viewport.


## Lazy load by default

If you want to enforce that all usages of a component will be lazy-loaded, you can add the `@lazy` decorator above the component class:

```python

from pyblade import liveblade

@lazy
class Revenue(liveblade.Component):
    ...
```

>[!tip] Pro tip !
> You may enable [lazy loading outside of the viewport](#lazy-loading-outside-of-the-viewport) with the `on_load=True` parameter:
>```python
>@lazy(on_load=True)
>class Revenue(liveblade.Component):
>    ...
>```

If you want to override lazy loading somewhere, you can set the `lazy` parameter to `False`:

```blade
<liveblade:revenue :lazy="False" />
```

or


```blade
@liveblade("revenue", lazy=False)
```

### Disabling request isolation

If there are multiple lazy-loaded components on the page, each component will make an independent network request, rather than each lazy update being bundled into a single request.

If you want to disable this isolation behavior and instead bundle all updates together in a single network request you can do so with the `isolate=False` parameter:

```python

from pyblade import liveblade

@lazy(isolate=False)
class Revenue(liveblade.Component):
    ...
```

Now, if there are ten `Revenue` components on the same page, when the page loads, all ten updates will be bundled and sent the server as single network request.


## Passing in props

In general, you can treat `lazy` components the same as normal components, since you can still pass data into them from outside.

For example, here's a scenario where you might pass a time interval into the `Revenue` component from a parent component:

```blade
<input type="date" b-model="start">
<input type="date" b-model="end">

<liveblade:revenue lazy :start="start" :end="end" />
```

You can accept this data in `mount()` just like any other component:

```python
from django.db.models import Sum
from pyblade import liveblade
from app.models import Transaction

class Revenue(liveblade.Component):

    amount: float

    def mount(self, start, end):  # [!code highlight]
        ...

    def placeholder(self):
        return self.view('liveblade.placeholders.skeleton', context={})

    def render(self):
        return self.view('liveblade.revenue')
```

However, unlike a normal component load, a `lazy` component has to serialize or "dehydrate" any passed-in properties and temporarily store them on the client-side until the component is fully loaded.

For example, you might want to pass in a Database model to the `Revenue` component like so:

```blade
<liveblade:revenue lazy :user="user" />
```

In a normal component, the actual Python in-memory `user` model would be passed into the `mount()` method of `Revenue`. However, because we won't run `mount()` until the next network request, Liveblade will internally serialize `user` to JSON and then re-query it from the database before the next request is handled.

Typically, this serialization should not cause any behavioral differences in your application.