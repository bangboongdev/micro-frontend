import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import Error404View from "../views/Error404View.vue";
import Index from "../views/Index.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: {
                requiresAuth: false,
                title: 'Login'
            },
        },
        {
            path: '/',
            name: '',
            component: Index,
            meta: {
                requiresAuth: true,
                title: "InsureM"
            },
            children: [
                {
                    path: ':pathMatch(.*)*',
                    name: '*',
                    component: Error404View,
                    meta: {
                        requiresAuth: false,
                    }
                },
            ]
        },
    ]
})
export default router;
