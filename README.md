<div align='center'>

# Digital Perception

### Create a website which displays the Org's information, aim, and goal.

</div>

---

## Overview

**Digital Perception** is a website built for the AP Org to showcase organizational information, purpose, and objectives. The project leverages a modern web stack for performance, accessibility, and maintainability.

---

## Tech Stack

- **Next.js** (React-based, SSR/SSG support)
- **Tailwind CSS** (utility-first CSS framework)
- **shadcn/ui** or **Radix UI** (accessible, customizable UI components)
- **GitHub Pages** (for deployment)

---

## Content Management (Future Consideration)

If content management becomes necessary (e.g., for team pages, blog posts, AR product showcases), the following CMS options are recommended:

- **Notion** as CMS (with Next.js integration)
- **Sanity.io**
- **Contentful**

---

## Extras to Consider

- **SEO optimization** with [`next-seo`](https://github.com/garmeeh/next-seo)
- **Analytics**: Google Analytics or [Plausible](https://plausible.io/) for traffic tracking
- **Contact Form**: Use [Formspree](https://formspree.io/) or a self-hosted API route for simple contact functionality

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/JayNightmare/Digital-Perception.git
cd Digital-Perception
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Deployment

This project is designed to be deployed on **GitHub Pages**. To build and export the site:

```bash
npm run build
npm run export
```

Then, follow [Next.js GitHub Pages deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) for publishing.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for any improvements, bugs, or new features.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
