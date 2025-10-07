export const TREE_OUTPUT = `Carters-Portfolio/
.
.
├── Makefile
├── README.md
├── backend
│   ├── Makefile
│   ├── Run.py
│   ├── api
│   │   ├── admin
│   │   │   ├── AdminUser.py
│   │   │   ├── controllers.py
│   │   │   ├── decorators.py
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── types.py
│   │   ├── blogs
│   │   │   ├── Blog.py
│   │   │   ├── _docs.py
│   │   │   ├── controllers.py
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── types.py
│   │   ├── contact
│   │   │   ├── Contact.py
│   │   │   ├── _docs.py
│   │   │   ├── controllers.py
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── types.py
│   │   ├── core
│   │   │   ├── cache
│   │   │   │   ├── decorators.py
│   │   │   │   ├── enums.py
│   │   │   │   ├── extension.py
│   │   │   │   └── keys.py
│   │   │   ├── database
│   │   │   │   ├── Base.py
│   │   │   │   └── connection.py
│   │   │   ├── middleware
│   │   │   │   ├── request_id.py
│   │   │   │   └── schema.py
│   │   │   ├── services
│   │   │   │   ├── EmailSender.py
│   │   │   │   └── templates
│   │   │   │       └── contact_email.html
│   │   │   ├── utils
│   │   │   │   └── logging_config.py
│   │   │   └── validation
│   │   │       └── exceptions.py
│   │   └── projects
│   │       ├── Project.py
│   │       ├── _docs.py
│   │       ├── controllers.py
│   │       ├── github_sync.py
│   │       ├── routes.py
│   │       ├── schemas.py
│   │       ├── types.py
│   │       └── webhooks.py
│   ├── app
│   │   ├── factory.py
│   │   ├── handlers
│   │   │   ├── error_handlers.py
│   │   │   └── rate_handlers.py
│   │   ├── http
│   │   │   ├── cors.py
│   │   │   └── jwt_config.py
│   │   └── restx
│   │       ├── api.py
│   │       └── ns.py
│   ├── config.py
│   ├── ops
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   └── uwsgi.ini
│   └── pyproject.toml
├── conf
│   ├── nginx
│   │   ├── conf.nginx
│   │   ├── dev
│   │   │   └── dev.nginx
│   │   ├── logs
│   │   └── prod
│   │       └── prod.nginx
│   └── redis
│       └── portfolio.redis
├── docker-compose.yml.dev
├── docker-compose.yml.prod
├── docs
│   ├── AUTHORS.md
│   └── LICENSE
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── ops
│   │   ├── Dockerfile.dev
│   │   └── Dockerfile.prod
│   ├── package-lock.json
│   ├── package.json
│   ├── public/...
│   ├── src
│   │   ├── App.tsx
│   │   ├── constants.ts
│   │   ├── lib
│   │   │   ├── api
│   │   │   │   ├── client.ts
│   │   │   │   ├── endpoints.ts
│   │   │   │   ├── guards.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── query.ts
│   │   │   ├── components
│   │   │   │   ├── admin
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── protectedRoute.tsx
│   │   │   │   ├── common
│   │   │   │   │   ├── LoadingFallback.module.scss
│   │   │   │   │   ├── LoadingFallback.tsx
│   │   │   │   │   ├── typingText.module.scss
│   │   │   │   │   └── typingText.tsx
│   │   │   │   ├── layout
│   │   │   │   │   ├── header.module.scss
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── layout.module.scss
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── rootLayout.tsx
│   │   │   │   └── space
│   │   │   │       ├── index.ts
│   │   │   │       ├── starfield.module.scss
│   │   │   │       └── starfield.tsx
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useBlogs.ts
│   │   │   │   ├── useContact.ts
│   │   │   │   ├── useProjects.ts
│   │   │   │   └── useTypingAnimation.ts
│   │   │   ├── store
│   │   │   │   ├── auth.store.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── ui.store.ts
│   │   │   └── types
│   │   │       ├── api
│   │   │       │   ├── blogs.ts
│   │   │       │   ├── contact.ts
│   │   │       │   ├── index.ts
│   │   │       │   └── projects.ts
│   │   │       └── guards
│   │   │           ├── blogs.guards.ts
│   │   │           ├── contact.guards.ts
│   │   │           ├── index.ts
│   │   │           └── projects.guards.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── admin
│   │   │   │   ├── dashboard.module.scss
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── githubCallback.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── sections
│   │   │   │       ├── blogs.module.scss
│   │   │   │       ├── blogs.tsx
│   │   │   │       ├── contacts.module.scss
│   │   │   │       ├── contacts.tsx
│   │   │   │       ├── index.ts
│   │   │   │       ├── projects.module.scss
│   │   │   │       └── projects.tsx
│   │   │   ├── blogs
│   │   │   │   ├── blog.module.scss
│   │   │   │   ├── blog.tsx
│   │   │   │   ├── blogPost.module.scss
│   │   │   │   ├── blogPost.tsx
│   │   │   │   └── index.ts
│   │   │   ├── contact
│   │   │   │   ├── contact.module.scss
│   │   │   │   ├── contact.tsx
│   │   │   │   └── index.ts
│   │   │   ├── experience
│   │   │   │   ├── experience.module.scss
│   │   │   │   ├── experience.tsx
│   │   │   │   └── index.ts
│   │   │   ├── projects
│   │   │   │   ├── index.ts
│   │   │   │   ├── projects.module.scss
│   │   │   │   └── projects.tsx
│   │   │   └── root
│   │   │       ├── index.ts
│   │   │       ├── root.module.scss
│   │   │       ├── root.tsx
│   │   │       ├── rootTree.tsx
│   │   │       └── terminal.tsx
│   │   ├── router.tsx
│   │   ├── styles
│   │   │   ├── _animations.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── _variables.scss
│   │   │   └── global.scss
│   │   └── vite-env.d.ts
│   ├── stylelint.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── package.json

53 directories, 165 files`;
