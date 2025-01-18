
# What is PyBlade ?

::: danger ⚠️ Warning: Experimental Feature
PyBlade is currently in experimental mode. While we are actively developing and testing its features, please be aware that it may contain bugs or incomplete functionality. We recommend using PyBlade exclusively in test environments or with caution in production environments.

Your feedback is invaluable as we work toward a stable release. Thank you for helping us improve PyBlade!
:::

**PyBlade** is a lightweight, secure template engine for Python, designed to be both powerful and easy to use. Drawing
inspiration from Laravel's Blade, PyBlade allows developers to build expressive, secure templates using an intuitive `@`-based syntax. While many template engines focus on backend logic, PyBlade extends into component-driven development through LiveBlade, helping you create complex, reusable UI components that reduce reliance on backend rendering and enhance performance.

Developed with flexibility in mind, PyBlade is designed to integrate with various Python web frameworks, though it currently supports Django and Flask. Its flexible `.html` file extension makes it easy to identify and work with PyBlade templates across your project. Whether you're a developer familiar with Blade or simply looking for a streamlined template engine, PyBlade offers a refreshing and secure approach to building dynamic applications.



## Why PyBlade?

In today’s fast-paced development environment, efficiency and security are essential. PyBlade addresses these needs by:

### Simplicity and Speed

PyBlade’s `@`-based directives are concise and intuitive, reducing the amount of boilerplate code you need to write. This streamlined approach enables developers to quickly build and iterate on templates, significantly improving development time and efficiency.

### Component-Driven design with LiveBlade

With LiveBlade, PyBlade introduces a frontend-like component architecture. Inspired by modern frontend frameworks, LiveBlade enables you to create reusable components that handle both UI and logic. This approach reduces the load on server-side rendering, allowing components to manage dynamic interactions directly on the client side, enhancing the user experience and reducing server load.

### Framework-Agnostic design

While PyBlade currently supports Django and Flask, its adaptable architecture is intended to work with multiple Python web frameworks. This framework-agnostic design ensures that you can easily integrate PyBlade into various projects, giving you the freedom to use it across different Python web applications as needed.

### Security by default

PyBlade takes security seriously. By default, all variables rendered in templates are securely escaped to protect against common vulnerabilities like Cross-Site Scripting (XSS) attacks. For specific cases where unescaped output is essential, PyBlade provides dedicated syntax, ensuring that developers can easily distinguish safe and unsafe operations.

### Python-Powered, logic-first design

PyBlade templates execute as Python code, aligning well with Python’s syntax
and conventions. However, as with Django's best practices, the majority of business logic should remain in the backend, while templates should focus on presentation. This approach keeps templates clean, efficient, and aligned with the MVC (Model-View-Controller) architecture, promoting a clear separation of concerns.

### Powerful and expressive template logic

PyBlade provides a range of directives for handling logic within templates, from basic conditionals and loops to complex components. This rich directive set reduces the need to process data in the controller, making backend code cleaner and templates more capable. PyBlade simplifies common tasks such as conditional rendering, looping, and error handling, so developers can focus on delivering features instead of managing template complexity.


## How PyBlade Accelerates Development

With its concise syntax and component-driven approach, PyBlade helps developers build applications faster by reducing the amount of code required to create robust templates. By focusing on `@`-based directives, PyBlade provides a less verbose, more readable syntax that makes templates easy to maintain and extend. Developers can move from idea to implementation more quickly, thanks to PyBlade’s intuitive directive system and streamlined component architecture.
