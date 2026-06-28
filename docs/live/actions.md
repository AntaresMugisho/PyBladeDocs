# Actions

PyBlade Live actions are methods on your component that can be triggered by frontend interactions like clicking a button or submitting a form. 

They provide the developer experience of being able to call a Python method directly from the browser, allowing you to focus on the logic of your application without getting bogged down writing boilerplate code connecting your application's frontend and backend.

Let's explore a basic example of calling a `save` action on a `CreatePost` component:

```python
from pyblade import live
from app.models import Post

class CreatePost(live.component):
    title = ""
    content  = ""

    def save(self):
        Post.objects.create(title=self.title, self.content)

    def render(self):
        return self.view('live.create-post');
```

```html
<form pb-submit="save"> // [!code highlight]
    <input type="text" pb-model="title">

    <textarea pb-model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

In the above example, when a user submits the form by clicking "Save", `pb-submit` intercepts the `submit` event and calls the `save()` method on the server.

In essence, actions are a way to easily map user interactions to server-side functionality without the hassle of submitting and handling AJAX requests manually.

## Confirming an action

When allowing users to perform dangerous actions — such as deleting a post from the database — you may want to show them a confirmation alert to verify that they wish to perform that action.

PyBlade Live makes this easy by providing a simple directive called `pb-confirm`:

```html{4}
<button
    type="button"
    pb-click="delete"
    pb-confirm="Are you sure you want to delete this post?"
>
    Delete post
</button>
```

When `pb-confirm` is added to an element containing a PyBlade Live action, when a user tries to trigger that action, they will be presented with a confirmation dialog containing the provided message. They can either press **"Yes"** to confirm the action, or press **"Cancel"** or hit the escape key to cancel the action.

## Passing parameters

PyBlade Live allows you to pass parameters from your PyBlade template to the actions in your component, giving you the opportunity to provide an action additional data or state from the frontend when the action is called.

For example, let's imagine you have a `TodoList` component that allows users to delete a task. You can pass the task's ID as a parameter to the `delete()` action in your PyBlade Live component. Then, the action can fetch the relevant task and delete it from the database:

```python
rom pyblade import live
from app.models import Task

class TodoList(live.Component):
    
    def mount(self):
        self.tasks = Task.objects.all()

    def delete(self, id: int):
        task = Task.objects.get(id=id)
        task.delete()

    def render(self):
        return self.view("live.todo-list")

```

```html
<div>
    @for (task in tasks)
        <div key="{{ task.id }}">
            <h1>{{ task.title }}</h1>
            <span>{{ task.content }}</span>

            <button pb-click="delete({{ task.id }})">Delete</button> // [!code highlight]
        </div>
    @endfor
</div>
```

For a task with an ID of 2, the "Delete" button in the PyBlade template above will render in the browser as:

```html
<button pb-click="delete(2)">Delete</button>
```

When this button is clicked, the `delete()` method will be called and `id` will be passed in with a value of "2".

> [!warning] Don't trust action parameters !
> Action parameters should be treated just like HTTP request input, meaning action parameter values should not be trusted. You should always authorize ownership of an entity before updating it in the database.
>
> For more information, consult our documentation regarding [security concerns](#).


## Skipping re-renders

Everytime an action in your component is trigerred, the `render()` method is called to re-render the component.

But, sometimes there might be an action in your component with no side effects that would change the rendered PyBlade template when the action is invoked. If so, you can skip the `render` portion of PyBlade Live's lifecycle by adding the `@renderless` decorator above the action method.

Let's say you want to track when a user clicks on a button, but this interaction doesn’t change any visible part of the UI.

```python
from pyblade.live import Component
from app.models import ActivityLog

class ActivityTracker(Component):
    user_id = None

    def mount(self, user_id):
        self.user_id = user_id

    @renderless
    def track_click(self):
        # Log the click to your database or analytics service
        ActivityLog.objects.create(user_id=self.user_id, action="clicked_button")
```

```html
<button wire:click="track_click" class="btn">
    Click Me
</button>
```

What happens here is that when the `track_click` method is called, the `@renderless` decorator tells PyBlade Live not to call the `render()` method afterward.

This saves time and prevents an unnecessary re-render of the component.
It’s perfect for fire-and-forget logic — like logging, silent actions, or external calls.

If you prefer to not utilize method attributes or need to conditionally skip rendering, you may invoke the `skip_render()` method in your component action:

```python
class PostDetail(live.Component):
    ...

    def increment_view_count():
        self.post.increment_views()
        self.skip_render() # [!code highlight]

    def render():
        return view('live.show-post');

```


## JavaScript actions

PyBlade Live allows you to define JavaScript actions that run entirely on the client-side without making a server request. This is useful in two scenarios:

1. When you want to perform simple UI updates that don't require server communication
2. When you want to optimistically update the UI with JavaScript before making a server request

To define a JavaScript action, you can use the `js()` function inside a `<script>` tag in your component.

Here's an example of bookmarking a post that uses a JavaScript action to optimistically update the UI before making a server request. The JavaScript action immediately shows the filled bookmark icon, then makes a request to persist the bookmark in the database:

```python
from pyblade import live 

class PostDetail(live.Component):
    
    def mount(self):
        self.bookmarked = self.post.is_bookmarked_by(request.user)

    def bookmark_post(self):
        self.post.bookmark(request.user)
        self.bookmarked = self.post.is_bookmarked_by(request.user)

    def render(self):
        return view('live.post-detail')
```

```html
<div>
    <button pb-click="js.bookmark" class="flex items-center gap-1">
        {# Outlined bookmark icon... #}
        <svg pb-show="!bookmarked" pb-cloak xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>

        {# Solid bookmark icon... #}
        <svg pb-show="bookmarked" pb-cloak xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>

@script
<script>
    js('bookmark', () => {
        live.bookmarked = !live.bookmarked

        live.bookmark_post()
    })
</script>
@endscript
```

When a user clicks the heart button, the following sequence occurs:

1. The "bookmark" JavaScript action is triggered
2. The heart icon immediately updates by toggling `wire.bookmarked` on the client-side
3. The `bookmark_post()` method is called to save the change to the database

This provides instant visual feedback while ensuring the bookmark state is properly persisted.

### Calling from Python

JavaScript actions can also be called using the `js()` method from Python:

```python
from pyblade import live 

class CreatePost(live.Component):
    
    def save(self):
        ...
        self.js("onPostSaved") # [!code highlight]
```

```html
<div>
    <!-- ... -->

    <button pb-click="save">Save</button>
</div>

@script
<script>
    js('onPostSaved', () => {
        alert('Your post has been saved successfully!')
    })
</script>
@endscript
```

In this example, when the `save()` action is finished, the `onPostSaved` JavaScript action will be run, triggering the alert dialog.

## Magic actions

PyBlade Live provides a set of "magic" actions that allow you to perform common tasks in your components without defining custom methods. These magic actions can be used within event listeners defined in your PyBlade templates.

### Refreshing a component

Sometimes you may want to trigger a simple "refresh" of your component. For example, if you have a component checking the status of something in the database, you may want to show a button to your users allowing them to refresh the displayed results.

You can do this using PyBlade Live's simple `refresh` action anywhere you would normally reference your own component method:

```html
<button type="button" pb-click="refresh">...</button>
```

When the `refresh` action is triggered, PyBlade Live will make a server-roundtrip and re-render your component without calling any methods.

It's important to note that any pending data updates in your component (for example `pb-model` bindings) will be applied on the server when the component is refreshed.


### Calling parent actions

The `parent` magic variable allows you to access parent component properties and call parent component actions from a child component:

```html
<button pb-click="parent.remove_post({{ post.id }})">Remove</button>
```

In the above example, if a parent component has a `remove_post()` action, a child can call it directly from its PyBlade template using `parent.remove_post()`.

### Updating properties

The `set` magic action allows you to update a property in your PyBlade Live component directly from the PyBlade template. To use `set`, provide the property you want to update and the new value as arguments:

```html
<button pb-click="set('query', '')">Reset Search</button>
```

In this example, when the button is clicked, a network request is dispatched that sets the `query` property in the component to an empty string `''`.

### Toggling Boolean values

The `toggle` action is used to toggle the value of a boolean property in your PyBlade Live component:

```html
<button pb-click="toggle('sort_asc')">
    Sort {{ "Descending" if sort_asc else "Ascending" }}
</button>
```

In this example, when the button is clicked, the `sort_asc` property in the component will toggle between `True` and `False`.

### Dispatching events

The `emit` action allows you to dispatch a PyBlade Live event directly in the browser. Below is an example of a button that, when clicked, will emit the `post-deleted` event:

```html
<button type="submit" pb-click="emit('post-deleted')">Delete Post</button>
```

>[!tip] Pro tip
>You can also use the `dispatch` action to dispatch events. It works the same way as `emit`.

### Accessing event objects

The `event` action may be used within event listeners like `pb-click`. This action gives you access to the actual JavaScript event that was triggered, allowing you to reference the triggering element and other relevant information:

```html
<input type="text" pb-keydown.enter="search(event.target.value)">
```

When the enter key is pressed while a user is typing in the input above, the contents of the input will be passed as a parameter to the `search()` action.

## Event listeners

PyBlade Live supports a variety of event listeners, allowing you to respond to various types of user interactions:

| Listener        | Description                               |
|-----------------|-------------------------------------------|
| `pb-click`    | Triggered when an element is clicked      |
| `pb-submit`   | Triggered when a form is submitted        |
| `pb-change`   | Triggered when an input value changes        |
| `pb-keydown`  | Triggered when a key is pressed down      |
| `pb-keyup`  | Triggered when a key is released
| `pb-mouseenter`| Triggered when the mouse enters an element |
| `pb-*`| Whatever text follows `pb-` will be used as the event name of the listener |

Because the event name after `pb-` can be anything, PyBlade Live supports any browser event you might need to listen for. For example, to listen for `transitionend`, you can use `pb-transitionend`.

### Listening for specific keys

You can use one of PyBlade Live's convenient aliases to narrow down key press event listeners to a specific key or combination of keys.

For example, to perform a search when a user hits `Enter` after typing into a search box, you can use `pb-keydown.enter`:

```html
<input pb-model="query" pb-keydown.enter="searchPosts">
```

You can chain more key aliases after the first to listen for combinations of keys. For example, if you would like to listen for the `Enter` key only while the `Shift` key is pressed, you may write the following:

```html
<input pb-keydown.shift.enter="...">
```

Below is a list of all the available key modifiers:

| Modifier      | Key                          |
|---------------|------------------------------|
| `.shift`      | Shift                        |
| `.enter`      | Enter                        |
| `.space`      | Space                        |
| `.ctrl`       | Ctrl                         |
| `.cmd`        | Cmd                          |
| `.meta`       | Cmd on Mac, Windows key on Windows |
| `.alt`        | Alt                          |
| `.up`         | Up arrow                     |
| `.down`       | Down arrow                   |
| `.left`       | Left arrow                   |
| `.right`      | Right arrow                  |
| `.esc`     | Escape                       |
| `.tab`        | Tab                          |
| `.caps-lock`  | Caps Lock                    |
| `.equal`      | Equal, `=`                   |
| `.period`     | Period, `.`                  |
| `.slash`      | Forward Slash, `/`           |

### Event handler modifiers

PyBlade Live also includes helpful modifiers to make common event-handling tasks trivial.

For example, if you need to call `event.preventDefault()` from inside an event listener, you can suffix the event name with `.prevent`:

```html
<input pb-keydown.prevent="...">
```

Here is a full list of all the available event listener modifiers and their functions:

| Modifier         | Key                                                     |
|------------------|---------------------------------------------------------|
| `.prevent`       | Equivalent of calling `.preventDefault()`               |
| `.stop`          | Equivalent of calling `.stopPropagation()`              |
| `.window`        | Listens for event on the `window` object                 |
| `.outside`       | Only listens for clicks "outside" the element            |
| `.document`      | Listens for events on the `document` object              |
| `.once`          | Ensures the listener is only called once                 |
| `.debounce`      | Debounce the handler by 250ms as a default               |
| `.debounce.100ms`| Debounce the handler for a specific amount of time       |
| `.throttle`      | Throttle the handler to being called every 250ms at minimum |
| `.throttle.100ms`| Throttle the handler at a custom duration                |
| `.self`          | Only call listener if event originated on this element, not children |
| `.camel`         | Converts event name to camel case (`pb-custom-event` -> "customEvent") |
| `.dot`           | Converts event name to dot notation (`pb-custom-event` -> "custom.event") |
| `.passive`       | `pb-touchstart.passive` won't block scroll performance |
| `.capture`       | Listen for event in the "capturing" phase                 |


### Disabling inputs while a form is being submitted

Consider the `CreatePost` example we previously discussed:

```html
<form pb-submit="save">
    <input pb-model="title">

    <textarea pb-model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

When a user clicks **"Save"**, a network request is sent to the server to call the `save()` action on the PyBlade Live component.

But, let's imagine that a user is filling out this form on a slow internet connection. The user clicks "Save" and nothing happens initially because the network request takes longer than usual. They might wonder if the submission failed and attempt to click the "Save" button again while the first request is still being handled.

In this case, there would be two requests for the same action being processed at the same time.

To prevent this scenario, PyBlade Live automatically disables the submit button and all form inputs inside the `<form>` element while a `pb-submit` action is being processed. This ensures that a form isn't accidentally submitted twice.

To further lessen the confusion for users on slower connections, it is often helpful to show some loading indicator such as a subtle background color change or SVG animation.

PyBlade Live provides a `pb-loading` directive that makes it trivial to show and hide loading indicators anywhere on a page. Here's a short example of using `pb-loading` to show a loading message below the "Save" button:

```html
<form pb-submit="save">
    <textarea pb-model="content"></textarea>

    <button type="submit">Save</button>

    <span pb-loading>Saving...</span>  // [!code highlight]
</form>
```

## Security concerns

Remember that any method in your PyBlade Live component can be called from the client-side, even without an associated `pb-click` handler that invokes it. In these scenarios, users can still trigger the action from the browser's DevTools. So to make your application secure, read out our [Security concerns](#) before using actions.

<!-- 
Remember that any public method in your PyBlade Live component can be called from the client-side, even without an associated `pb-click` handler that invokes it. In these scenarios, users can still trigger the action from the browser's DevTools.

Below are three examples of easy-to-miss vulnerabilities in PyBlade Live components. Each will show the vulnerable component first and the secure component after. As an exercise, try spotting the vulnerabilities in the first example before viewing the solution.

If you are having difficulty spotting the vulnerabilities and that makes you concerned about your ability to keep your own applications secure, remember all these vulnerabilities apply to standard web applications that use requests and controllers. If you use a component method as a proxy for a controller method, and its parameters as a proxy for request input, you should be able to apply your existing application security knowledge to your PyBlade Live code.

### Always authorize action parameters

Just like controller request input, it's imperative to authorize action parameters since they are arbitrary user input.

Below is a `ShowPosts` component where users can view all their posts on one page. They can delete any post they like using one of the post's "Delete" buttons.

Here is a vulnerable version of the component:

```python
<?python

namespace App\PyBlade Live;

use Illuminate\Support\Facades\Auth;
use PyBlade Live\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete(id)
    {
        post = Post::find(id);

        post->delete();
    }

    public function render()
    {
        return view('live.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```html
<div>
    @foreach (posts as post)
        <div pb-key="{{ post->id }}">
            <h1>{{ post->title }}</h1>
            <span>{{ post->content }}</span>

            <button pb-click="delete({{ post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

Remember that a malicious user can call `delete()` directly from a JavaScript console, passing any parameters they would like to the action. This means that a user viewing one of their posts can delete another user's post by passing the un-owned post ID to `delete()`.

To protect against this, we need to authorize that the user owns the post about to be deleted:

```python
<?python

namespace App\PyBlade Live;

use Illuminate\Support\Facades\Auth;
use PyBlade Live\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete(id)
    {
        post = Post::find(id);

        this->authorize('delete', post); // [tl! highlight]

        post->delete();
    }

    public function render()
    {
        return view('live.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

### Always authorize server-side

Like standard Laravel controllers, PyBlade Live actions can be called by any user, even if there isn't an affordance for invoking the action in the UI.

Consider the following `BrowsePosts` component where any user can view all the posts in the application, but only administrators can delete a post:

```python
<?python

namespace App\PyBlade Live;

use PyBlade Live\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost(id)
    {
        post = Post::find(id);

        post->delete();
    }

    public function render()
    {
        return view('live.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```html
<div>
    @foreach (posts as post)
        <div pb-key="{{ post->id }}">
            <h1>{{ post->title }}</h1>
            <span>{{ post->content }}</span>

            @if (Auth::user()->isAdmin())
                <button pb-click="deletePost({{ post->id }})">Delete</button>
            @endif
        </div>
    @endforeach
</div>
```

As you can see, only administrators can see the "Delete" button; however, any user can call `deletePost()` on the component from the browser's DevTools.

To patch this vulnerability, we need to authorize the action on the server like so:

```python
<?python

namespace App\PyBlade Live;

use Illuminate\Support\Facades\Auth;
use PyBlade Live\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost(id)
    {
        if (! Auth::user()->isAdmin) { // [tl! highlight:2]
            abort(403);
        }

        post = Post::find(id);

        post->delete();
    }

    public function render()
    {
        return view('live.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

With this change, only administrators can delete a post from this component.

### Keep dangerous methods protected or private

Every public method inside your PyBlade Live component is callable from the client. Even methods you haven't referenced inside a `pb-click` handler. To prevent a user from calling a method that isn't intended to be callable client-side, you should mark them as `protected` or `private`. By doing so, you restrict the visibility of that sensitive method to the component's class and its subclasses, ensuring they cannot be called from the client-side.

Consider the `BrowsePosts` example that we previously discussed, where users can view all posts in your application, but only administrators can delete posts. In the [Always authorize server-side](/docs/actions#always-authorize-server-side) section, we made the action secure by adding server-side authorization. Now imagine we refactor the actual deletion of the post into a dedicated method like you might do in order to simplify your code:

```python
// Warning: This snippet demonstrates what NOT to do...
<?python

namespace App\PyBlade Live;

use Illuminate\Support\Facades\Auth;
use PyBlade Live\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost(id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        this->delete(id); // [tl! highlight]
    }

    public function delete(postId)  // [tl! highlight:5]
    {
        post = Post::find(postId);

        post->delete();
    }

    public function render()
    {
        return view('live.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```html
<div>
    @foreach (posts as post)
        <div pb-key="{{ post->id }}">
            <h1>{{ post->title }}</h1>
            <span>{{ post->content }}</span>

            <button pb-click="deletePost({{ post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

As you can see, we refactored the post deletion logic into a dedicated method named `delete()`. Even though this method isn't referenced anywhere in our template, if a user gained knowledge of its existence, they would be able to call it from the browser's DevTools because it is `public`.

To remedy this, we can mark the method as `protected` or `private`. Once the method is marked as `protected` or `private`, an error will be thrown if a user tries to invoke it:

```python
<?python

namespace App\PyBlade Live;

use Illuminate\Support\Facades\Auth;
use PyBlade Live\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost(id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        this->delete(id);
    }

    protected function delete(postId) // [tl! highlight]
    {
        post = Post::find(postId);

        post->delete();
    }

    public function render()
    {
        return view('live.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

## Applying middleware

By default, PyBlade Live re-applies authentication and authorization related middleware on subsequent requests if those middleware were applied on the initial page load request.

For example, imagine your component is loaded inside a route that is assigned the `auth` middleware and a user's session ends. When the user triggers another action, the `auth` middleware will be re-applied and the user will receive an error.

If there are specific middleware that you would like to apply to a specific action, you may do so with the `#[Middleware]` attribute. For example, we could apply a `LogPostCreation` middleware to an action that creates posts:

```python
<?python

namespace App\PyBlade Live;

use App\Http\Middleware\LogPostCreation;
use PyBlade Live\Component;

class CreatePost extends Component
{
    public title;

    public content;

    #[Middleware(LogPostCreation::class)] // [tl! highlight]
    public function save()
    {
        // Create the post...
    }

    // ...
}
```

Now, the `LogPostCreation` middleware will be applied only to the `createPost` action, ensuring that the activity is only being logged when users create a new post.

-->
