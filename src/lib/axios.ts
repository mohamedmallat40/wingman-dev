import { getUserLocale } from '@/i18n/locale';
import { addToast } from '@heroui/react';
import axios, { AxiosInstance } from 'axios'
import { ERRORS as en } from 'messages/en.json'
import { ERRORS as fr } from 'messages/fr.json'
import { ERRORS as nl } from 'messages/nl.json'

const locales = {
    en,
    fr,
    nl,
}
const resolveKey = (obj: any, key: string): string | undefined => {
    return obj[key]
}
export const t = (key: string, currentLocale: "en" | "fr" | "nl"): string => {
    const dictionary = locales[currentLocale] || {}
    return resolveKey(dictionary, key) ?? key
}

const wingManApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})
wingManApi.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})
wingManApi.interceptors.response.use(
    response => response,
    async (error: any) => {
        try {
            const locale: any = await getUserLocale();

            addToast({
                title: error.response?.data?.status ?? error?.status,
                description: t(error.response?.data?.message, locale) ?? error?.message,
                color: 'danger'

            });
            return Promise.reject(error)

        } catch (error) {
            console.log(error, "ddddd");

        }

    }
)

export default wingManApi
