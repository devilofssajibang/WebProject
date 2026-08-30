import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";

const body = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

export default function App({ Component, pageProps }) {
  return (
    <main className={body.variable}>
      <Component {...pageProps} />
    </main>
  );
}
