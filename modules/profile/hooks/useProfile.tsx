import { getMyProfile } from '@root/modules/profile/services/profile.service'
import { IUserProfile } from '@root/modules/profile/types'
import { useQuery } from '@tanstack/react-query'

const useProfile = () => {
    const {data,error,isLoading } = useQuery<{data:IUserProfile}>({
        queryKey: ['profile'],
        queryFn: getMyProfile
    })
    return {
        profile: data?.data,
        isLoading,
        error
    }

}

export default useProfile