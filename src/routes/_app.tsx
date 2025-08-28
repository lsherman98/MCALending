import { createFileRoute, Outlet } from "@tanstack/react-router";
import { protectPage } from "@/lib/auth";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createFileRoute("/_app")({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  ),
  beforeLoad: ({ location }) => {
    // All routes under /_app are protected
    protectPage(location);
  },
});
