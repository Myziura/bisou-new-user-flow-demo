import { createRouter, createWebHistory } from "vue-router";
import { flowState } from "../composables/useFlowState";

const routes = [
  { path: "/", redirect: "/splash" },
  {
    path: "/splash",
    name: "splash",
    component: () => import("../views/onboarding/SplashView.vue"),
  },
  {
    path: "/hook",
    name: "hook",
    component: () => import("../views/onboarding/HookView.vue"),
  },
  {
    path: "/birth-details",
    name: "birth-details",
    component: () => import("../views/onboarding/BirthDetailsView.vue"),
  },
  { path: "/birth-date", redirect: "/birth-details" },
  { path: "/birth-place", redirect: "/birth-details" },
  { path: "/micro-reveal", redirect: "/signup" },
  {
    path: "/scanning",
    name: "scanning",
    component: () => import("../views/onboarding/ScanningView.vue"),
  },
  { path: "/reveal", redirect: "/signup" },
  { path: "/reveal-notify", redirect: "/notifications" },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/onboarding/SignupWallView.vue"),
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("../views/onboarding/SignInView.vue"),
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("../views/onboarding/EmailVerifyView.vue"),
  },
  {
    path: "/almost-there",
    name: "almost-there",
    component: () => import("../views/onboarding/AlmostThereView.vue"),
  },
  {
    path: "/attribution",
    name: "attribution",
    component: () => import("../views/onboarding/AttributionView.vue"),
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("../views/onboarding/NotificationsView.vue"),
  },
  {
    path: "/today",
    name: "today",
    component: () => import("../views/TodayPage.vue"),
  },
  {
    path: "/connect",
    name: "connect-intro",
    component: () => import("../views/connect/ConnectIntroView.vue"),
  },
  { path: "/connect/intent", redirect: "/connect/setup?step=intent" },
  {
    path: "/connect/setup",
    name: "connect-setup",
    component: () => import("../views/connect/ConnectSetupView.vue"),
  },
  {
    path: "/connect/profile",
    name: "connect-profile",
    component: () => import("../views/connect/ConnectProfileView.vue"),
  },
  {
    path: "/connect/swipe",
    name: "connect-swipe",
    component: () => import("../views/connect/ConnectSwipeView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfilePage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  if (to.path === "/splash" || to.path === "/") return true;

  if (flowState.onboardingComplete && to.path.startsWith("/hook")) {
    return "/today";
  }
  return true;
});

export default router;
