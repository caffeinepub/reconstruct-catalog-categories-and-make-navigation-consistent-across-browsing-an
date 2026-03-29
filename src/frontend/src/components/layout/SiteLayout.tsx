import { Outlet } from "@tanstack/react-router";
import ScrollToTopButton from "../common/ScrollToTopButton";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
