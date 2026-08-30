import Link from "next/link";
import { useRouter } from "next/router";
import config from "@/site.config";

export default function Sidebar({ posts }) {
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="brand">
        <Link href="/" className="name">
          {config.initials}
          <sup>®</sup> {config.siteName}
        </Link>
        <div className="tagline">{config.description}</div>
      </div>

      <nav className="nav-group">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/posts/${p.slug}`}
            className={router.query.slug === p.slug ? "active" : ""}
          >
            {p.title}
          </Link>
        ))}
      </nav>

      <div className="info-group">
        <div className="label heading">Information</div>
        <a href={`mailto:${config.email}`}>Email</a>
        <br />
        <a href={config.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>

      <div className="label copyright">{config.footerNote}</div>
    </aside>
  );
}
