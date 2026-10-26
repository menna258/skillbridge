import { Route, Routes } from 'react-router-dom'
import Layout, { GuestOnly, RequireAuth } from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Assessment from './pages/Assessment'
import Roadmap from './pages/Roadmap'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Jobs from './pages/Jobs'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="signup" element={<GuestOnly><Signup /></GuestOnly>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
