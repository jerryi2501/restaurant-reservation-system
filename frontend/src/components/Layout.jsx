// ページ共通レイアウト：ヘッダー ＋ メイン ＋ フッター
// 使い方: <Layout active="reserve"> ...ページ内容... </Layout>
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ active, children }) {
  return (
    <div style={s.page}>
      <Header active={active} />
      <main style={s.main}>{children}</main>
      <Footer />
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg-secondary)" },
  main: { flex: 1, width: "100%", maxWidth: 1080, margin: "0 auto", boxSizing: "border-box", padding: "48px 24px" },
};
