import { useLayoutEffect } from 'react';

import { EAuthCookie } from '@/types/common';
import { useUpdateSession } from '@/store/updateSession';


export default function useUpdateAccessTokenAfterUnmount() {
    const { current: updateSession } = useUpdateSession();

    useLayoutEffect(() => {
        return () => {
            const localAccessToken = localStorage.getItem(EAuthCookie.ACCESS);
            localAccessToken && updateSession({ [EAuthCookie.ACCESS]: localAccessToken });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
