import pathPrefix from "@/utils/pathPrefix";
import Setup from "@/pages/setup/Setup";
import Criteria from "@/pages/setup/Criteria";
import Stages from "@/pages/setup/Stages";
import Questionnaires from "@/pages/setup/Questionnaires";
import FollowUp from "@/pages/setup/FollowUp";
// import Test from "@/pages/Test";
import { Navigate } from "react-router-dom";
import { Vacancies } from "@/pages/vacancies/Vacancies";
import { VacanciesBoard } from "@/pages/vacancies/VacanciesBoard";
import { VacanciesGrid } from "@/pages/vacancies/VacanciesGrid";
import { CurrentVacancies } from "@/pages/vacancies/CurrentVacancies";
import { Requested } from "@/pages/vacancies/Requested";
import { Finished } from "@/pages/vacancies/Finished";
import { Candidates } from "@/pages/candidates/Candidates";
import { CandidatesBoard } from "@/pages/candidates/CandidatesBoard";
import { CurrentCandidates } from "@/pages/candidates/CurrentCandidates";
import { CandidatesDataBase } from "@/pages/candidates/CandidatesDataBase";
import { SharedToManager } from "@/pages/candidates/SharedToManager";
import { CandidateProfile } from "@/pages/candidateProfile/CandidateProfile";
import CareerChannel from "@/pages/careerChannel/CareerChannel";
export const routes = [
  {
    path: "/setup",
    element: <Setup />,
    children: [
      {
        path: "criteria",
        element: <Criteria />,
      },
      {
        path: "stages",
        element: <Stages />,
      },
      {
        path: "Questionnaires",
        element: <Questionnaires />,
      },
      {
        path: "FollowUp",
        element: <FollowUp />,
      },
      {
        path: "",
        element: <Navigate to="stages" replace />,
      },
    ],
  },
  {
    path: "/vacancies",
    element: <Vacancies />,
    children: [
      {
        path: "vacanciesBoard/:mode",
        element: <VacanciesBoard />,
      },
      // {
      //   path: "vacanciesGrid",
      //   element: <VacanciesGrid />,
      // },
      {
        path: "currentVacancies/:mode",
        element: <CurrentVacancies />,
      },
      {
        path: "requestedVacancies/:mode",
        element: <Requested />,
      },
      {
        path: "finishedVacancies/:mode",
        element: <Finished />,
      },
    ],
  },
  {
    path: "/candidates",
    element: <Candidates />,
    children: [
      {
        path: "candidatesBoard",
        element: <CandidatesBoard />,
      },
      {
        path: "currentCandidates",
        element: <CurrentCandidates />,
      },
      {
        path: "sharedToManager",
        element: <SharedToManager />,
      },
      {
        path: "candidatesDataBase",
        element: <CandidatesDataBase />,
      },
    ],
  },
  {
    path: "/candidateProfile/:vacancyID/:candidateID",
    element: <CandidateProfile />,
  },
  {
    path: "/careerChannel",
    element: <CareerChannel />,
  },
  // {
  //   path: "/test",
  //   element: <Test />,
  // },
].map((route) => ({ ...route, path: pathPrefix + route.path }));
