import '../styles/global.css';
import 'bytemd/dist/index.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
