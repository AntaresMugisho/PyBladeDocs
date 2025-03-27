---
layout: home

hero:
  name: "PyBlade"
  text: "The lightweight and secure template engine for Python web frameworks !"
  tagline: "Modern and Elegant"
  image:
    src: assets/images/pyblade.png
    alt: PyBlade Logo
  actions:
    - theme: brand
      text: Getting started
      link: /getting-started
    - theme: alt
      text: What is PyBlade ?
      link: /meet-pyblade
    - theme: alt
      text: Github
      link: https://github.com/antaresmugisho/pyblade

features:
  - icon: 🐍
    title: Pythonic Template Engine
    details: Write templates with a familiar Python-like syntax. PyBlade's template engine offers clean, readable syntax with full Python expression support and built-in security features.
  
  - icon: 🧩
    title: Component-Driven Development
    details: Create reusable, self-contained components with client-side rendering capabilities. Build interactive UIs efficiently, similar to modern frontend frameworks.
  
  - icon: 🛠️
    title: Powerful CLI Toolkit
    details: Boost your productivity with PyBlade CLI. Scaffold projects, generate components, and manage your development workflow seamlessly.
  
  - icon: 🔌
    title: Framework Integration
    details: Seamlessly integrates with popular Python web frameworks. From custom form handling to data-binding, PyBlade works harmoniously with your stack.
  
  - icon: ⚡
    title: Lightning Fast
    details: Optimized for performance with efficient template compilation and minimal runtime overhead. Your templates run at native Python speed.
  
  - icon: 🛡️
    title: Secure by Design
    details: Built with security in mind. Automatic XSS protection, content sanitization, and configurable security policies keep your applications safe.

waitlist:
  title: Join the Waitlist
  description: Be the first to know when PyBlade's stable version launches. Get early access and exclusive updates.
  form:
    action: "#"
    buttonText: "Subscribe"
    placeholder: "Enter your email"

team:
  title: Meet the Creators
  members:
    - avatar: /antares.jpg
      name: Antares Mugisho
      title: Lead Developer
      links:
        - icon: github
          link: https://github.com/antaresmugisho
    - avatar: /glodi.jpg
      name: Glodi Mbutwile
      title: Core Developer
      links:
        - icon: github
          link: https://github.com/princelulinda

testimonials:
  title: What Developers Say
  items:
    - author: Sarah Chen
      role: Senior Backend Developer
      text: PyBlade has transformed how we build templates. The component system is a game-changer.
    - author: Mark Thompson
      role: Full Stack Developer
      text: The CLI tools and seamless framework integration make development a breeze.
    - author: Laura Martinez
      role: Python Developer
      text: Finally, a template engine that feels truly Pythonic! The syntax is intuitive and powerful.

sponsors:
  title: Our Sponsors
  description: Companies and individuals supporting PyBlade's development
  items:
    - name: TechCorp
      logo: /techcorp-logo.png
      link: https://example.com
    - name: DevStudio
      logo: /devstudio-logo.png
      link: https://example.com

contributors:
  title: Contributors
  description: Thank you to all our amazing contributors!
  link: https://github.com/antaresmugisho/pyblade/graphs/contributors

footer:
  message: Released under the MIT License.
  copyright: Copyright 2023-2025 PyBlade Team
  links:
    - text: Documentation
      link: /docs
    - text: GitHub
      link: https://github.com/antaresmugisho/pyblade
    - text: Twitter
      link: https://twitter.com/pyblade
    - text: Discord
      link: https://discord.gg/pyblade

style:
  background: |
    :root {
      --vp-home-hero-name-color: transparent;
      --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #4B8BBE 30%, #FFE873);
      --vp-home-hero-image-background-image: linear-gradient(-45deg, #4B8BBE 50%, #FFE873 50%);
      --vp-home-hero-image-filter: blur(40px);
    }

    @keyframes hero-animation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .VPHero {
      background: linear-gradient(-45deg, #4B8BBE, #306998, #FFE873, #FFD43B);
      background-size: 400% 400%;
      animation: hero-animation 15s ease infinite;
    }
---
