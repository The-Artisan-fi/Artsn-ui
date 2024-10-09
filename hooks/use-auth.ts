import { useState, useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';


const ME_QUERY = gql`
  query Me {
    me {
      _id
      email
      username
      uuid
    }
  }
`;

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    checkAuth().then(
      () => console.log('Auth check complete')
    )
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Checking auth with token:', token);
    if (token) {
      try {
        const { data } = await client.query({
          query: ME_QUERY,
          context: {
            headers: {
              authorization: `Bearer ${token}`
            }
          },
          fetchPolicy: 'network-only'
        });
        setUser(data.me);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setUser(userData);
    client.resetStore();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    client.resetStore();
    // router.push('/login');
  };

  return { user, loading, login, logout, checkAuth };
}