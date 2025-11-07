import { ThemeProvider } from "./components/ThemeProvider";
import { BookmarksViewer } from "./pages/BookmarksViewer";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BookmarksViewer />
    </ThemeProvider>
  );
}

export default App;
