// import { createHighlighter } from 'shiki'

import { codeToHtml } from 'https://esm.run/shiki@3.0.0'

const livebladeCode = `from pyblade import live
from app.models import Task

class Todo(live.Component):
    title: str
    tasks = Task.objects.all()

    def add(self):
        if self.title:
            Task.objects.create(title=self.title)
            self.notify("Task created !")

    def render(self):
        return self.view("live.todo")
`

const livebladeComponentCode = `<form pb-submit="add">
    <input type="text" pb-model="title">
    <button type="submit">Add Task</button>
</form>

@for(task in tasks)
    <pb-task-item :task="task" key="task.id" />
@endfor
`

const pybladeComponentCode = `<div class="task-item">
    <input 
      type="checkbox"
      pb-click="toggle_status({{ task.id }})"
      @checked(task.done)
    />
    <h3>{{ task.title }}</h3>
</div>
`

const homeCode = `@extends("layout")

<pb-slot:title>Home<pb-slot>

@section("content")
  <h1>Welcome to PyBlade</h1>

  @if(notification)
    <pb-alert :type="notification.type"/>
  @endif

  @auth
    <live:todo />
  @else
    <p>Please login !</p>
  @endauth
@endsection
`


const live = document.getElementById("live-snippet")
const livebladeComponent = document.getElementById("live-component-snippet")
const pybladeComponent = document.getElementById("pyblade-component-snippet")
// const home = document.getElementById("home-snippet")


live.innerHTML =`<pre>${livebladeCode}</pre>`
livebladeComponent.innerHTML = `<pre>${livebladeComponentCode}</pre>`
pybladeComponent.innerHTML = `<pre>${pybladeComponentCode}</pre>`
// home.innerHTML = `<pre>${homeCode}</pre>`

live.innerHTML = await codeToHtml(livebladeCode, {lang: 'python', theme: 'one-dark-pro'})
livebladeComponent.innerHTML = await codeToHtml(livebladeComponentCode, {lang: "blade", theme: "one-dark-pro"})
pybladeComponent.innerHTML = await codeToHtml(pybladeComponentCode, {lang: "blade", theme: "one-dark-pro"})
// home.innerHTML = await codeToHtml(homeCode, {lang: "blade", theme: "one-dark-pro"})



