import { signOut } from 'next-auth/react';

import { EAuthCookie } from '@/types/common';


export default function logout() {
    signOut({ callbackUrl: '/login' }).then(() => {
        localStorage.removeItem(EAuthCookie.ACCESS);
    });
}
