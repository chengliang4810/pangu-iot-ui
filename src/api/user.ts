import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import {CaptchaData, UserState} from '@/store/modules/user/types';

export interface LoginData {
  username: '',
  password: '',
  code: '',
  uuid:''
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginData>('/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/auth/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/system/user/getInfo');
}

export function verificationCode() {
  return axios.get<CaptchaData>('/code');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/system/user/menu');
}
