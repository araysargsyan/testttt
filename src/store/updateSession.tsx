'use client';
import {
    createContext, FC, MutableRefObject, PropsWithChildren, useContext, useLayoutEffect, useRef
} from 'react';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

import { EAuthCookie } from '@/types/common';
import axiosAuth from '@/lib/axios';


function useUpdate() {
    const { update } = useSession();
    return (newData: Partial<User>) => {
        update(newData).then((data) => {
            console.log('useUpdateSession', data?.user[EAuthCookie.ACCESS]);
        }).catch((err) => {
            console.log('useUpdateSession: ERROR', err);
        });
    };
}


type TUpdateSessionContext = MutableRefObject<ReturnType<typeof useUpdate>>;
const UpdateSessionContext = createContext<TUpdateSessionContext>(null as never);

export const UpdateSessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const updateSession = useUpdate();
    const updateRef = useRef<typeof updateSession | null>(null);
    updateRef.current = updateSession;
    axiosAuth.updateSession = updateRef;

    return (
        <UpdateSessionContext.Provider value={ updateRef as TUpdateSessionContext }>
            { children }
        </UpdateSessionContext.Provider>
    );
};
export const useUpdateSession = () => {
    return useContext(UpdateSessionContext);
};
