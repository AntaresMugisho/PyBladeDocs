import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PyBlade",
  description: "The lightweight and secure template engine for Python web frameworks !",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/1-what-is-pyblade'},
      { text: 'Audience', link: '/2-who-should-use-pyblade'},
      { text: 'Documentation', link: '/3-getting-started' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Meet PyBlade', link: '/1-meet-pyblade' },
          { text: 'Getting started', link: '/3-getting-started'},
          { text: 'Migration guide', link: '/migration-guide'}
        ]
      },
      {
        text: 'PyBlade : Template engine',
        items: [
          {text: "Prelude", link:'/5-prelude'},
          {text: "Displaying Data", link:'/6-displaying-data'},
          {text: "PyBlade Directives", link:'/7-pyblade-directives'},
          {text: "Components", link: '/components'},
          {text: "Building Layouts", link: '/layouts'},
          {text: "Forms", link: '/forms'},
        ]
      },
      {
        text: 'Liveblade: Interactive UIs',
        items: [
          {}
        ]
      },
      {
        text: 'PyBlade CLI',
        items: [
          {}
        ]
      },
      {
        text: 'Outro',
        items: [
          {text: "Future Features", link:'/future-features'},
          {text: "Support and Contribution", link:'/support-and-contribution'},

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/antaresmugisho/pyblade' }
    ]
  }
})
