import type { Metadata } from "next";

// Import Bootstrap CSS only for this route
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata: Metadata = {
  title: "Bootstrap Demo - Admin",
  description: "Demo page using Bootstrap styling",
};

export default function BootstrapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bootstrap-scope" data-bs-theme="light">
      {children}
    </div>
  );
}
