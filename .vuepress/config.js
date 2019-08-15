module.exports = {
    title: 'crazyMarky的学习库', 
    description: '一个Java后端的必经之路',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
	themeConfig: {
		nav: [
		  { text: 'crazyMarky主页', link: '/' },
		  { text: 'Java基础',  items: [
			  { text: '语言基础', link: '/java_basic/basic/' },
			  { text: '面向对象', link: '/java_basic/oop/' },
			  { text: '持有对象', link: '/java_basic/collections/' },
			  { text: 'Java I/O', link: '/java_basic/IO/' },
			  { text: '并发编程', link: '/java_basic/concurrency/' },
			  { text: 'JDK', link: '/java_basic/JDK/' }
			] 
		  },
		  { text: '开发框架', items: [
			  { text: 'Spring', link: '/dev_framework/spring/' },
			  { text: 'SpringMVC', link: '/dev_framework/springMVC/' },
			  { text: 'Mybatis', link: '/dev_framework/mybatis/' },
			  { text: 'SpringBoot', link: '/dev_framework/springBoot/' }
			]  
		  },
		  { text: '数据库', items: [
			  { text: 'mysql', link: '/database/mysql/' },
			  { text: 'Redis', link: '/middleware/redis/' },
			  { text: 'mongoDb', link: '/middleware/mongodb/' }
			]  
		  },
		  { text: '中间件', items: [
			  { text: 'Nginx', link: '/middleware/nginx/' },
			  { text: 'Tomcat', link: '/middleware/tomcat/' },
			  { text: 'ElaticSearch', link: '/middleware/es/' },
			  { text: 'RabbitMq', link: '/middleware/rabbitMq/' }
			]  
		  },
		  { text: '解决方案',  items: [
			  { text: '单体', link: '/solution/single/' },
			  { text: '集群', link: '/solution/cluster/' },
			  { text: '分布式', link: '/solution/distribute/' }
			]  
		  },
		  { text: '其他知识', items: [
			  { text: '数据结构', link: '/others/datastruct/' },
			  { text: '基础算法', link: '/others/algorithm/' },
			  { text: 'Linux', link: '/others/linux/' },
			] 
		  }
		],
		sidebar: 'auto',
		displayAllHeaders: true,
		search: false,
	}
	
}