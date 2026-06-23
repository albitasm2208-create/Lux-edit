import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./components/Landing.jsx";
import Quiz from "./components/Quiz.jsx";
import Login from "./components/Login.jsx";
import AccountLayout from "./components/AccountLayout.jsx";
import AccountOverview from "./components/AccountOverview.jsx";
import { AccountCapsules } from "./components/AccountCapsules.jsx";
import AccountMembership from "./components/AccountMembership.jsx";
import AccountFitting from "./components/AccountFitting.jsx";
import AccountReturns from "./components/AccountReturns.jsx";
import AccountTradeIn from "./components/AccountTradeIn.jsx";
import AccountAlterations from "./components/AccountAlterations.jsx";
import ConciergeEvents from "./components/ConciergeEvents.jsx";
import AdminLayout, { AdminReviewQueue, AdminProducts, AdminOrders, AdminConsults } from "./components/AdminPortal.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { C } from "./lib/colors.js";
import { track } from "./lib/analytics.js";
import "./styles/luxe-edit.css";

const Reveal = lazy(() => import("./components/Reveal.jsx"));
const RevealApprove = lazy(() => import("./components/RevealApprove.jsx"));
const Membership = lazy(() => import("./components/Membership.jsx"));
const MembershipCheckout = lazy(() => import("./components/MembershipCheckout.jsx"));
const StylistChat = lazy(() => import("./components/StylistChat.jsx"));

function Loading() {
  return <div className="le-loading le-serif">Loading…</div>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const { reduced } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    track("pageview", { path: pathname });
  }, [pathname, reduced]);

  return null;
}

function ProfileLoader() {
  const { setAnswers } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const profile = params.get("profile");
    if (profile && location.pathname === "/reveal") {
      try {
        const padded = profile + "=".repeat((4 - (profile.length % 4)) % 4);
        const answers = JSON.parse(atob(padded));
        setAnswers(answers);
      } catch {
        navigate("/quiz");
      }
    }
  }, [location.search, location.pathname, setAnswers, navigate]);

  return null;
}

function AppShell() {
  return (
    <div
      className="le-app"
      style={{
        "--le-ink": C.ink,
        "--le-stone": C.stone,
        "--le-taupe": C.taupe,
        "--le-paper": C.paper,
        "--le-ivory": C.ivory,
        "--le-gold": C.gold,
        "--le-line": C.line,
      }}
    >
      <ScrollToTop />
      <ProfileLoader />
      <Nav />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/reveal" element={<Reveal />} />
          <Route path="/reveal/approve" element={<RevealApprove />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/membership/checkout" element={<MembershipCheckout />} />
          <Route path="/stylist" element={<StylistChat />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="capsules" element={<AccountCapsules />} />
            <Route path="membership" element={<AccountMembership />} />
            <Route path="fitting" element={<AccountFitting />} />
            <Route path="returns" element={<AccountReturns />} />
            <Route path="trade-in" element={<AccountTradeIn />} />
            <Route path="alterations" element={<AccountAlterations />} />
            <Route path="events" element={<ConciergeEvents />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminReviewQueue />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="consults" element={<AdminConsults />} />
          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default function TheLuxeEdit() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  );
}
