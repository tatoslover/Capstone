import "../styles/globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import PerformanceWrapper from "../components/PerformanceWrapper";
import ErrorBoundary from "../components/ErrorBoundary";

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PerformanceWrapper>
          <Component {...pageProps} />
        </PerformanceWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
