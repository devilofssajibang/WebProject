import Sidebar from "@/components/Sidebar";

export default function Layout({ posts, children }) {
  return (
    <div className="layout">
      <Sidebar posts={posts} />
      <main className="content">{children}</main>
    </div>
  );
}
