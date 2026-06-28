import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PyBlade",
  description: "The lightwieght and secure frontend framework for Python web frameworks.",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/meet-pyblade' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Meet PyBlade', link: '/meet-pyblade' },
          { text: 'Getting started', link: '/getting-started'},
          { text: 'Migration guide', link: '/migration-guide'}
        ]
      },
      {
        text: 'PyBlade : Template engine',
        items: [
          {text: "Prelude", link:'/pyblade-prelude'},
          {text: "Displaying Data", link:'/displaying-data'},
          {text: "PyBlade Directives", link:'/pyblade-directives'},
          {text: "Components", link: '/components'},
          {text: "Building Layouts", link: '/layouts'},
          {text: "Forms", link: '/forms'},
        ]
      },
      {
        text: 'PyBlade Live: Interactive UIs',
        items: [
          {text:"Prelude", link:"/live/prelude"},
          {text: "Quick start", link:"/live/quickstart"},
          {text: "Installation", link:"/live/installation"},
          {text: "Essentials", 
            items: [
              {text: "Components", link:"/live/components"},
              {text: "Properties", link:"/live/properties"},
              {text: "Actions", link:"/live/actions"},
              {text: "Lifecycle Hooks", link:"/live/lifecycle-hooks"},
              {text: "Events", link:"/live/events"},
              {text: "PyBlade Live Directives", link:"/live/live-directives"},
              {text: "Forms", link:"/live/forms"},
            ]
          },
          
          {text: "Features",
            items: [
              {text: "Navigation", link:"/live/features/navigation"},
              {text: "Lazy Loading", link:"/live/features/lazy-loading"},
              {text: "Validation", link:"/live/features/validation"},
              {text: "File Uploads", link:"/live/features/file-uploads"},
              {text: "Pagination", link:"/live/features/pagination"},
            ]
          },

          {text: "Security", link:"/live/security"},
        ]
      },
      {
        text: "PyBlade CLI",
        items:[
          {text: "Overview", link: "/cli/overview"},
          {text: "Available commands", link: "/cli/commands"}
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
    ],

    search: {
      provider: 'local'
    },

    cleanUrls: true,

    editLink: {
      pattern: 'https://github.com/antaresmugisho/pybladedocs/edit/main/docs/:path'
    }
  }
})
