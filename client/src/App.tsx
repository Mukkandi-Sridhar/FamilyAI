import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RecipeAgent from "./pages/RecipeAgent";
import StudyBuddyAgent from "./pages/StudyBuddyAgent";
import FinanceAgent from "./pages/FinanceAgent";
import HomeworkAgent from "./pages/HomeworkAgent";
import LanguageAgent from "./pages/LanguageAgent";
import FollowUpAgent from "./pages/FollowUpAgent";
import DocumentAgent from "./pages/DocumentAgent";
import SupportAgent from "./pages/SupportAgent";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="recipe" element={<RecipeAgent />} />
        <Route path="study-buddy" element={<StudyBuddyAgent />} />
        <Route path="finance" element={<FinanceAgent />} />
        <Route path="homework" element={<HomeworkAgent />} />
        <Route path="language" element={<LanguageAgent />} />
        <Route path="followup" element={<FollowUpAgent />} />
        <Route path="document" element={<DocumentAgent />} />
        <Route path="support" element={<SupportAgent />} />
      </Route>
    </Routes>
  );
}

export default App;
