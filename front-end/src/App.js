import './App.css';
import path from "./constants/paths";
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeamCreation from './pages/TeamCreation';
import TriviaGameLobby from './pages/TriviaGameLobby';
import { SignUpPage, VerifyEmailPage, RegisterQuestionAnswerPage, LoginPage, ResetPasswordPage, ForgotPasswordPage, HomePage, UserProfilepage } from './pages';
import Navbar from './components/navbar';
import QuestionListPage from './pages/AutomatedQuestionTagging/questionListPage';
import QuestionForm from './pages/AutomatedQuestionTagging/QuestionForm';
import InGame from './pages/InGameModule/InGame';
import CreateGames from './pages/TrivaAdminGameManagement/CreateGames';
import ListGames from './pages/TrivaAdminGameManagement/ListGames';
import ViewGameDetails from './pages/TrivaAdminGameManagement/ViewGameDetails';
import UpdateGame from './pages/TrivaAdminGameManagement/UpdateGame';
import Leaderboard from './pages/LeaderBoardModule/Leaderboard';

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>

        {/* TriviaAdminRoutes */}
        <Route path={path.SIGNUP} element={<SignUpPage />} />
        <Route path={path.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        <Route path={path.SECOND_FACTOR} element={<RegisterQuestionAnswerPage />} />
        <Route path={path.LOGIN} element={<LoginPage />} />
        <Route path={path.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={path.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={path.IN_GAME} df element={<InGame />} />
          <Route path = {path.LEADERBOARD} element= {<Leaderboard />}  />
        <Route element={<ProtectedRoute />}>
          <Route path={path.GAME_LOBBY} element={<TriviaGameLobby />} />
          <Route path={path.HOME} element={<HomePage />} />
          <Route path={path.USER_PROFILE} element={<UserProfilepage />} />
          <Route path={path.TEAM_CREATION} element={<TeamCreation />} />
          <Route path={path.GAME_LOBBY} element={<TriviaGameLobby />} />
          <Route index path="/managequestions" element={<QuestionListPage />} />
          <Route index path="/addquestion" element={<QuestionForm />} />
          <Route index path="/managegames" element={<ListGames />} />
          <Route index path="/creategames" element={<CreateGames />} />
          <Route path="/game/:gameID" element={<ViewGameDetails />} />
          <Route path="/updateGame/:gameID" element={<UpdateGame />} />
          <Route path={path.TEAM_CREATION} element={<TeamCreation />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
