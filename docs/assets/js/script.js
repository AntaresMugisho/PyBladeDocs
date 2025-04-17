// import { createHighlighter } from 'shiki'

import { codeToHtml } from 'https://esm.run/shiki@3.0.0'

const livebladeCode = `from pyblade import liveblade
from app.models import Task

class Todo(liveblade.Component):
    title: str

    def add(self):
        if self.title:
            Task.objects.create(title=self.title)
            self.notify("Task created !")

    def render(self):
        return self.view("livablade.todo")

`

const pybladeComponentCode = `@props(type="success")
<div class="alert-{{ type }}">
    {{ slot }}
</div>
sdsds
`

const livebladeComponentCode = `<form b-submit="add">
<input type="text" b-model="title">
<button type="submit">Add Task</button>
</form>
`

const homeCode = `@extends("layout")

<b-slot:title>Home<b-slot>

@section("content")
  <h1>Welcome to PyBlade</h1>

  @if(notification)
    <b-alert :type="notification.type"/>
  @endif

  @auth
    <liveblade:todo />
  @else
    <p>Please login !</p>
  @endauth

@endsection
`

const liveblade = document.getElementById("liveblade-snippet")
liveblade.innerHTML =`<pre>${livebladeCode}</pre>`
liveblade.innerHTML = await codeToHtml(livebladeCode, {lang: 'python', theme: 'one-dark-pro'})

const pybladeComponent = document.getElementById("component-snippet")
pybladeComponent.innerHTML = `<pre>${pybladeComponentCode}</pre>`
pybladeComponent.innerHTMl = await codeToHtml(pybladeComponentCode, {lang: "html", theme: "one-dark-pro"})

const livebladeComponent = document.getElementById("liveblade-component-snippet")
livebladeComponent.innerHTML = `<pre>${livebladeComponentCode}</pre>`
livebladeComponent.innerHTML = await codeToHtml(livebladeComponentCode, {lang: "html", theme: "one-dark-pro"})


const home = document.getElementById("home-snippet")
home.innerHTML = `<pre><code>${homeCode}</code></pre>`
home.innerHTMl = await codeToHtml(homeCode, {lang: "html", theme: "one-dark-pro"})

