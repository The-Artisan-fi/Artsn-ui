import { useQuery } from '@apollo/client';
import { GET_USER_DASHBOARD } from '../graphql/queries';

export const useUserDashboard = () => {
    return useQuery(GET_USER_DASHBOARD, {
      fetchPolicy: 'network-only', // This ensures we always fetch fresh data
      errorPolicy: 'all', // This will give us more control over error handling
    });
};