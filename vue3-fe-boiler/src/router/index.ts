import routes from "./routes";

import { createWebHistory, createRouter } from "vue-router";
const router = createRouter({
  history: createWebHistory("main"),
  routes,
  linkActiveClass: "active",
});
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    // document.title   = nearestWithTitle.meta.title;
  }

  next();
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    // NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  // NProgress.done();
});

export default router;
