// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'De Regering Robot',
  tagline: 'De regeringsbesluiten werden geanalyseerd door middel van AI',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://flanders-politics-bot.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dataminded', // Usually your GitHub org/user name.
  projectName: 'flanders-politics-bot', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  scripts: [
    {
      async : true,
      src : "https://www.feedbackrocket.io/sdk/v1.1.js",
      'data-fr-id' : "zpymFBtmDsmX6XJXZVipc", // if we ever open source this - this should be injected
      'data-fr-theme': 'dynamic'
    }
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/datamindedbe/elections2024-website',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'De Regering Robot',
        logo: {
          alt: 'My Site Logo',
          src: 'img/robot.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'aibotSidebar',
            position: 'left',
            label: 'AI Analyse van het Regeerakkoord',
          },
          // Add a feedback button in the top navbar on every page
          {
            type: 'html',
            position: 'right',
            value:
              `<a href=# class=navbar__link data-fr-widget>
                Geef Feedback
              </a>`
          },
          {
            type: 'html',
            position: 'right',
            value: '<div class=navbar__item>Beta Release - powered by <a href="https://www.dataminded.com/"> Data Minded</a></div>',
          },
        ],
      },
      footer: {
        style: 'dark',

        logo: {
          alt: 'Data Minded Logo',
          src: 'img/Dataminded_Logo_transparant.webp',
          href: 'https://www.dataminded.com/',
          width: 250,
        },
        copyright: `Copyright © ${new Date().getFullYear()} Data Minded.`,
        links:[{
            html: `<p>Vrijwaring: <i> Wij kunnen niet garanderen dat de inhoud van deze webpagina volledig correct is, aangezien deze gedeeltelijk door AI (openai LLM) is gegenereerd. Deze website is uitsluitend gemaakt voor experimentele en educatieve doeleinden </i> </p>`,
        }]
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
