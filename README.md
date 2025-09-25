# My Personal Blog

A simple, elegant blog built with Next.js, TypeScript, and Tailwind CSS. Write posts in Markdown and manage them through a clean admin interface.

## Features

- 📝 **Markdown Support**: Write posts in Markdown with MDX support
- 🎨 **Clean Design**: Modern, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Static site generation for lightning-fast loading
- 🔧 **Admin Interface**: Simple interface for writing and managing posts
- 📱 **Mobile Friendly**: Fully responsive design
- 🚀 **Easy Deployment**: Ready for Vercel, Netlify, or any static hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up authentication (IMPORTANT for security):
```bash
# Run the interactive setup script
npm run setup

# OR manually create .env.local file with your credentials
# See Security Setup section below for details
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔐 Security Setup

**IMPORTANT**: Before deploying, you MUST secure your blog:

1. **Create Environment File**: Create a `.env.local` file in the root directory:
   ```bash
   # Admin Authentication - REQUIRED
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password-here
   JWT_SECRET=your-jwt-secret-key-here
   ```

2. **Set Secure Credentials**: 
   - Replace `your-secure-password-here` with a strong, unique password
   - Replace `your-jwt-secret-key-here` with a random, secure string (at least 32 characters)
   - Optionally change `ADMIN_USERNAME` from 'admin' to your preferred username

3. **Security Best Practices**:
   - Use a password manager to generate strong passwords
   - Generate JWT secret: `openssl rand -base64 32`
   - Never share these credentials
   - The `.env.local` file is already in `.gitignore` and will not be committed

4. **For Production Deployment**:
   - Use your hosting platform's environment variable settings
   - Never use the same credentials across different environments
   - Consider using a secrets management service for production

## Writing Posts

1. Navigate to `/admin` to access the admin interface
2. Click "Write New Post" to create a new post
3. Fill in the title, excerpt, and content
4. Use Markdown formatting for rich content
5. Save your post

### Post Structure

Posts are stored as MDX files in the `src/posts/` directory with the following frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-09-25"
excerpt: "Brief description of your post"
published: true
---

# Your Post Content

Write your post content in Markdown here...
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Netlify

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider

## Customization

### Styling

- Edit `src/app/globals.css` for global styles
- Modify components in `src/components/` for UI changes
- Update Tailwind configuration in `tailwind.config.js`

### Content

- Add new posts in `src/posts/` as MDX files
- Modify the homepage in `src/app/page.tsx`
- Update the header in `src/components/Header.tsx`

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **MDX**: Markdown with JSX components
- **Gray Matter**: Frontmatter parsing
- **Date-fns**: Date formatting

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin interface
│   ├── posts/          # Blog post pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # Reusable components
│   ├── Header.tsx      # Site header
│   └── PostCard.tsx    # Post preview card
├── lib/                # Utility functions
│   └── posts.ts        # Post management
└── posts/              # Blog post content
    ├── welcome-to-my-blog.mdx
    └── building-this-blog.mdx
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help, please open an issue on GitHub.