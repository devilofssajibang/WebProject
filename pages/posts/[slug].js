import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import BlockRenderer from "@/components/BlockRenderer";
import { getPosts, getPostBySlug, getPageBlocks } from "@/lib/notion";
import config from "@/site.config";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function Post({ post, blocks, posts }) {
  if (!post) return null;

  return (
    <>
      <Head>
        <title>{`${post.title} — ${config.siteName}`}</title>
      </Head>
      <Layout posts={posts}>
        <div className="detail-body">
          <Link href="/" className="label" style={{ display: "inline-block", marginBottom: 32 }}>
            ← Back to Main
          </Link>

          <h1>{post.title}</h1>

          <div className="meta-table">
            <div className="meta-row">
              <span>category</span>
              <span>{post.category || "기록"}</span>
            </div>
            <div className="meta-row">
              <span>date</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>

          {post.cover ? (
            <div className="cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover} alt={post.title} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          ) : null}

          <BlockRenderer blocks={blocks} />
        </div>
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const [post, posts] = await Promise.all([getPostBySlug(params.slug), getPosts()]);
  if (!post) return { notFound: true };
  const blocks = await getPageBlocks(post.id);
  return {
    props: { post, blocks, posts },
    revalidate: 30
  };
}
