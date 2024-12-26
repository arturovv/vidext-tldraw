# Vidext - Drawing Canvas with AI

This project is a drawing canvas built with Next.js, tldraw, and trpc. It allows users to create, edit, and share drawings. It also features AI integration to describe the drawings.

**Important Note:** This is **not** a real-time collaborative application. Changes made by one user will not be immediately visible to other users on the same project. Users must refresh the page to see the latest changes to a project.

## Features

-   **Drawing Canvas:** A versatile drawing canvas powered by tldraw, allowing for freeform drawing and shape creation.
-   **User Authentication:** Secure user authentication using NextAuth.js with email login.
-   **Project Management:** Users can create, edit, and manage multiple drawing projects.
-   **Public/Private Projects:** Control the visibility of projects, making them public or keeping them private.
-   **AI-Powered Description:** Use AI to generate text descriptions of your drawings.
-   **Canvas Rotation:** Rotate selected shapes on the canvas.
-   **Data Persistence:** Drawings are saved in the file system ('/data'), to prevent database saturation.
-   **Guest Access:** Start drawing immediately as a guest without logging in.
-   **Responsive Design:** Works well on various screen sizes.

## Currently Online

This project is currently online at [vidext-tldraw-app-production.up.railway.app](https://vidext-tldraw-app-production.up.railway.app/).

## Setup and Run Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org) (v20 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)
-   [PostgreSQL](https://www.postgresql.org/) database
-   [Google Gemini API Key](https://ai.google.dev/)

### Steps

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd vidext-tldraw
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```env
    DATABASE_URL="<YOUR_POSTGRESQL_CONNECTION_STRING>"
    GEMINI_API_KEY="<YOUR_GOOGLE_GEMINI_API_KEY>"
    EMAIL_SERVER_HOST="<YOUR_EMAIL_SERVER_HOST>"
    EMAIL_SERVER_PORT="<YOUR_EMAIL_SERVER_PORT>"
    EMAIL_SERVER_USER="<YOUR_EMAIL_SERVER_USER>"
    EMAIL_SERVER_PASSWORD="<YOUR_EMAIL_SERVER_PASSWORD>"
    EMAIL_FROM="<YOUR_EMAIL_ADDRESS>"
    NEXTAUTH_SECRET="<YOUR_NEXTAUTH_SECRET>"
    APP_URL="http://localhost:3000"
    NEXT_PUBLIC_APP_URL=${APP_URL}
    ```

    -   Replace `<YOUR_POSTGRESQL_CONNECTION_STRING>` with your PostgreSQL connection string.
    -   Replace `<YOUR_GOOGLE_GEMINI_API_KEY>` with your Google Gemini API key.
    -   Replace `<YOUR_EMAIL_SERVER_HOST>`, `<YOUR_EMAIL_SERVER_PORT>`, `<YOUR_EMAIL_SERVER_USER>`, and `<YOUR_EMAIL_SERVER_PASSWORD>` with your email server details.
    -   Replace `<YOUR_EMAIL_ADDRESS>` with the email address you want to use for sending emails.
    -   Replace `<YOUR_NEXTAUTH_SECRET>` with a secure random string for NextAuth.js.

4.  **Database Migrations:**

    Generate database migrations using drizzle-kit

    ```bash
    npm run db:generate
    ```

    Apply the migrations:

    ```bash
    npm run db:migrate
    ```

5.  **Run the Development Server:**

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

## Project Structure

-   `drizzle/`: Contains database migration files.
-   `public/`: Static assets (images, icons).
-   `src/`: Source code of the application.
    -   `app/`: Next.js app directory with routes and pages.
        -   `[[...projectId]]/`: Dynamic route for handling canvas with specific project
        -   `api/`: API routes for authentication (`auth`) and trpc (`trpc`).
        -    `projects/`: Pages related to project management
    -   `components/`: Reusable React components.
        -   `ai-describe`: Component for AI-powered image description.
        -   `canvas`: Components for canvas interaction and management.
            -   `hooks`: Custom React hooks for canvas functionalities.
        -   `sidebar`: Sidebar component for navigation and authentication.
        -   `ui`: Reusable UI components.
    -   `data-access/`: Data access layer for interacting with the database.
    -   `db/`: Database configurations and schema.
        -   `schema/`: Drizzle ORM schema definition.
    -   `lib/`: Utility functions and helper classes.
        -   `ai`: AI functionalities and integration with Gemini API.
    -   `providers/`: React providers for React Query and tRPC.
    -   `server/`: Server-side code.
        -   `routers/`: tRPC routers for API endpoints.
    -   `types/`: Typescript definitions.
    -   `auth.ts`: NextAuth configurations.
-   `components.json`: shadcn ui component configurations
-   `.gitignore`: Specifies intentionally untracked files.
-   `drizzle.config.ts`: drizzle config file
-   `eslint.config.mjs`: ESLint configurations.
-   `middleware.ts`: Next.js middleware for authentication.
-   `next.config.ts`: Next.js configurations.
-   `package.json`: Project dependencies and scripts.
-   `postcss.config.mjs`: PostCSS configurations.
-   `README.md`: Project documentation (this file).
-   `tailwind.config.ts`: Tailwind CSS configurations.
-   `tsconfig.json`: TypeScript configurations.

## Technologies Used

-   [Next.js](https://nextjs.org): React framework.
-   [tldraw](https://www.tldraw.com): Drawing canvas library.
-   [trpc](https://trpc.io): End-to-end typesafe API.
-   [shadcn/ui](https://ui.shadcn.com): UI component library.
-   [Drizzle ORM](https://orm.drizzle.team): TypeScript ORM.
-   [NextAuth.js](https://next-auth.js.org): Authentication library.
-   [PostgreSQL](https://www.postgresql.org): Database
-   [Google Gemini API](https://ai.google.dev/): AI model.

## TODO

-   Delete project
-   Customize login pages and magic link email
-   Real-time visualization
-   Real-time collaboration
-   i18n
-   oAuth login with Google and GitHub
-   Setup a bucket for storing the snapshots (json files)
