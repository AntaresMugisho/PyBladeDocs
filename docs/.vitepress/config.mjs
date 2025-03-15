import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PyBlade",
  description: "The lightweight and secure template engine for Python web frameworks !",
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
          {text: "Quick start", link:"/liveblade/quickstart"},
          {text: "Installation", link:"/liveblade/installation"},
          // {text: "ESSENTIALS"},
          {text: "Components", link:"/liveblade/components"},
          {text: "Properties", link:"/liveblade/properties"},
          {text: "Actions", link:"/liveblade/actions"},
          {text: "Lifecycle Hooks", link:"/liveblade/lifecycle-hooks"},
          {text: "Forms", link:"/liveblade/forms"},
          {text: "Events", link:"/liveblade/events"},
          {text: "HTML Directives", link:"/liveblade/html-directives"},
          // {text: "FEATURES"},
          {text: "Navigation", link:"/liveblade/features/navigation"},
          {text: "Lazy Loading", link:"/liveblade/features/lazy-loading"},
          {text: "Validation", link:"/liveblade/features/validation"},
          {text: "Pagination", link:"/liveblade/features/pagination"},
          {text: "File Uploads", link:"/liveblade/features/file-uploads"},
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
