import {
    UserOutlined,
    TransactionOutlined,
    OrderedListOutlined,
    TeamOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { type ReactNode } from 'react';


export const ProtectedPages = {
    main: '/',
    users: '/users',
    admins: '/admins',
    orderProcess: '/order-process',
    transactions: '/transactions'
} as const;

export interface ISideBarMenuOptions {
    path: string;
    name: string;
    icon: ReactNode;
}

export const Providers = {
    admins: 'admins',
    users: 'users',
    transactions: 'transactions',
    orderProcess: 'orderProcess',
} as const;


export const sideBarMenuOptions: Array<ISideBarMenuOptions> = [
    {
        name: 'Dashboard',
        path: ProtectedPages.main,
        icon: <DashboardOutlined />
    },
    {
        name: 'Users',
        path: ProtectedPages.users,
        icon: <UserOutlined />
    },
    {
        name: 'Admins',
        path: ProtectedPages.admins,
        icon: <TeamOutlined />
    },
    {
        name: 'Order Process',
        path: ProtectedPages.orderProcess,
        icon: <OrderedListOutlined />
    },
    {
        name: 'Transactions',
        path: ProtectedPages.transactions,
        icon: <TransactionOutlined />
    }
];
export const fakeUsers = [
    {
        id: '635e1d61-543b-49ac-90e4-f7d129dc343f',
        email: 'john.doe@example.com',
        phone: null,
        username: 'johnnie',
        firstName: 'John',
        lastName: 'Doe'
    },
    {
        id: '635e1d61-543b-49ac-90e4-f7d12asd9dc343f',
        email: 'josadhn.doe@example.com',
        phone: null,
        username: 'johnnasdie',
        firstName: 'Jasdohn',
        lastName: 'Dasdoe'
    }
];
