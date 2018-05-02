module.exports = {
  title: '拎壶冲的杂货铺',
  description: '拎壶冲生活的点滴纪录',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '碎碎念', link: '/blog/' },
      { text: '关于拎壶冲', link: '/about/' },
    ],
    sidebar: genSidebarConfig('碎碎念')
  }
}

function genSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '/blog/',
        '/blog/demo',
        '/blog/emitOn'
      ]
    }
  ]
}
