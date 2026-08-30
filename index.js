import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import { getPosts } from "@/lib/notion";
import config from "@/site.config";

function formatIndex(n) {
  return String(n).padStart(2, "0");
}

export default function Home({ posts }) {
  const colA = posts.filter((_, i) => i % 2 === 0);
  const colB = posts.filter((_, i) => i % 2 === 1);

  return (
    <>
      <Head>
        <title>{config.siteName}</title>
        <meta name="description" content={config.description} />
      </Head>
      <Layout posts={posts}>
        {posts.length === 0 ? (
          <p className="label" style={{ padding: 24 }}>
            아직 발행된 기록이 없습니다. 노션에서 Published 체크박스를 켜면 여기에 나타납니다.
          </p>
        ) : (
          <div className="grid">
            <div className="grid-line" />
            <div className="col">
              {colA.map((post, i) => (
                <PostCell key={post.id} post={post} index={i * 2} />
              ))}
            </div>
            <div className="col offset">
              {colB.map((post, i) => (
                <PostCell key={post.id} post={post} index={i * 2 + 1} />
              ))}
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

function PostCell({ post, index }) {
  return (
    <Link href={`/posts/${post.slug}`} className="cell">
      <div className="frame">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 800px) 100vw, 40vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="label"
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {post.title}
          </div>
        )}
      </div>
      <span className="idx">
        {formatIndex(index + 1)} — {post.title}
      </span>
    </Link>
  );
}

export async function getStaticProps() {
  const posts = await getPosts();
  return {
    props: { posts },
    revalidate: 30 // 30초마다 노션 변경 사항을 다시 확인합니다.
  };
}
