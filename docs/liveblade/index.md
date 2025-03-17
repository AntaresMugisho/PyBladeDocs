# LiveBlade Documentation

LiveBlade is an extension of the PyBlade template engine, bringing real-time interactivity to Python web applications. Inspired by Laravel Livewire, LiveBlade allows developers to create dynamic components using Python classes, eliminating the need for complex frontend JavaScript frameworks.

## Installation

To install LiveBlade, ensure you have PyBlade installed:

```bash
pip install pyblade
```

Then, install LiveBlade:

```bash
pip install liveblade
```

## Configuration

In your Django or Flask project, configure LiveBlade by updating the settings:

### Django Configuration

```python
# settings.py
TEMPLATES = [
    {
        'BACKEND': 'pyblade.backends.LiveBladeBackend',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
            ],
        },
    },
]
```

### Flask Configuration

```python
from flask import Flask
from pyblade import LiveBlade

app = Flask(__name__)
LiveBlade.init_app(app)
```

## Creating Components

LiveBlade components are Python classes that manage state and actions. Each component extends `LiveBladeComponent`.

### Example Component

```python
from liveblade import LiveBladeComponent

class Counter(LiveBladeComponent):
    count: int = 0

    def increment(self):
        self.count += 1
```

### Component View (Blade Template)

Save the component's view as `counter.blade.py`:

```blade
<div>
    <h1>Count: {{ count }}</h1>
    <button wire:click="increment">Increment</button>
</div>
```

## Rendering Components

To include a component in a PyBlade template:

```blade
@liveblade('counter')
```

## Live Events

LiveBlade provides event handling to manage interactions.

### Listening for Events

```python
class MessageHandler(LiveBladeComponent):
    message: str = ""

    def update_message(self, new_message):
        self.message = new_message
```

### Emitting Events

```blade
<button wire:click="$emit('update_message', 'Hello LiveBlade!')">Send Message</button>
```

## Lifecycle Hooks

LiveBlade provides lifecycle hooks similar to Livewire:

- `mount(self)`: Called when the component is initialized.
- `updated(self, property)`: Triggered when a property is updated.
- `render(self)`: Used for custom rendering logic.

## Validation

You can add validation to component properties using Python’s validation mechanisms:

```python
from liveblade import LiveBladeComponent
from pydantic import BaseModel, Field

class FormData(BaseModel):
    name: str = Field(..., min_length=3)

class UserForm(LiveBladeComponent):
    data: FormData

    def save(self):
        self.validate()
        # Save logic here
```

## File Uploads

LiveBlade supports file uploads:

### Component Handling Uploads

```python
class UploadFile(LiveBladeComponent):
    file: any

    def save_file(self):
        with open(f'uploads/{self.file.filename}', 'wb') as f:
            f.write(self.file.read())
```

### Blade Template

```blade
<input type="file" wire:model="file">
<button wire:click="save_file">Upload</button>
```

## Redirecting

To redirect within a component:

```python
from liveblade import redirect

def go_home(self):
    return redirect('/')
```

## Conclusion

LiveBlade simplifies building interactive, real-time web applications using Python and PyBlade. It provides a Livewire-like experience for Python developers, leveraging Python classes instead of JavaScript frameworks.

For more details, visit the official LiveBlade documentation.

