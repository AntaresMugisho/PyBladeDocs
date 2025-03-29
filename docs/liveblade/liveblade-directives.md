# Liveblade directives


## b-click
Liveblade provides a simple `b-click` directive for calling component methods (aka actions) when a user clicks a specific element on the page.

For example, given the `InvoiceDetail` component below:

```python
from pyblade import liveblade
from app.models import Invoice

class ShowInvoice(liveblade.Component):
    invoice: Invoice

    def download(self):
        return response().download(
           f"{self.invoice.file_path}_invoice.pdf"
        )
```

In the component's template, you can trigger the `download()` method from the class above when a user clicks a "Download Invoice" button by adding `b-click="download"`:

```html
<button type="button" b-click="download"> // [!code highlight]
    Download Invoice
</button>
```

### Using `b-click` on links

When using `b-click` on `<a>` tags, you must append `.prevent` to prevent the default handling of a link in the browser. Otherwise, the browser will visit the provided link and update the page's URL.

```html
<a href="#" b-click.prevent="...">
```

### Going deeper

The `b-click` directive is just one of many different available event listeners in Liveblade. For full documentation on its (and other event listeners) capabilities, visit the [Liveblade documentation](actions) page.


## b-submit

Liveblade makes it easy to handle form submissions via the `b-submit` directive. By adding `b-submit` to a `<form>` element, Liveblade will intercept the form submission, prevent the default browser handling, and call any Liveblade component method.

Here's a basic example of using `b-submit` to handle a "PostCreate" form submission:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component)
    title: str = ""
    content: str = ""

    def save(self):
        Post.objects.create(title=self.title, content=self.content)
        self.redirect("/posts")

    def render(self):
        return self.view("liveblade.post-create")
```

```html
<form b-submit="save"> <!-- [!code highlight] -->
    <input type="text" b-model="title">

    <textarea b-model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

In the above example, when a user submits the form by clicking "Save", `b-submit` intercepts the `submit` event and calls the `save()` action on the server.

> [!info] Liveblade automatically calls `preventDefault()`
> `b-submit` is different than other Liveblade event handlers in that it internally calls `event.preventDefault()` without the need for the `.prevent` modifier. This is because there are very few instances you would be listening for the `submit` event and NOT want to prevent it's default browser handling (performing a full form submission to an endpoint).

> [!info] Liveblade automatically disables forms while submitting
> By default, when Liveblade is sending a form submission to the server, it will disable form submit buttons and mark all form inputs as `readonly`. This way a user cannot submit the same form again until the initial submission is complete.

### Going deeper

`b-submit` is just one of many event listeners that Liveblade provides. The [Liveblade forms](forms) section provides much more complete documentation on using `b-submit` in your application:

## b-model

Liveblade makes it easy to bind a component property's value with form inputs using `b-model`.

Here is a simple example of using `b-model` to bind the `title` and `content` properties with form inputs in a `PostCreate` component:

```python
from pyblade import liveblade
from app.models import Post

class PostCreate(liveblade.Component)
    title: str = ""
    content: str = ""

    def save(self):
        Post.objects.create(title=self.title, content=self.content)
        self.redirect("/posts")

    def render(self):
        return self.view("liveblade.post-create")
```

```html{2,4}
<form b-submit="save">
    <input type="text" b-model="title">

    <textarea b-model="content"></textarea>

    <button type="submit">Save</button>
</form>
```>
```

Because both inputs use `b-model`, their values will be synchronized with the server's properties when the "Save" button is pressed.

> [!warning] "Why isn't my component live updating as I type?"
> If you tried this in your browser and are confused why the title isn't automatically updating, it's because Liveblade only updates a component when an "action" is submitted — like pressing a submit button — not when a user types into a field. This cuts down on network requests and improves performance.

### Customizing update timing

By default, Liveblade will only send a network request when an action is performed (like `b-click` or `b-submit`), NOT when a `b-model` input is updated.

This drastically improves the performance of Liveblade by reducing network requests and provides a smoother experience for your users.

However, there are occasions where you may want to update the server more frequently for things like real-time validation.

#### Live updating

To send property updates to the server as a user types into an input-field, you can append the `.live` modifier to `b-model`:

```html
<input type="text" b-model.live="title">
```

#### Customizing the debounce

By default, when using `b-model.live`, Liveblade adds a 150 millisecond debounce to server updates. This means if a user is continually typing, Liveblade will wait until the user stops typing for 150 milliseconds before sending a request.

You can customize this timing by appending `.debounce.Xms` to the input, where `X`is the number of milliseconds. Here is an example of changing the debounce to 250 milliseconds:

```html
<input type="text" b-model.live.debounce.250ms="title">
```

#### Updating on "blur" event

By appending the `.blur` modifier, Liveblade will only send network requests with property updates when a user clicks away from an input, or presses the tab key to move to the next input.

Adding `.blur` is helpful for scenarios where you want to update the server more frequently, but not as a user types. For example, real-time validation is a common instance where `.blur` is helpful.

```html
<input type="text" b-model.blur="title">
```

#### Updating on "change" event

There are times when the behavior of `.blur` isn't exactly what you want and instead `.change` is.

For example, if you want to run validation every time a select input is changed, by adding `.change`, Liveblade will send a network request and validate the property as soon as a user selects a new option. As opposed to `.blur` which will only update the server after the user tabs away from the select input.

```html
<select b-model.change="title">
    <!-- ... -->
</select>
```

Any changes made to the select input will be automatically synchronized with the `title` property in your Liveblade component.

### All available modifiers

 Modifier          | Description
-------------------|-------------------------------------------------------------------------
 `.live`           | Send updates as a user types
 `.blur`           | Only send updates on the `blur` event
 `.change`         | Only send updates on the the `change` event
 `.lazy`           | An alias for `.change`
 `.debounce.Xms` | Debounce the sending of updates by `X` milliseconds delay
 `.throttle.Xms` | Throttle network request updates by `X`milliseconds interval
 `.number`         | Cast the text value of an input to `int` on the server
 `.boolean`        | Cast the text value of an input to `bool` on the server
 `.fill`           | Use the initial value provided by a "value" HTML attribute on page-load

### Input fields

Liveblade supports most native input elements out of the box. Meaning you should just be able to attach `b-model` to any input element in the browser and easily bind properties to them.

Here's a comprehensive list of the different available input types and how you use them in a Liveblade context.

#### Text inputs

First and foremost, text inputs are the bedrock of most forms. Here's how to bind a property named "title" to one:

```html
<input type="text" b-model="title">
```

#### Textarea inputs

Textarea elements are similarly straightforward. Simply add `b-model` to a textarea and the value will be bound:

```html
<textarea type="text" b-model="content"></textarea>
```

If the "content" value is initialized with a string, Liveblade will fill the textarea with that value - there's no need to do something like the following:

```html
<!-- Warning: This snippet demonstrates what NOT to do... -->

<textarea type="text" b-model="content">{{ content }}</textarea> [!code --]
```

### Checkboxes

Checkboxes can be used for single values, such as when toggling a boolean property. Or, checkboxes may be used to toggle a single value in a group of related values. We'll discuss both scenarios:

#### Single checkbox

At the end of a signup form, you might have a checkbox allowing the user to opt-in to email updates. You might call this property `receive_updates`. You can easily bind this value to the checkbox using `b-model`:

```html
<input type="checkbox" b-model="receiveUpdates">
```

Now when the `receive_updates` value is `False`, the checkbox will be unchecked. Of course, when the value is `True`, the checkbox will be checked.

#### Multiple checkboxes

Now, let's say in addition to allowing the user to decide to receive updates, you have a list property in your class called `update_types`, allowing the user to choose from a variety of update types:

```python
update_types: list[str] = []
```

By binding multiple checkboxes to the `update_types` property, the user can select multiple update types and they will be added to the `update_types` list property:

```html
<input type="checkbox" value="email" b-model="update_types">
<input type="checkbox" value="sms" b-model="update_types">
<input type="checkbox" value="notification" b-model="update_types">
```

For example, if the user checks the first two boxes but not the third, the value of `update_types` will be: `["email", "sms"]`

### Radio buttons

To toggle between two or more different values for a single property, you may use radio buttons:

```html
<input type="radio" value="yes" b-model="receive_updates">
<input type="radio" value="no" b-model="receive_updates">
```

### Select dropdowns

Liveblade makes it simple to work with `<select>` dropdowns. When adding `b-model` to a dropdown, the currently selected value will be bound to the provided property name and vice versa.

In addition, there's no need to manually add `selected` to the option that will be selected - Liveblade handles that for you automatically.

Below is an example of a select dropdown filled with a static list of states:

```html
<select b-model="state">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

When a specific state is selected, for example, "Alaska", the `state` property on the component will be set to `AK`. If you would prefer the value to be set to "Alaska" instead of "AK", you can leave the `value=""` attribute off the `<option>` element entirely.

Often, you may build your dropdown options dynamically using PyBlade:

```html
<select b-model="state">
    @for (state in state_choices)
        <option value="{{ state.id }}">{{ state.label }}</option>
    @endfor
</select>
```

If you don't have a specific option selected by default, you may want to show a muted placeholder option by default, such as "Select a state":

```html
<select b-model="state">
    <option disabled value="">Select a state...</option>

    @for(state in state_choices)
        <option value="{{ state.id }}">{{ state.label }}</option>
    @endfor
</select>
```

As you can see, there is no "placeholder" attribute for a select menu like there is for text inputs. Instead, you have to add a `disabled` option element as the first option in the list.

### Dependent select dropdowns

Sometimes you may want one select menu to be dependent on another. For example, a list of cities that changes based on which state is selected.

For the most part, this works as you'd expect, however there is one important gotcha: You must add a `b-key` to the changing select so that Liveblade properly refreshes its value when the options change.

Here's an example of two selects, one for states, one for cities. When the state select changes, the options in the city select will change properly:

```html
<!-- States select menu... -->
<select b-model.live="selected_state">
    @for(state in country.states)
        <option value="{{ state.id }}">{{ state.label }}</option>
    @endfor
</select>

<!-- Cities dependent select menu... -->
<select b-model.live="selected_city" b-key="{{ selected_state }}"> // [!code highlight]
    @for (city in selected_state.cities)
        <option value="{{ city.id }}">{{ city.label }}</option>
    @endfor
</select>
```

Again, the only thing non-standard here is the `b-key` that has been added to the second select. This ensures that when the state changes, the "selected_city" value will be reset properly.

### Multi-select dropdowns

If you are using a "multiple" select menu, Liveblade works as expected. In this example, states will be added to the `states` list property when they are selected and removed if they are deselected:

```html
<select b-model="states" multiple>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

### Going deeper

For a more complete documentation on using `b-model` in the context of HTML forms, visit the [Liveblade forms documentation](forms) page.


## b-loading

Loading indicators are an important part of crafting good user interfaces. They give users visual feedback when a request is being made to the server, so they know they are waiting for a process to complete.

### Basic usage

Liveblade provides a simple yet extremely powerful syntax for controlling loading indicators: `b-loading`. Adding `b-loading` to any element will hide it by default (using `display: none` in CSS) and show it when a request is sent to the server.

Below is a basic example of a `PostCreate` component's form with `b-loading` being used to toggle a loading message:

```html
<form b-submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <div b-loading> <!-- [!code highlight:2] -->
        Saving post...
    </div>
</form>
```

When a user presses "Save", the "Saving post..." message will appear below the button while the "save" action is being executed. The message will disappear when the response is received from the server and processed by Liveblade.

### Removing elements

Alternatively, you can append `.remove` for the inverse effect, showing an element by default and hiding it during requests to the server:

```html
<form b-submit="save">
    <!-- ... -->

    <button type="submit">
        <span b-loading.remove>Save</span>
        <span b-loading>Saving post...</span>
    </button>
</form>
```

### Toggling classes

In addition to toggling the visibility of entire elements, it's often useful to change the styling of an existing element by toggling CSS classes on and off during requests to the server. This technique can be used for things like changing background colors, lowering opacity, triggering spinning animations, and more.

Below is a simple example of using the [Tailwind](https://tailwindcss.com/) class `opacity-50` to make the "Save" button fainter while the form is being submitted:

```html
<button b-loading.class="opacity-50">Save</button>
```

Like toggling an element, you can perform the inverse class operation by appending `.remove` to the `b-loading` directive. In the example below, the button's `bg-blue-500` class will be removed when the "Save" button is pressed:

```html
<button class="bg-blue-500" b-loading.class.remove="bg-blue-500">
    Save
</button>
```

### Toggling attributes

By default, when a form is submitted, Liveblade will automatically disable the submit button and add the `readonly` attribute to each input element while the form is being processed.

However, in addition to this default behavior, Liveblade offers the `.attr` modifier to allow you to toggle other attributes on an element or toggle attributes on elements that are outside of forms:

```html
<button
    type="button"
    b-click="remove"
    b-loading.attr="disabled"
>
    Remove
</button>
```

Because the button above isn't a submit button, it won't be disabled by Liveblade's default form handling behavior when pressed. Instead, we manually added `b-loading.attr="disabled"` to achieve this behavior.

### Targeting specific actions

By default, `b-loading` will be triggered whenever a component makes a request to the server.

However, in components with multiple elements that can trigger server requests, you should scope your loading indicators down to individual actions.

For example, consider the following "Save post" form. In addition to a "Save" button that submits the form, there might also be a "Remove" button that executes a "remove" action on the component.

By adding `b-target` to the following `b-loading` element, you can instruct Liveblade to only show the loading message when the "Remove" button is clicked:

```html
<form b-submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" b-click="remove">Remove</button>

    <div b-loading b-target="remove">  <!-- [!code highlight:2] -->
        Removing post...
    </div>
</form>
```

When the above "Remove" button is pressed, the "Removing post..." message will be displayed to the user. However, the message will not be displayed when the "Save" button is pressed.

### Targeting multiple actions

You may find yourself in a situation where you would like `b-loading` to react to some, but not all, actions on a page. In these cases you can pass multiple actions into `b-target` separated by a comma. For example:

```html
<form b-submit="save">
    <input type="text" b-model.blur="title">

    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" b-click="remove">Remove</button>

    <div b-loading b-target="save, remove">  <!-- [!code highlight:2] -->
        Updating post...
    </div>
</form>
```

The loading indicator ("Updating post...") will now only be shown when the "Remove" or "Save" button are pressed, and not when the `title` field is being sent to the server.

### Targeting action parameters

In situations where the same action is triggered with different parameters from multiple places on a page, you can further scope `b-target` to a specific action by passing in additional parameters. For example, consider the following scenario where a "Remove" button exists for each post on the page:

```html
<div>
    @for(post in posts)
        <div b-key="{{ post.id }}">
            <h2>{{ post.title }}</h2>

            <button b-click="remove({{ post.id }})">Remove</button>

            <div b-loading b-target="remove({{ post.id }})">  <!-- [! highlight:2] -->
                Removing post...
            </div>
        </div>
    @endfor
</div>
```

Without passing <span v-pre>`{{ post.id }}`</span> to `b-target="remove"`, the "Removing post..." message would show when any of the buttons on the page are clicked.

However, because we are passing in unique parameters to each instance of `b-target`, Liveblade will only show the loading message when the matching parameters are passed to the "remove" action.

> [!warning] Multiple action parameters aren't supported
> At this time, Liveblade only supports targeting a loading indicator by a single method/parameter pair. For example `b-target="remove(1)"` is supported, however `b-target="remove(1), add(1)"` is not.

### Targeting property updates

Liveblade also allows you to target specific component property updates by passing the property's name to the `b-target` directive.

Consider the following example where a form input named `username` uses `b-model.live` for real-time validation as a user types:

```html
<form b-submit="save">
    <input type="text" b-model.live="username">
    @error('username') <span>{{ message }}</span> @enderror

    <div b-loading b-target="username"> <!-- [!code highlight:2] -->
        Checking availability of username...
    </div>

    <!-- ... -->
</form>
```

The "Checking availability..." message will show when the server is updated with the new username as the user types into the input field.

### Excluding specific loading targets

Sometimes you may wish to display a loading indicator for every Liveblade request _except_ a specific property or action. In these cases you can use the `b-target.except` modifier like so:

```html
<div b-loading b-target.except="download">...</div>
```

The above loading indicator will now be shown for every Liveblade update request on the component _except_ the "download" action.

### Customizing CSS display property

When `b-loading` is added to an element, Liveblade updates the CSS `display` property of the element to show and hide the element. By default, Liveblade uses `none` to hide and `inline-block` to show.

If you are toggling an element that uses a display value other than `inline-block`, like `flex` in the following example, you can append `.flex` to `b-loading`:

```html
<div class="flex" b-loading.flex>...</div>
```

Below is the complete list of available display values:

```html
<div b-loading.inline-flex>...</div>
<div b-loading.inline>...</div>
<div b-loading.block>...</div>
<div b-loading.table>...</div>
<div b-loading.flex>...</div>
<div b-loading.grid>...</div>
```

### Delaying a loading indicator

On fast connections, updates often happen so quickly that loading indicators only flash briefly on the screen before being removed. In these cases, the indicator is more of a distraction than a helpful affordance.

For this reason, Liveblade provides a `.delay` modifier to delay the showing of an indicator. For example, if you add `b-loading.delay` to an element like so:

```html
<div b-loading.delay>...</div>
```

The above element will only appear if the request takes over 200 milliseconds. The user will never see the indicator if the request completes before then.

To customize the amount of time to delay the loading indicator, you can use one of Liveblade's helpful interval aliases:

```html
<div b-loading.delay.shortest>...</div> <!-- 50ms -->
<div b-loading.delay.shorter>...</div>  <!-- 100ms -->
<div b-loading.delay.short>...</div>    <!-- 150ms -->
<div b-loading.delay>...</div>          <!-- 200ms -->
<div b-loading.delay.long>...</div>     <!-- 300ms -->
<div b-loading.delay.longer>...</div>   <!-- 500ms -->
<div b-loading.delay.longest>...</div>  <!-- 1000ms -->
```

## b-navigate

Liveblade's `b-navigate` feature makes page navigation much faster, providing an SPA-like experience for your users.

This page is a simple reference for the `b-navigate` directive. Be sure to read the page on Liveblade's [Navigate](#) feature for more complete documentation.

Below is a simple example of adding `b-navigate` to links in a nav bar:

```html
<nav>
    <a href="/" b-navigate>Dashboard</a>
    <a href="/posts" b-navigate>Posts</a>
    <a href="/users" b-navigate>Users</a>
</nav>
```

When any of these links are clicked, Liveblade will intercept the click and, instead of allowing the browser to perform a full page visit, Liveblade will fetch the page in the background and swap it with the current page (resulting in much faster and smoother page navigation).

### Prefetching pages on hover

By adding the `.hover` modifier, Liveblade will pre-fetch a page when a user hovers over a link. This way, the page will have already been downloaded from the server when the user clicks on the link.

```html
<a href="/" b-navigate.hover>Dashboard</a>
```

### Going deeper

For more complete documentation on this feature, visit [Liveblade's navigate](#) documentation page.

## b-current

The `b-current` directive allows you to easily detect and style currently active links on a page.

Here's a simple example of adding `b-current` to links in a navbar so that the currently active link has a stronger font weight:

```html
<nav>
    <a href="/dashboard" ... b-current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... b-current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... b-current="font-bold text-zinc-800">Users</a>
</nav>
```

Now when a user visits `/posts`, the "Posts" link will have a stronger font treatment than the other links.

You should note that `b-current` works out of the box with `b-navigate` links and page changes.


### Troubleshooting

If `b-current` is not detecting the current link correctly, ensure the following:

* You have at least one Liveblade component on the page, or have hardcoded `@liveblade_scripts` in your layout
* You have a `href` attribute on the link.

## b-cloak

`b-cloak` is a directive that hides elements on page load until Liveblade is fully initialized. This is useful for preventing the "flash of unstyled content" that can occur when the page loads before Liveblade has a chance to initialize.

### Basic usage

To use `b-cloak`, add the directive to any element you want to hide during page load:

```html
<div b-cloak>
    This content will be hidden until Liveblade is fully loaded
</div>
```

### Dynamic content

`b-cloak` is particularly useful in scenarios where you want to prevent users from seeing uninitialized dynamic content such as element shown or hidden using `b-show`.

```html
<div>
    <div b-show="starred" b-cloak>
        <!-- Yellow star icon... -->
    </div>

    <div b-show="!starred" b-cloak>
        <!-- Gray star icon... -->
    </div>
</div>
```

In the above example, without `b-cloak`, both icons would be shown before Liveblade initializes. However, with `b-cloak`, both elements will be hidden until initialization.

## b-dirty

In a traditional HTML page containing a form, the form is only ever submitted when the user presses the "Submit" button.

However, Liveblade is capable of much more than traditional form submissions. You can validate form inputs in real-time or even save the form as a user types.

In these "real-time" update scenarios, it can be helpful to signal to your users when a form or subset of a form has been changed, but hasn't been saved to the database.

When a form contains un-saved input, that form is considered "dirty". It only becomes "clean" when a network request has been triggered to synchronize the server state with the client-side state.

### Basic usage

Liveblade allows you to easily toggle visual elements on the page using the `b-dirty` directive.

By adding `b-dirty` to an element, you are instructing Liveblade to only show the element when the client-side state diverges from the server-side state.

To demonstrate, here is an example of an `UpdatePost` form containing a visual "Unsaved changes..." indication that signals to the user that the form contains input that has not been saved:

```html
<form b-submit="update">
    <input type="text" b-model="title">

    <!-- ... -->

    <button type="submit">Update</button>

    <div b-dirty>Unsaved changes...</div> <!-- [!code highlight] -->
</form>
```

Because `b-dirty` has been added to the "Unsaved changes..." message, the message will be hidden by default. Liveblade will automatically display the message when the user starts modifying the form inputs.

When the user submits the form, the message will disappear again, since the server / client data is back in sync.

### Removing elements

By adding the `.remove` modifier to `b-dirty`, you can instead show an element by default and only hide it when the component has "dirty" state:

```html
<div b-dirty.remove>The data is in-sync...</div>
```

### Targeting property updates

Imagine you are using `b-model.blur` to update a property on the server immediately after a user leaves an input field. In this scenario, you can provide a "dirty" indication for only that property by adding `b-target` to the element that contains the `b-dirty` directive.

Here is an example of only showing a dirty indication when the title property has been changed:

```html
<form b-submit="update">
    <input b-model.blur="title">

    <div b-dirty b-target="title">Unsaved title...</div> <!-- [!code highlight] -->

    <button type="submit">Update</button>
</form>
```

### Toggling classes

Often, instead of toggling entire elements, you may want to toggle individual CSS classes on an input when its state is "dirty".

Below is an example where a user types into an input field and the border becomes yellow, indicating an "unsaved" state. Then, when the user tabs away from the field, the border is removed, indicating that the state has been saved on the server:

```html
<input b-model.blur="title" b-dirty.class="border-yellow-500">
```


## b-confirm

Before performing dangerous actions in Liveblade, you may want to provide your users with some sort of visual confirmation.

Liveblade makes this easy to do by adding `b-confirm` in addition to any action (`b-click`, `b-submit`, etc.).

Here's an example of adding a confirmation dialog to a "Delete post" button:

```html
<button
    type="button"
    b-click="delete"
    b-confirm="Are you sure you want to delete this post?"
>
    Delete post <!-- [!code highlight:-2,1] -->
</button>
```

When a user clicks "Delete post", Liveblade will trigger a confirmation dialog (The default browser confirmation alert). If the user hits escape or presses cancel, the action won't be performed. If they press "OK", the action will be completed.

### Prompting users for input

For even more dangerous actions such as deleting a user's account entirely, you may want to present them with a confirmation prompt which they would need to type in a specific string of characters to confirm the action.

Liveblade provides a helpful `.prompt` modifier, that when applied to `b-confirm`, it will prompt the user for input and only confirm the action if the input matches (case-sensitive) the provided string (designated by a "|" (pipe) character at the end if the `b-confirm` value):

```html
<button
    type="button"
    b-click="delete"
    b-confirm.prompt="Are you sure?\n\nType DELETE to confirm|DELETE"
>
    Delete account <!-- [!code highlight:-2,1] -->
</button>
```

When a user presses "Delete account", the action will only be performed if "DELETE" is entered into the prompt, otherwise, the action will be cancelled.


## b-transition

### Basic usage

Showing or hiding content in Liveblade is as simple as using one of Blade's conditional directives like `@if`. To enhance this experience for your users, Liveblade provides a `b-transition` directive that allows you to transition conditional elements smoothly in and out of the page.

For example, below is a `ShowPost` component with the ability to toggle viewing comments on and off:

```php
use App\Models\Post;

class ShowPost extends Component
{
    public Post post;

    public showComments = false;
}
```

```html
<div>
    <!-- ... -->

    <button b-click="set('showComments', true)">Show comments</button>

    @if (showComments)
        <div b-transition> <!-- [!code highlight] -->
            @foreach (post.comments as comment)
                <!-- ... -->
            @endforeach
        </div>
    @endif
</div>
```
Because `b-transition` has been added to the `<div>` containing the post's comments, when the "Show comments" button is pressed, `showComments` will be set to `true` and the comments will "fade" onto the page instead of abruptly appearing.

### Limitations

Currently, `b-transition` is only supported on a single element inside a Blade conditional like `@if`. It will not work as expected when used in a list of sibling elements. For example, the following will NOT work properly:

```html
<!-- Warning: The following is code that will not work properly -->
<ul>
    @for (commnet in comments)
        <li b-transition b-key="{{ comment.id }}">{{ comment.content }}</li>
    @endfor
</ul>
```

If one of the above comment `<li>` elements were to get removed, you would expect Liveblade to transition it out. However, because of hurdles with Liveblade's underlying "morph" mechanism, this will not be the case. There is currently no way to transition dynamic lists in Liveblade using `b-transition`.

### Default transition style

By default, Liveblade applies both an opacity and a scale CSS transition to elements with `b-transition`. Here's a visual preview:

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Preview transition <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            &nbsp;
        </div>
    </div>
</div>
```

The above transition uses the following values for transitioning by default:

Transition in | Transition out
--- | ---
`duration: 150ms` | `duration: 75ms`
`opacity: [0 - 100]` | `opacity: [100 - 0]`
`transform: scale([0.95 - 1])` | `transform: scale([1 - 0.95])`

### Customizing transitions

To customize the CSS Liveblade internally uses when transitioning, you can use any combination of the available modifiers:

Modifier | Description
--- | ---
`.in` | Only transition the element "in"
`.out` | Only transition the element "out"
`.duration.[?]ms` | Customize the transition duration in milliseconds
`.duration.[?]s` | Customize the transition duration in seconds
`.delay.[?]ms` | Customize the transition delay in milliseconds
`.delay.[?]s` | Customize the transition delay in seconds
`.opacity` | Only apply the opacity transition
`.scale` | Only apply the scale transition
`.origin.[top\|bottom\|left\|right]` | Customize the scale "origin" used

Below is a list of various transition combinations that may help to better visualize these customizations:

**Fade-only transition**

By default, Liveblade both fades and scales the element when transitioning. You can disable scaling and only fade by adding the `.opacity` modifier. This is useful for things like transitioning a full-page overlay, where adding a scale doesn't make sense.

```html
<div b-transition.opacity>
```

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Preview transition <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.opacity
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

**Fade-out transition**

A common transition technique is to show an element immediately when transitioning in, and fade its opacity when transitioning out. You'll notice this effect on most native MacOS dropdowns and menus. Therefore it's commonly applied on the web to dropdowns, popovers, and menus.

```html
<div b-transition.out.opacity.duration.200ms>
```
```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Preview transition <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.out.opacity.duration.200ms
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

**Origin-top transition**

When using Liveblade to transition an element such as a dropdown menu, it makes sense to scale in from the top of the menu as the origin, rather than center (Liveblade's default). This way the menu feels visually anchored to the element that triggered it.

```html
<div b-transition.scale.origin.top>
```

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Preview transition <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.origin.top
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

> [!tip] Liveblade uses Alpine transitions behind the scenes
> When using `b-transition` on an element, Liveblade is internally applying Alpine's `x-transition` directive. Therefore you can use most if not all syntaxes you would normally use with `x-transition`. Check out [Alpine's transition documentation](https://alpinejs.dev/directives/transition) for all its capabilities.


## b-init

Liveblade offers a `b-init` directive to run an action as soon as the component is rendered. This can be helpful in cases where you don't want to hold up the entire page load, but want to load some data immediately after the page load.

```html
<div b-init="loadPosts">
    <!-- ... -->
</div>
```

The `loadPosts` action will be run immediately after the Liveblade component renders on the page.

In most cases however, [Liveblade's lazy loading feature](/docs/lazy) is preferable to using `b-init`.


## b-poll
Polling is a technique used in web applications to "poll" the server (send requests on a regular interval) for updates. It's a simple way to keep a page up-to-date without the need for a more sophisticated technology like [WebSockets](/docs/events#real-time-events-using-laravel-echo).

### Basic usage

Using polling inside Liveblade is as simple as adding `b-poll` to an element.

Below is an example of a `SubscriberCount` component that shows a user's subscriber count:

```php
<?php

namespace App\Liveblade;

use Illuminate\Support\Facades\Auth;
use Liveblade\Component;

class SubscriberCount extends Component
{
    public function render()
    {
        return view('Liveblade.subscriber-count', [
            'count' => Auth::user().subscribers.count(),
        ]);
    }
}
```

```html
<div b-poll> <!-- [!code highlight] -->
    Subscribers: {{ count }}
</div>
```

Normally, this component would show the subscriber count for the user and never update until the page was refreshed. However, because of `b-poll` on the component's template, this component will now refresh itself every `2.5` seconds, keeping the subscriber count up-to-date.

You can also specify an action to fire on the polling interval by passing a value to `b-poll`:

```html
<div b-poll="refreshSubscribers">
    Subscribers: {{ count }}
</div>
```

Now, the `refreshSubscribers()` method on the component will be called every `2.5` seconds.

### Timing control

The primary drawback of polling is that it can be resource intensive. If you have a thousand visitors on a page that uses polling, one thousand network requests will be triggered every `2.5` seconds.

The best way to reduce requests in this scenario is simply to make the polling interval longer.

You can manually control how often the component will poll by appending the desired duration to `b-poll` like so:

```html
<div b-poll.15s> <!-- In seconds... -->

<div b-poll.15000ms> <!-- In milliseconds... -->
```

### Background throttling

To further cut down on server requests, Liveblade automatically throttles polling when a page is in the background. For example, if a user keeps a page open in a different browser tab, Liveblade will reduce the number of polling requests by 95% until the user revisits the tab.

If you want to opt-out of this behavior and keep polling continuously, even when a tab is in the background, you can add the `.keep-alive` modifier to `b-poll`:

```html
<div b-poll.keep-alive>
```

###  Viewport throttling

Another measure you can take to only poll when necessary, is to add the `.visible` modifier to `b-poll`. The `.visible` modifier instructs Liveblade to only poll the component when it is visible on the page:

```html
<div b-poll.visible>
```

If a component using `b-visible` is at the bottom of a long page, it won't start polling until the user scrolls it into the viewport. When the user scrolls away, it will stop polling again.

## b-offline

In certain circumstances it can be helpful for your users to know if they are currently connected to the internet.

If for example, you have built a blogging platform on Liveblade, you may want to notify your users in some way if they are offline so that they don't draft an entire blog post without the ability for Liveblade to save it to the database.

Liveblade make this trivial by providing the `b-offline` directive. By attaching `b-offline` to an element in your Liveblade component, it will be hidden by default and only be displayed when Liveblade detects the network connection has been interrupted and is unavailable. It will then disappear again when the network has regained connection.

For example:

```html
<p class="alert alert-warning" b-offline>
    Whoops, your device has lost connection. The web page you are viewing is offline.
</p>
```


## b-ignore

Liveblade's ability to make updates to the page is what makes it "live", however, there are times when you might want to prevent Liveblade from updating a portion of the page.

In these cases, you can use the `b-ignore` directive to instruct Liveblade to ignore the contents of a particular element, even if they change between requests.

This is most useful in the context of working with third-party javascript libraries for custom form inputs and such.

Below is an example of wrapping an element used by a third-party library in `b-ignore` so that Liveblade doesn't tamper with the HTML generated by the library:

```html
<form>
    <!-- ... -->

    <div b-ignore>
        <!-- This element would be reference by a -->
        <!-- third-party library for initialization... -->
        <input id="id-for-date-picker-library">
    </div>

    <!-- ... -->
</form>
```

You can also instruct Liveblade to only ignore changes to attributes of the root element rather than observing changes to its contents using `b-ignore.self`.

```html
<div b-ignore.self>
    <!-- ... -->
</div>
```


## b-replace

Liveblade's DOM diffing is useful for updating existing elements on your page, but occasionally you may need to force some elements to render from scratch to reset internal state.

In these cases, you can use the `b-replace` directive to instruct Liveblade to skip DOM diffing on the children of an element, and instead completely replace the content with the new elements from the server.

This is most useful in the context of working with third-party javascript libraries and custom web components, or when element re-use could cause problems when keeping state.

Below is an example of wrapping a web component with a shadow DOM `b-replace` so that Liveblade completely replaces the element allowing the custom element to handle its own life-cycle:

```html
<form>
    <!-- ... -->

    <div b-replace>
        <!-- This custom element would have its own internal state -->
        <json-viewer>@json(someProperty)</json-viewer>
    </div>

    <!-- ... -->
</form>
```

You can also instruct Liveblade to replace the target element as well as all children with `b-replace.self`.

```html
<div x-data="{open: false}" b-replace.self>
  <!-- Ensure that the "open" state is reset to false on each render -->
</div>
```


## b-show

Liveblade's `b-show` directive makes it easy to show and hide elements based on the result of an expression.

The `b-show` directive is different than using `@if` in Blade in that it toggles an element's visibility using CSS (`display: none`) rather than removing the element from the DOM entirely. This means the element remains in the page but is hidden, allowing for smoother transitions without requiring a server round-trip.

### Basic usage

Here's a practical example of using `b-show` to toggle a "Create Post" modal:

```php
use Liveblade\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public showModal = false;

    public content = '';

    public function save()
    {
        Post::create(['content' => this.content]);

        this.reset('content');

        this.showModal = false;
    }
}
```

```html
<div>
    <button x-on:click="py.showModal = true">New Post</button>

    <div b-show="showModal">
        <form b-submit="save">
            <textarea b-model="content"></textarea>

            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

When the "Create New Post" button is clicked, the modal appears without a server roundtrip. After successfully saving the post, the modal is hidden and the form is reset.

### Using transitions

You can combine `b-show` with Alpine.js transitions to create smooth show/hide animations. Since `b-show` only toggles the CSS `display` property, Alpine's `x-transition` directives work perfectly with it:

```html
<div>
    <button x-on:click="py.showModal = true">New Post</button>

    <div b-show="showModal" x-transition.duration.500ms>
        <form b-submit="save">
            <textarea b-model="content"></textarea>
            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

The Alpine.js transition classes above will create a fade and scale effect when the modal shows and hides.

[View the full x-transition documentation →](#)


## b-stream

Liveblade allows you to stream content to a web page before a request is complete via the `b-stream` API. This is an extremely useful feature for things like AI chat-bots which stream responses as they are generated.

> [!warning] Not compatible with Laravel Octane
> Liveblade currently does not support using `b-stream` with Laravel Octane.

To demonstrate the most basic functionality of `b-stream`, below is a simple CountDown component that when a button is pressed displays a count-down to the user from "3" to "0":

```php
use Liveblade\Component;

class CountDown extends Component
{
    public start = 3;

    public function begin()
    {
        while (this.start >= 0) {
            // Stream the current count to the browser...
            this.stream(  // [!code highlight:4]
                to: 'count',
                content: this.start,
                replace: true,
            );

            // Pause for 1 second between numbers...
            sleep(1);

            // Decrement the counter...
            this.start = this.start - 1;
        };
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <button b-click="begin">Start count-down</button>

            <h1>Count: <span b-stream="count">{{ start }}</span></h1> <!-- [!code highlight] -->
        </div>
        HTML;
    }
}
```

Here's what's happening from the user's perspective when they press "Start count-down":
* "Count: 3" is shown on the page
* They press the "Start count-down" button
* One second elapses and "Count: 2" is shown
* This process continues until "Count: 0" is shown

All of the above happens while a single network request is out to the server.

Here's what's happening from the system's perspective when the button is pressed:
* A request is sent to Liveblade to call the `begin()` method
* The `begin()` method is called and the `while` loop begins
* `this.stream()` is called and immediately starts a "streamed response" to the browser
* The browser receives a streamed response with instructions to find the element in the component with `b-stream="count"`, and replace its contents with the received payload ("3" in the case of the first streamed number)
* The `sleep(1)` method causes the server to hang for one second
* The `while` loop is repeated and the process of streaming a new number every second continues until the `while` condition is falsy
* When `begin()` has finished running and all the counts have been streamed to the browser, Liveblade finishes it's request lifecycle, rendering the component and sending the final response to the browser

### Streaming chat-bot responses

A common use-case for `b-stream` is streaming chat-bot responses as they are received from an API that supports streamed responses (like [OpenAI's ChatGPT](https://chat.openai.com/)).

Below is an example of using `b-stream` to accomplish a ChatGPT-like interface:

```php
use Liveblade\Component;

class ChatBot extends Component
{
    public prompt = '';

    public question = '';

    public answer = '';

    function submitPrompt()
    {
        this.question = this.prompt;

        this.prompt = '';

        this.js('py.ask()');
    }

    function ask()
    {
        this.answer = OpenAI::ask(this.question, function (partial) {
            this.stream(to: 'answer', content: partial); // [!code highlight]
        });
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                @if (question)
                    <article>
                        <hgroup>
                            <h3>User</h3>
                            <p>{{ question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p b-stream="answer">{{ answer }}</p> <!-- [!code highlight] -->
                        </hgroup>
                    </article>
                @endif
            </section>

            <form b-submit="submitPrompt">
                <input b-model="prompt" type="text" placeholder="Send a message" autofocus>
            </form>
        </div>
        HTML;
    }
}
```

Here's what's going on in the above example:
* A user types into a text field labeled "Send a message" to ask the chat-bot a question.
* They press the [Enter] key.
* A network request is sent to the server, sets the message to the `question` property, and clears the `prompt` property.
* The response is sent back to the browser and the input is cleared. Because `this.js('...')` was called, a new request is triggered to the server calling the `ask()` method.
* The `ask()` method calls on the ChatBot API and receives streamed response partials via the `partial` parameter in the callback.
* Each `partial` gets streamed to the browser into the `b-stream="answer"` element on the page, showing the answer progressively reveal itself to the user.
* When the entire response is received, the Liveblade request finishes and the user receives the full response.

### Replace vs. append

When streaming content to an element using `this.stream()`, you can tell Liveblade to either replace the contents of the target element with the streamed contents or append them to the existing contents.

Replacing or appending can both be desirable depending on the scenario. For example, when streaming a response from a chatbot, typically appending is desired (and is therefore the default). However, when showing something like a count-down, replacing is more fitting.

You can configure either by passing the `replace:` parameter to `this.stream` with a boolean value:

```php
// Append contents...
this.stream(to: 'target', content: '...');

// Replace contents...
this.stream(to: 'target', content: '...', replace: true);
```

Append/replace can also be specified at the target element level by appending or removing the `.replace` modifier:

```html
// Append contents...
<div b-stream="target">

// Replace contents...
<div b-stream.replace="target">
```


## b-text

`b-text` is a directive that dynamically updates an element's text content based on a component property or expression. Unlike using Blade's <span v-pre>`{{ }}`</span> syntax, `b-text` updates the content without requiring a network roundtrip to re-render the component.

If you are familiar with Alpine's `x-text` directive, the two are essentially the same.

### Basic usage

Here's an example of using `b-text` to optimistically show updates to a Liveblade property without waiting for a network roundtrip.

```php
use Liveblade\Component;
use App\Models\Post; 

class ShowPost extends Component
{
    public Post post;

    public likes;

    public function mount()
    {
        this.likes = this.post.like_count;
    }

    public function like()
    {
        this.post.like();

        this.likes = this.post.fresh().like_count;
    }
}
```

```html
<div>
    <button x-on:click="py.likes++" b-click="like">❤️ Like</button>

    Likes: <span b-text="likes"></span>
</div>
```

When the button is clicked, `py.likes++` immediately updates the displayed count through `b-text`, while `b-click="like"` persists the change to the database in the background.

This pattern makes `b-text` perfect for building optimistic UIs in Liveblade.