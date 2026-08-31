import { Client } from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// 2025-09-03 노션 API부터는 데이터베이스를 바로 쿼리할 수 없고,
// 그 안의 "데이터 소스" ID를 먼저 알아내서 그걸로 쿼리해야 합니다.
// 매 요청마다 다시 조회하지 않도록 결과를 캐싱합니다.
let cachedDataSourceId = null;
async function getDataSourceId() {
  if (cachedDataSourceId) return cachedDataSourceId;
  const db = await notion.databases.retrieve({ database_id: databaseId });
  cachedDataSourceId = db.data_sources[0].id;
  return cachedDataSourceId;
}

function mapPost(page) {
  const props = page.properties;
  const cover =
    page.cover?.external?.url ||
    page.cover?.file?.url ||
    props.Cover?.files?.[0]?.file?.url ||
    props.Cover?.files?.[0]?.external?.url ||
    null;

  return {
    id: page.id,
    title: props.Name?.rich_text?.[0]?.plain_text || "제목 없음",
    slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,
    date: props.Date?.date?.start || null,
    category: props.Category?.select?.name || null,
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
    cover
  };
}

// 발행된(Published 체크박스가 true인) 글만, 최신순으로 가져옵니다.
export async function getPosts() {
  const data_source_id = await getDataSourceId();
  const response = await notion.dataSources.query({
    data_source_id,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }]
  });
  return response.results.map(mapPost);
}

export async function getPostBySlug(slug) {
  const data_source_id = await getDataSourceId();
  const response = await notion.dataSources.query({
    data_source_id,
    filter: { property: "Slug", rich_text: { equals: slug } }
  });
  if (!response.results.length) return null;
  return mapPost(response.results[0]);
}

// 페이지 본문 블록을 재귀 없이(1depth) 전부 가져옵니다.
export async function getPageBlocks(pageId) {
  const blocks = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100
    });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return blocks;
}
