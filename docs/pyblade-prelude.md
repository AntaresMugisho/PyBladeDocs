---
editLink: false
---

# PyBlade: Template Engine

::: danger ⚠️ Warning: Experimental Feature
PyBlade is currently in an experimental phase. Although its core features are under active development and continuous testing, you should expect potential bugs, breaking changes, or incomplete functionality.

At this stage, PyBlade is best suited for testing, prototyping, and non-critical environments. If you choose to use it in production, do so with caution and ensure appropriate safeguards are in place.

Your feedback, bug reports, and real-world usage insights are essential to refining the framework and moving toward a stable release. We appreciate your contribution to the evolution of PyBlade.
:::

## PyBlade as a template engine

PyBlade is a lightweight yet powerful template engine tailored for Python web applications.

Unlike some templating engines, PyBlade keeps things simple while staying flexible, allowing you to use familiar Python syntax and expressions directly in your templates.

Each PyBlade template is compiled into HTML code and cached to ensure optimal performance, meaning PyBlade adds virtually no overhead to your application.

PyBlade templates use the `.html` file extension and are typically stored within the `templates` directory of your app.

In Django or Flask applications, PyBlade views will be rendered normally.

Just pass the data you need as context, and PyBlade takes care of the rest, providing a seamless, Pythonic approach to building dynamic and secure web templates.