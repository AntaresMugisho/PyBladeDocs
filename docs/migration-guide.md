# Migration Guide

::: danger ⚠️ Warning: Experimental Feature
PyBlade is currently in experimental mode. While we are actively developing and testing its features, please be aware that it may contain bugs or incomplete functionality. We recommend using PyBlade exclusively in test environments or with caution in production environments.

Your feedback is invaluable as we work toward a stable release. Thank you for helping us improve PyBlade!
:::

## Migrating from Django’s default Template Engine to PyBlade  

If you're working on an existing Django project that uses Django’s default template engine and want to switch to PyBlade, manually updating all templates can be a tedious task. To simplify this process, PyBlade provides a built-in command that automatically converts your existing Django templates by replacing all Django-specific directives with their PyBlade equivalents.  

### How It Works  

When you run the following command:  

```bash
pyblade convert
```  

PyBlade will:  
1. **Scan the Template Directory** – It will go through all `.html` template files inside the `TEMPLATES['DIRS']` paths defined in your `settings.py`. It will also go throuh each application's specific `templates` directory if `TEMPLATES['APP_DIRS']` is set to `True`.
2. **Identify Django Directives** – PyBlade detects Django’s template tags and filters, such as `{% for %}`, `{% if %}`, `{% include %}`, and <span v-pre>`{{ variable }}`</span>.  
3. **Replace with PyBlade Syntax** – It automatically converts Django-specific syntax into the equivalent PyBlade directives. For example:  
   - `{% for item in items %}...{% endfor %}` → `@for(item in items)...@endfor`  
   - `{% if user.is_authenticated %}...{% endif %}` → `@if(user.is_authenticated)...@endif`  
   - `{% include 'partial.html' %}` → `@include('partial')`  
4. **Preserve Custom Logic** – PyBlade ensures that variables, loops, and conditions remain functional while adapting to PyBlade’s cleaner and more expressive syntax.  
5. **Backup Original Files** (Optional) – If needed, you can specify an option to back up your original templates before conversion.  

## When to use this command ?
 
- If you're **migrating an entire Django project** to PyBlade and want to avoid manually rewriting templates.  
- If you want to **test PyBlade** in an existing project before fully committing.  
- If you have a large number of templates and need an **efficient conversion process**.  

## Important Notes 

- This command is **not reversible**, so it's recommended to back up your templates before running the conversion.  
- Some complex Django template logic may require **manual adjustments** after conversion, especially if you use custom template tags or filters.

By using `pyblade convert`, you can save time and quickly transition your project to PyBlade, allowing you to take advantage of its more intuitive syntax and improved template performance.