import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import {Message, Modal} from '@arco-design/web-vue';
import {useUserStore} from '@/store';
import {getToken} from '@/utils/auth';

export interface HttpResponse<T = unknown> {
    status: number;
    msg: string;
    code: number;
    data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // let each request carry token
        // this example using the JWT token
        // Authorization is a custom headers key
        // please modify it according to the actual situation
        const token = getToken();
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // do something
        return Promise.reject(error);
    }
);
// add response interceptors
axios.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
        console.log("请求比较： " ,res.code !== 200, res.code, response.data)
        if (res.code !== 200 && res.code !== 20000) {
            Message.error({
                content: res.msg || 'Error',
                duration: 5 * 1000,
            });
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (
                [500, 401, 50014].includes(res.code) &&
                response.config.url !== '/auth/user/logout'
            ) {
                Modal.error({
                    title: '提示信息',
                    content: "登录信息已失效，请重新登录",
                    okText: '确认',
                    async onOk() {
                        const userStore = useUserStore();

                        await userStore.logout();
                        window.location.reload();
                    },
                });
            }
            return Promise.reject(new Error(res.msg || 'Error'));
        }
        return res;
    },
    (error) => {
        Message.error({
            content: error.msg || 'Request Error',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);
