<!-- From properties
<!-- From actions -->

# Events

Liveblade offers a robust event system that you can use to communicate between different components on the page. Because it uses browser events under the hood, you can also use Liveblade's event system to communicate even with plain vanilla JavaScript.

To trigger an event, you may use the `emit()` method from anywhere inside your component and listen for that event from any other component on the page.

## Dispatching events

To dispatch an event from a Liveblade component, you can call the `emit()` method, passing it the event name and any additional data you want to send along with the event.

Below is an example of dispatching a `post-created` event from a `PostCreate` component:

```python
from pyblade import liveblade

class PostCreate(liveblade.Component):

    def save(self):
        ...
        self.emit("post-created") # [!code highlight]
```

In this example, when the `emit()` method is called, the `post-created` event will be emited, and every other component on the page that is listening for this event will be notified.

>[!tip] Pro tip
> You may use the `dispatch()` method to dispatch events. It works the same way as `emit()`.
> Choose which makes sense to you !

You can pass additional data with the event by passing the data as the second parameter to the `emit()` method:

```python
self.emit('post-created', title=post.title)
```

## Listening for events

To listen for an event in a Liveblade component, add the `@on` decorator above the method you want to be called when a given event is dispatched:

<!-- > [!warning] Warning
> Make sure you import liveblade decorators -->

```python
from pyblade import liveblade

class Dashboard(liveblade.Component):

	@on('post-created') # [!code highlight]
    def update_post_list(self, title: str):
        ...
```

Now, when the `post-created` event is dispatched from the `PostCreate` component, a network request will be triggered and the `update_post_list()` method will be called.

As you can see, additional data sent with the event will be provided to the method as its first argument.

### Listening for dynamic event names

Occasionally, you may want to dynamically generate event listener names at run-time using data from your component.

For example, if you wanted to scope an event listener to a specific Database model, you could append the model's ID to the event name when dispatching like so:

```python
from pyblade import liveblade
from app.models import Post


class PostUpdate(liveblade.Component):
    post: Post

    def update(self, id: int):
        ...
        self.emit(f"post-updated.{post.id}") # [!code highlight]
```

And then listen for that specific model:

```python
from pyblade import liveblade
from app.models import Post

class PostDetail(liveblade.Component):

    post: Post

	@on(f"post-updated.{post.id}") # [!code highlight]
    def refresh_post(self):
        ...

```

If the above `post` model had an ID of `3`, the `refresh_post()` method would only be triggered by an event named: `post-updated.3`.

### Listening for events from specific child components

Liveblade allows you to listen for events directly on individual child components in your PyBlade template like so:

```html
<div>
    <liveblade:edit-post b-saved="refresh">

    <!-- ... -->
</div>
```

In the above scenario, if the `edit-post` child component dispatches a `saved` event, the parent's `refresh` will be called and the parent will be refreshed.

Instead of passing `refresh`, you can pass any method you normally would to something like `b-click`. Here's an example of calling a `close()` method that might do something like close a modal dialog:

```html
<liveblade:edit-post b-saved="close">
```

If the child dispatched parameters along with the request, for example `self.emit('saved', post_id=1)`, you can forward those values to the parent method using the following syntax:

```html
<liveblade:edit-post b-saved="close(event.detail.post_id)">
```

## Dispatching directly to another component

If you want to use events for communicating directly between two components on the page, you can use the `emit().to()` modifier.

Below is an example of the `PostCreate` component dispatching the `post-created` event directly to the `Dashboard` component, skipping any other components listening for that specific event:

```python
from pyblade import liveblade

class postCreate(liveblade.Component):

    def save(self):
		self.emit("post-created").to("Dashboard") # [!code highlight]
```
<!-- # to(Dashboard::class) -->

## Dispatching a component event to itself

Using the `emit().self()` modifier, you can restrict an event to only being intercepted by the component it was triggered from:

```python
from pyblade import liveblade

class postCreate(liveblade.Component):

    def save(self):
		self.emit("post-created").self() # [!code highlight]
```

## Dispatching events from PyBlade templates

You can dispatch events directly from your PyBlade templates using the `emit()` function. This is useful when you want to trigger an event from a user interaction, such as a button click:

```html
<button b-click="emit('show-post-modal', id={{ post.id }})">
    EditPost
</button>
```

In this example, when the button is clicked, the `show-post-modal` event will be dispatched with the specified data.

If you want to dispatch an event directly to another component you can use the `emit().to()` modifier:

```html
<button b-click="emit('show-post-modal', id={{ post.id }}).to('PostList')">
    EditPost
</button>
```

In this example, when the button is clicked, the `show-post-modal` event will be dispatched directly to the `PostList` component.

## Using JavaScript to interact with events

Liveblade's event system becomes much more powerful when you interact with it from JavaScript inside your application. This unlocks the ability for any other JavaScript in your app to communicate with Liveblade components on the page.

### Listening for events inside component scripts

You can easily listen for the `post-created` event inside your component's template from a `@script` directive like so:

```html
@script
<script>
    py.on('post-created', () => {
        //
    });
</script>
@endscript
```

The above snippet would listen for the `post-created` from the component it's registered within. If the component is no longer on the page, the event listener will no longer be triggered.

### Dispatching events from component scripts

Additionally, you can dispatch events from within a component's `@script` like so:

```html
@script
<script>
    py.emit('post-created');
</script>
@endscript
```

When the above `@script` is run, the `post-created` event will be dispatched to the component it's defined within.

To dispatch the event only to the component where the script resides and not other components on the page (preventing the event from "bubbling" up), you can use `emit().self()`.

```js
py.emit('post-created').self();
```

You can pass any additional parameters to the event by passing an object as a second argument to `emit()`:

```html
@script
<script>
    py.emit('post-created', { refresh_posts: true });
</script>
@endscript
```

You can now access those event parameters from both your Liveblade class and also other JavaScript event listeners.

Here's an example of receiving the `refresh_posts` parameter within a Liveblade class:

```python
from pyblade import liveblade
# ...

    @on("post-created")
    def handle_new_post(self, refresh_posts: bool = false):
        ...
```

You can also access the `refresh_posts` parameter from a JavaScript event listener from the event's `detail` property:

```html
@script
<script>
    py.on('post-created', (event) => {
        let refreshPosts = event.detail.refresh_posts

        // ...
    });
</script>
@endscript
```


### Listening for Liveblade events from global JavaScript

Alternatively, you can listen for Liveblade events globally using `Liveblade.on` from any script in your application:

```html
<script>
    document.addEventListener('liveblade:init', () => {
       Liveblade.on('post-created', (event) => {
           //
       });
    });
</script>
```

The above snippet would listen for the `post-created` event dispatched from any component on the page.

If you wish to remove this event listener for any reason, you can do so using the returned `cleanup` function:

```html
<script>
    document.addEventListener('liveblade:init', () => {
        let cleanup = Liveblade.on('post-created', (event) => {
            //
        });

        // Calling "cleanup()" will un-register the above event listener...
        cleanup();
    });
</script>
```

