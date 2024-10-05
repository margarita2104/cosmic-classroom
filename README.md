Cosmic Classroom - Kepler's Horizon's Submission project for the 2024 NASA Space Apps Challenge

How to setup a Next.js project Clone the Repo Open the folder on your code editor Open the console under the project folder Hit “npm install” Good to go !

If you want to run it, hit “npm run dev” You’re free to separate the backend from the frontend. However, for the frontend, use that structure: app > page.tsx (home page) app > nameOfPageFolder (attention, the name of the folder defines the name in the URL) > page.tsx
I created an example for you.

The layout.tsx serves for the MetaData and the basic structure of the webpage. Once you’ve configured the file, it will remain the same for all the other pages created. If you want to modify it, you need to create another layout.tsx file under the nameOfPageFolder, along with the page.tsx

The globals.tsx file serves as a CSS file. But the easier will be to use Tailwind directly and in the page.tsx file under this structure :

<div className="flex">
</div>

If you’ve never used Tailwind before, you can check their website.

The public folder is used for all the static files such as images and all.

-----------------------------------------------------------------------------------------------------------------------------------------------------

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
