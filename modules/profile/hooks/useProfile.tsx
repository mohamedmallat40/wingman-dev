'use-client'
import { profileOptions } from '@root/modules/profile/hooks/profile.server';
import { getMyProfile } from '@root/modules/profile/services/profile.service'
import { IUserProfile } from '@root/modules/profile/types'
import { useQuery } from '@tanstack/react-query'

const useProfile = () => {
    const { data,error,isLoading } = useQuery(profileOptions);

    const logout= () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }
    return {
        profile: data?.data,
        isLoading,
        error,
        logout
    }

}

export default useProfile