import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
// import dataProvider from "@refinedev/simple-rest";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import {
  AlignVerticalDistributeStart,
  BookOpen,
  GraduationCap,
  Home,
} from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/subjectslist";
import SubjectsCreate from "./pages/subjects/create";
import SessionsList from "./pages/classes/list";
import ClassesShow from "./pages/classes/show";
import ClassesCreate from "./pages/classes/create";
import EditSession from "./pages/classes/edit";
import CoursesList from "./pages/courses/list";
import CoursesCreate from "./pages/courses/create";
import CoursesEdit from "@/pages/courses/edit";
import BatchesCreate from "./pages/batches/create";
import BatchesManage from "./pages/batches/manage";
import BatchesEdit from "@/pages/batches/edit";
// import { API_URL } from "@/providers/constants";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "F9fF6R-sQfDl3-Eid1gY",
                title: {
                  text: "Anahanad Studio",
                },
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "subjects/create", //Create sub routes
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "classes/create", //Create sub routes
                  show: "classes/show/:id", // Display a selected session's details
                  edit: "classes/edit/:id",
                  meta: { label: "Classes", icon: <GraduationCap /> },
                },
                {
                  name: "courses",
                  list: "/courses",
                  create: "courses/create",
                  edit: "/courses/edit/:id",
                  meta: { label: "Courses", icon: <BookOpen /> },
                },
                {
                  name: "batches",
                  list: "/batches/manage",
                  create: "batches/create",
                  meta: {
                    label: "Batches",
                    icon: <AlignVerticalDistributeStart />,
                  },
                },
              ]}
            >
              {/* Wrapping up all routes inside it */}
              <Routes>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  {/* DASHBOARD ROUTE */}
                  <Route path="/" element={<Dashboard />} />
                  {/* SUBJECT ROUTE */}
                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                  </Route>
                  {/* CLASSES ROUTE */}
                  <Route path="classes">
                    <Route index element={<SessionsList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                    <Route path="edit/:id" element={<EditSession />} />
                  </Route>
                  {/* COURSES ROUTE */}
                  <Route path="courses">
                    <Route index element={<CoursesList />} />
                    <Route path="create" element={<CoursesCreate />} />
                    <Route path="edit/:id" element={<CoursesEdit />} />
                  </Route>
                  {/* BATCHES ROUTE */}
                  <Route path="batches">
                    <Route path="create" element={<BatchesCreate />} />
                    <Route index path="manage" element={<BatchesManage />} />
                    <Route path="edit/:id" element={<BatchesEdit />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
