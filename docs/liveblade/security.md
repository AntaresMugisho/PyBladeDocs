<!-- 
# From Properties
# From Actions 

-->

# Security Concerns & Best Practices in Liveblade

Liveblade components offer a dynamic and reactive interface between your Python backend and frontend UI. However, because components expose properties that can be updated directly from the client side, it’s critical to follow secure development practices. Below are key guidelines to keep your Liveblade apps safe and predictable.


## 1. **Use Underscore Prefix for Private/Internal State**

Properties or methods that are not meant to be exposed or mutated by the frontend **must** be prefixed with an underscore (`_`). Liveblade treats these as **private**, meaning:

- They **cannot** be bound or mutated from the frontend.
- They **cannot** be accessed via template bindings (e.g., `{{ _private_data }}` won’t work).

```python
class ShowPost(Component):
    _post = None  # Private, backend-only
    title = ""    # Public, exposed to the frontend
```

> ✅ **Best Practice**: Keep all internal state, computed caches, or sensitive backend-only data in `_private` properties.

## 2. **Always Validate Incoming Data**

Any public property can be updated from the client (e.g., via `wire:model`). Without validation, this opens the door to invalid, unexpected, or even malicious data being injected into your component state.

Use PyBlade’s built-in `@validate` system or manually validate in lifecycle hooks like `updating()` or `mount()`:

```python
from pyblade import validate

class CreateUser(Component):
    username = ""
    email = ""

    @validate
    def rules(self):
        return {
            "username": ["required", "min:3", "max:20"],
            "email": ["required", "email"],
        }
```

Or manually:

```python
def updating(self, prop, value):
    if prop == "email" and "@" not in value:
        raise ValueError("Invalid email.")
```

> 🚫 **Never trust incoming values** without sanitizing or validating them first.

## 3. **Use `locked` for Read-Only Public Props**

Sometimes you want a value to be visible in the template, but **not editable** by the frontend. For these cases, Liveblade supports a `@locked` or `Locked` attribute:

```python
from pyblade import locked

class ShowPost(Component):
    @locked
    post_id = 1
```

Locked props **can be seen in the UI**, but cannot be changed by the frontend — they’re “read-only” for client interactions.

---

## 4. **Avoid Binding Sensitive Data to the UI**

Be careful about what data you expose in templates, even as read-only. Anything rendered in HTML is **visible to the user** and can be inspected via the browser dev tools.

> ✅ Keep passwords, API keys, tokens, or internal-only logic on the server side and behind `_private` variables.

---

## 5. **Gracefully Handle Exceptions**

Use the `exception()` lifecycle hook to catch and handle unexpected errors safely:

```python
def exception(self, error, stop_propagation):
    if isinstance(error, PermissionError):
        self.notify("You're not allowed to do that.")
        stop_propagation()
```

This prevents full-stack crashes and gives users meaningful feedback.

---

## 6. **Limit What’s Reactive**

Only expose what **needs** to be reactive. Each public property adds potential client-to-server data flow. Over-exposing data can lead to tight coupling and security risks.

- If something doesn’t need to be edited or watched, keep it private (`_`)
- If it’s a computed value, prefer `@computed_property`

---

## 7. **Avoid Executing Dangerous Logic Based on Client Props**

Don’t trigger sensitive backend operations (e.g., database deletes, role changes) purely based on client-side props unless they’re **validated and authorized**.

Use `actions` (like `def delete_user(self):`) to keep business logic separate from simple state updates.

---

## 8. **Protect Route-Specific Data**

When passing values into `mount()` from the route or parent, always double-check the values — e.g., check permissions, existence of models, and ownership.

```python
def mount(self, post_id):
    post = Post.get_by_id(post_id)
    if post.user_id != self.request.user.id:
        raise PermissionError("Unauthorized access.")
    self._post = post
```

---

## 9. **Avoid State Leakage Between Requests**

Remember that Liveblade components persist state between requests, but **not all values are automatically secure**. Make sure to:

- Reset sensitive state during `boot()` if needed
- Use `_private` for temporary/unsafe values

## 10. **Audit Your Public Interface**

When shipping components, take time to **review what is public**:

- Are there props that should be private?
- Are actions gated properly?
- Are validations thorough?
- Could a user craft a custom payload to abuse your component?

You can even build tools to **auto-scan component properties** and flag potential risks in CI.

## ✅ Summary

| Best Practice                             | Why It Matters                                      |
|-------------------------------------------|-----------------------------------------------------|
| Prefix private props/methods with `_`     | Prevents frontend access and mutation              |
| Validate public input                     | Ensures safety and correctness                     |
| Use `locked` for read-only props          | Stops unintended client-side changes               |
| Don’t expose sensitive data in templates  | Avoid leaking tokens/passwords                     |
| Gracefully catch errors in `exception()`  | Improves resilience and UX                         |
| Keep logic out of templates               | Separates concerns and avoids coupling             |

---

Following these practices helps make your Liveblade apps clean, secure, and ready for real-world production use. Let me know if you'd like a checklist version or security-linting ideas!