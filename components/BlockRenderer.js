function RichText({ richText }) {
  if (!richText?.length) return null;
  return richText.map((t, i) => {
    let el = t.plain_text;
    if (t.annotations.bold) el = <strong key={i}>{el}</strong>;
    if (t.annotations.italic) el = <em key={i}>{el}</em>;
    if (t.href) {
      return (
        <a key={i} href={t.href} style={{ textDecoration: "underline" }}>
          {el}
        </a>
      );
    }
    return <span key={i}>{el}</span>;
  });
}

export default function BlockRenderer({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {blocks.map((block) => {
        const { type, id } = block;
        const value = block[type];

        switch (type) {
          case "paragraph":
            if (!value.rich_text.length) return null;
            return (
              <p key={id} style={{ fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <RichText richText={value.rich_text} />
              </p>
            );
          case "heading_1":
          case "heading_2":
          case "heading_3":
            return (
              <h3
                key={id}
                style={{
                  fontWeight: 600,
                  fontSize: type === "heading_1" ? 19 : type === "heading_2" ? 16 : 14,
                  margin: "8px 0 0"
                }}
              >
                <RichText richText={value.rich_text} />
              </h3>
            );
          case "image": {
            const src = value.file?.url || value.external?.url;
            if (!src) return null;
            // 본문 사진은 비율을 강제로 자르지 않고 원본 그대로 보여줍니다.
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={id}
                src={src}
                alt=""
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            );
          }
          case "quote":
            return (
              <blockquote
                key={id}
                style={{
                  margin: 0,
                  paddingLeft: 16,
                  borderLeft: "2px solid var(--ink)",
                  fontStyle: "italic",
                  fontSize: 14
                }}
              >
                <RichText richText={value.rich_text} />
              </blockquote>
            );
          case "bulleted_list_item":
          case "numbered_list_item":
            return (
              <p key={id} style={{ fontSize: 14, lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
                — <RichText richText={value.rich_text} />
              </p>
            );
          case "divider":
            return <hr key={id} className="hairline" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
