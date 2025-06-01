import { queryOptions } from '@tanstack/react-query'
import { getMyProfile } from '@root/modules/profile/services/profile.service'

export const profileOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: getMyProfile
})
