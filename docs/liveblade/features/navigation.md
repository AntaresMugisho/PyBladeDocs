# Navigation

Many modern web applications are built as "Single Page Applications" (SPAs). In these applications, each page rendered by the application no longer requires a full browser page reload, avoiding the overhead of re-downloading JavaScript and CSS assets on every request.

The alternative to a *single page application* is a *multi-page application*. In these applications, every time a user clicks a link, an entirely new HTML page is requested and rendered in the browser.

While most Python web applications have traditionally been multi-page applications, Liveblade offers a single page application experience via a simple attribute you can add to links in your application: `b-navigate`.

## Basic usage

Let's explore an example of using `b-navigate`. Below is a typical Django urls file (`my_project/my_project/urls.py`) with three Liveblade components defined as views:

```python
from django.urls import path
from liveblade import Dashboard, PostList, UserList

urlpatterns = [
    path("/", Dashboard.as_view(), name="dashboard"),
    path("posts/", PostList.as_view(), name="posts"),
    path("/users/", UserList.as_view(), name="users")
]
```

By adding `b-navigate` to each link in a navigation menu on each page, Liveblade will prevent the standard handling of the link click and replace it with its own, faster version:

```blade
<nav>
    <a href="/" b-navigate>Dashboard</a>
    <a href="/posts" b-navigate>Posts</a>
    <a href="/users" b-navigate>Users</a>
</nav>
```

Below is a breakdown of what happens when a `b-navigate` link is clicked:

* User clicks a link
* Liveblade prevents the browser from visiting the new page
* Instead, Liveblade requests the page in the background and shows a loading bar at the top of the page
* When the HTML for the new page has been received, Liveblade replaces the current page's URL, `<title>` tag and `<body>` contents with the elements from the new page

This technique results in much faster page load times — often twice as fast — and makes the application "feel" like a JavaScript powered single page application.

>[!tip]Pro tip !
> Instead of using a URL pattern, you may use the URL name with the `@url` PyBlade directive.
> ```html
><a href="@url('dashboard')" b-navigate>Dashboard</a>
>```

## Redirects

When one of your Liveblade components redirects users to another URL within your application, you can also instruct Liveblade to use its `b-navigate` functionality to load the new page. To accomplish this, provide the `navigate` argument to the `redirect()` method:

```python
return self.redirect('posts/', navigate=True)
```

Now, instead of a full page request being used to redirect the user to the new URL, Liveblade will replace the contents and URL of the current page with the new one.

## Prefetching links

By default, Liveblade includes a gentle strategy to _prefetch_ pages before a user clicks on a link:

* A user presses down on their mouse button
* Liveblade starts requesting the page
* They lift up on the mouse button to complete the _click_
* Liveblade finishes the request and navigates to the new page

Surprisingly, the time between a user pressing down and lifting up on the mouse button is often enough time to load half or even an entire page from the server.

If you want an even more aggressive approach to prefetching, you may use the `.hover` modifier on a link:

```blade
<a href="posts/" b-navigate.hover>Posts</a>
```

The `.hover` modifier will instruct Liveblade to prefetch the page after a user has hovered over the link for `60` milliseconds.

> [!warning] Prefetching on hover increases server usage
> Because not all users will click a link they hover over, adding `.hover` will request pages that may not be needed, though Liveblade attempts to mitigate some of this overhead by waiting `60` milliseconds before prefetching the page.

## Persisting elements across page visits

Sometimes, there are parts of a user interface that you need to persist between page loads, such as audio or video players. For example, in a podcasting application, a user may want to keep listening to an episode as they browse other pages.

You can achieve this in Liveblade with the `@persist` directive.

By wrapping an element with `@persist` and providing it with a name, when a new page is requested using `b-navigate`, Liveblade will look for an element on the new page that has a matching `@persist`. Instead of replacing the element like normal, Liveblade will use the existing DOM element from the previous page in the new page, preserving any state within the element.

Here is an example of an `<audio>` player element being persisted across pages using `@persist`:

```blade
@persist('player')
    <audio src="{{ episode.file }}" controls></audio>
@endpersist
```

If the above HTML appears on both pages — the current page, and the next one — the original element will be re-used on the new page. In the case of an audio player, the audio playback won't be interrupted when navigating from one page to another.

Please be aware that the persisted element must be placed outside your Liveblade components. A common practice is to position the persisted element in your main layout, such as `templates/liveblade/layouts/base.html`.

```html
<!-- templates/liveblade/layouts/base.html -->

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ title or 'Page Title' }}</title>
    </head>
    <body>
        <main>
            {{ slot }}
        </main>

        @persist('player') <!-- [!code highlight:2] -->
            <audio src="{{ episode.file }}" controls></audio>
        @endpersist
    </body>
</html>
```

### Highlighting active links

You might be used to highlighting the currently active page link in a navbar using server-side PyBlade like so:

```blade
<nav>
    <a href="/" class="@urlis('dashboard', 'font-bold text-zinc-800')">Dashboard</a>
    <a href="posts/" class="@urlis('posts', 'font-bold text-zinc-800')">Posts</a>
    <a href="users/" class="@urlis('users', 'font-bold text-zinc-800')">Users</a>
</nav>
```

However, this will not work inside persisted elements as they are re-used between page loads. Instead, you should use Liveblade's `b-current` directive to highlight the currently active link.

Simply pass any CSS classes you want to apply to the currently active link to `b-current`:

```blade
<nav>
    <a href="/" ... b-current="font-bold text-zinc-800">Dashboard</a>
    <a href="posts/" ... b-current="font-bold text-zinc-800">Posts</a>
    <a href="users/" ... b-current="font-bold text-zinc-800">Users</a>
</nav>
```

Now, when the `posts/` page is visited, the "Posts" link will have a stronger font treatment than the other links.

Read more in the [`b-current` documentation](/liveblade/liveblade-directives#b-current).

### Preserving scroll position

By default, Liveblade will preserve the scroll position of a page when navigating back and forth between pages. However, sometimes you may want to preserve the scroll position of an individual element you are persisting between page loads.

To do this, you must add `b-scroll` to the element containing a scrollbar like so:

```html
@persist('scrollbar')
<div class="overflow-y-scroll" b-scroll> <!-- [!code highlight] -->
    <!-- ... -->
</div>
@endpersist
```

## JavaScript hooks

Each page navigation triggers three lifecycle hooks:

* `liveblade-navigate`
* `liveblade-navigating`
* `liveblade-navigated`

It's important to note that these three hooks events are dispatched on navigations of all types. This includes manual navigation using `Liveblade.navigate()`, redirecting with navigation enabled (`self.redirect(navigate=True)`), and back and forward button presses in the browser.

Here's an example of registering listeners for each of these events:

```js
document.addEventListener('liveblade-navigate', (event) => {
    // Triggers when a navigation is triggered.

    // Can be "cancelled" (prevent the navigate from actually being performed):
    event.preventDefault()

    // Contains helpful context about the navigation trigger:
    let context = event.detail

    // A URL object of the intended destination of the navigation...
    context.url

    // A boolean [true/false] indicating whether or not this navigation
    // was triggered by a back/forward (history state) navigation...
    context.history

    // A boolean [true/false] indicating whether or not there is
    // cached version of this page to be used instead of
    // fetching a new one via a network round-trip...
    context.cached
})

document.addEventListener('liveblade-navigating', () => {
    // Triggered when new HTML is about to swapped onto the page...

    // This is a good place to mutate any HTML before the page
    // is navigated away from...
})

document.addEventListener('liveblade-navigated', () => {
    // Triggered as the final step of any page navigation...

    // Also triggered on page-load instead of "DOMContentLoaded"...
})
```

> [!warning] Event listeners will persist across pages
>
> When you attach an event listener to the document it will not be removed when you navigate to a different page. This can lead to unexpected behaviour if you need code to run only after navigating to a specific page, or if you add the same event listener on every page. If you do not remove your event listener it may cause exceptions on other pages when it's looking for elements that do not exist, or you may end up with the event listener executing multiple times per navigation.
>
> An easy method to remove an event listener after it runs is to pass the option `{once: true}` as a third parameter to the `addEventListener` function.
> ```js
> document.addEventListener('liveblade-navigated', () => {
>     // ...
> }, { once: true })
> ```

## Manually visiting a new page

In addition to `b-navigate`, you can manually call the `Liveblade.navigate()` method to trigger a visit to a new page using JavaScript:

```html
<script>
    // ...

    Liveblade.navigate('/new/url/')
</script>
```

## Using with analytics software

When navigating pages using `b-navigate` in your app, any `<script>` tags in the `<head>` only evaluate when the page is initially loaded.

This creates a problem for analytics software such as [Fathom Analytics](https://usefathom.com/). These tools rely on a `<script>` snippet being evaluated on every single page change, not just the first.

Tools like [Google Analytics](https://marketingplatform.google.com/about/analytics/) are smart enough to handle this automatically, however, when using Fathom Analytics, you must add `data-spa="auto"` to your script tag to ensure each page visit is tracked properly:

```blade
<head>
    <!-- ... -->

    <!-- Fathom Analytics -->
    <script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFG" data-spa="auto" defer></script> <!-- [!code highlight] -->
</head>
```

## Script evaluation

When navigating to a new page using `b-navigate`, it _feels_ like the browser has changed pages; however, from the browser's perspective, you are technically still on the original page.

Because of this, styles and scripts are executed normally on the first page, but on subsequent pages, you may have to tweak the way you normally write JavaScript.

Here are a few caveats and scenarios you should be aware of when using `b-navigate`.

### Don't rely on `DOMContentLoaded`

It's common practice to place JavaScript inside a `DOMContentLoaded` event listener so that the code you want to run only executes after the page has fully loaded.

When using `b-navigate`, `DOMContentLoaded` is only fired on the first page visit, not subsequent visits.

To run code on every page visit, swap every instance of `DOMContentLoaded` with `liveblade-navigated`:

```js
document.addEventListener('DOMContentLoaded', () => { // [!code --]
document.addEventListener('liveblade-navigated', () => { // [!code ++]
    // ...
})
```

Now, any code placed inside this listener will be run on the initial page visit, and also after Liveblade has finished navigating to subsequent pages.

Listening to this event is useful for things like initializing third-party libraries.

### Scripts in `<head>` are loaded once

If two pages include the same `<script>` tag in the `<head>`, that script will only be run on the initial page visit and not on subsequent page visits.

```blade
<!-- Page one -->
<head>
    <script src="/app.js"></script>
</head>

<!-- Page two -->
<head>
    <script src="/app.js"></script>
</head>
```

### New `<head>` scripts are evaluated

If a subsequent page includes a new `<script>` tag in the `<head>` that was not present in the `<head>` of the initial page visit, Liveblade will run the new `<script>` tag.

In the below example, _page two_ includes a new JavaScript library for a third-party tool. When the user navigates to _page two_, that library will be evaluated.

```blade
<!-- Page one -->
<head>
    <script src="/app.js"></script>
</head>

<!-- Page two -->
<head>
    <script src="/app.js"></script>
    <script src="/third-party.js"></script>
</head>
```

> [!info] Head assets are blocking
> If you are navigating to a new page that contains an asset like `<script src="...">` in the head tag. That asset will be fetched and processed before the navigation is complete and the new page is swapped in. This might be surprising behavior, but it ensures any scripts that depend on those assets will have immediate access to them.

### Reloading when assets change

It's common practice to include a version hash in an application's main JavaScript file name. This ensures that after deploying a new version of your application, users will receive the fresh JavaScript asset, and not an old version served from the browser's cache.

But, now that you are using `b-navigate` and each page visit is no longer a fresh browser page load, your users may still be receiving stale JavaScript after deployments.

To prevent this, you may add `data-navigate-track` to a `<script>` tag in `<head>`:

```blade
<!-- Page one -->
<head>
    <script src="/app.js?id=123" data-navigate-track></script>
</head>

<!-- Page two -->
<head>
    <script src="/app.js?id=456" data-navigate-track></script>
</head>
```

When a user visits _page two_, Liveblade will detect a fresh JavaScript asset and trigger a full browser page reload.

> [!warning] Only query string changes are tracked
> Liveblade will only reload a page if a `[data-navigate-track]` element's query string (`?id="456"`) changes, not the URI itself (`/app.js`).

### Scripts in the `<body>` are re-evaluated

Because Liveblade replaces the entire contents of the `<body>` on every new page, all `<script>` tags on the new page will be run:

```blade
<!-- Page one -->
<body>
    <script>
        console.log('Runs on page one')
    </script>
</body>

<!-- Page two -->
<body>
    <script>
        console.log('Runs on page two')
    </script>
</body>
```

If you have a `<script>` tag in the body that you only want to be run once, you can add the `data-navigate-once` attribute to the `<script>` tag and Liveblade will only run it on the initial page visit:

```blade
<script data-navigate-once>
    console.log('Runs only on page one')
</script>
```

## Customizing the progress bar

When a page takes longer than 150ms to load, Liveblade will show a progress bar at the top of the page.

You can customize the color of this bar or disable it all together inside PyBlade's config file (`my_project/pyblade.json`):

```json
"liveblade":{
    "enabled": true,
    "navigate": {
        "show_progress_bar": true,
        "progress_bar_color": "#2299dd",
    }
}
```
