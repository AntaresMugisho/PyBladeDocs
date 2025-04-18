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
        text: 'Liveblade: Interactive UIs',
        items: [
          {text:"Prelude", link:"/liveblade/prelude"},
          {text: "Quick start", link:"/liveblade/quickstart"},
          {text: "Installation", link:"/liveblade/installation"},
          {text: "Essentials", 
            items: [
              {text: "Components", link:"/liveblade/components"},
              {text: "Properties", link:"/liveblade/properties"},
              {text: "Actions", link:"/liveblade/actions"},
              {text: "Lifecycle Hooks", link:"/liveblade/lifecycle-hooks"},
              {text: "Events", link:"/liveblade/events"},
              {text: "Liveblade Directives", link:"/liveblade/liveblade-directives"},
              {text: "Forms", link:"/liveblade/forms"},
            ]
          },
          
          {text: "Features",
            items: [
              {text: "Navigation", link:"/liveblade/features/navigation"},
              {text: "Lazy Loading", link:"/liveblade/features/lazy-loading"},
              {text: "Validation", link:"/liveblade/features/validation"},
              {text: "File Uploads", link:"/liveblade/features/file-uploads"},
              {text: "Pagination", link:"/liveblade/features/pagination"},
            ]
          },

          {text: "Security", link:"/liveblade/security"},
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
    ]
  }
})
