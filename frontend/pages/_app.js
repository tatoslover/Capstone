import "../styles/globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import PerformanceWrapper from "../components/PerformanceWrapper";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <PerformanceWrapper>
        <Component {...pageProps} />
      </PerformanceWrapper>
    </ThemeProvider>
  );
}
