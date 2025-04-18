// import { createHighlighter } from 'shiki'

import { codeToHtml } from 'https://esm.run/shiki@3.0.0'

const livebladeCode = `from pyblade import liveblade
from app.models import Task

class Todo(liveblade.Component):
    title: str
    tasks = Task.objects.all()

    def add(self):
        if self.title:
            Task.objects.create(title=self.title)
            self.notify("Task created !")

    def render(self):
        return self.view("livablade.todo")
`

const livebladeComponentCode = `<form b-submit="add">
    <input type="text" b-model="title">
    <button type="submit">Add Task</button>
</form>

@for(task in tasks)
    <b-task-item :task="task" key="task.id" />
@endfor
`

const pybladeComponentCode = `<div class="task-item">
    <input 
      type="checkbox"
      b-click="toggle_status({{ task.id }})"
      @checked(task.done)
    />
    <h3>{{ task.title }}</h3>
</div>
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
const livebladeComponent = document.getElementById("liveblade-component-snippet")
const pybladeComponent = document.getElementById("pyblade-component-snippet")
// const home = document.getElementById("home-snippet")


liveblade.innerHTML =`<pre>${livebladeCode}</pre>`
livebladeComponent.innerHTML = `<pre>${livebladeComponentCode}</pre>`
pybladeComponent.innerHTML = `<pre>${pybladeComponentCode}</pre>`
// home.innerHTML = `<pre>${homeCode}</pre>`

liveblade.innerHTML = await codeToHtml(livebladeCode, {lang: 'python', theme: 'one-dark-pro'})
livebladeComponent.innerHTML = await codeToHtml(livebladeComponentCode, {lang: "blade", theme: "one-dark-pro"})
pybladeComponent.innerHTML = await codeToHtml(pybladeComponentCode, {lang: "blade", theme: "one-dark-pro"})
// home.innerHTML = await codeToHtml(homeCode, {lang: "blade", theme: "one-dark-pro"})



