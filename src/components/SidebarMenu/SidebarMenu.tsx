'use client';
import React, {
    createElement,
    useState,
    memo,
    useCallback,
    type FC,
    type PropsWithChildren, useEffect, useLayoutEffect,
} from 'react';
import Link from 'next/link';
import {
    Button, Layout, Menu
} from 'antd';
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import {
    sideBarMenuOptions, type ISideBarMenuOptions, SidebarLocalStorageKey
} from '@/constants';


import styles from './SidebarMenu.module.scss';


const {
    Header, Sider, Content
} = Layout;


// eslint-disable-next-line react/display-name
const Label = memo(({ item }: { item: ISideBarMenuOptions }) => {
    return (
        <Link
            prefetch={ false }
            href={ item.path }
        >
            { item.name }
        </Link>
    );
});

const SidebarMenu: FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname() || '/';
    const [ collapsed, setCollapsed ] = useState(false);

    useLayoutEffect(() => {
        const localStorageCollapsed = localStorage.getItem(SidebarLocalStorageKey) === 'true';
        if (localStorageCollapsed !== collapsed) {
            setCollapsed(localStorageCollapsed);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem(SidebarLocalStorageKey, String(collapsed));
    }, [ collapsed ]);

    const generateSidebarMenuItems = useCallback((options: Array<ISideBarMenuOptions>) => {
        return options.map((option) => ({
            key: option.path,
            icon: option.icon,
            label: (
                <Label
                    key={ option.path }
                    item={ option }
                />
            ),
        }));
    }, []);

    return (
        <Layout className="layout">
            <Sider
                trigger={ null }
                theme="light"
                collapsible
                collapsed={ collapsed }
            >
                <div className={ styles.sidebar }>
                    <div className={ styles['menu-wrapper'] }>
                        <div className={ 'logoMy' }>
                            {
                                collapsed ? (
                                    <Image
                                        priority={ true }
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                        width={ 0 }
                                        height={ 0 }
                                        src="/logo.svg"
                                        alt="Logo"
                                    />
                                ) : (
                                    <Image
                                        priority={ true }
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                        width={ 0 }
                                        height={ 0 }
                                        src="/layer.svg"
                                        alt="Layer"
                                    />
                                )
                            }
                        </div>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={ [ pathname ] }
                            items={ generateSidebarMenuItems(sideBarMenuOptions) }
                        />
                    </div>
                    <div
                        className={ styles.logout }
                        onClick={ () => signOut({ callbackUrl: '/login' }) }
                    >
                        { collapsed ? <LogoutOutlined /> : (
                            <Button style={{ maxWidth: 100 }}>
                                Sign Out
                            </Button>
                        ) }
                    </div>
                </div>
            </Sider>
            <Layout className="site-layout">
                <div style={{
                    display: 'flex', width: '100%'
                }}
                >
                    <Header
                        className="site-layout-background"
                        style={{
                            padding: 0, display: 'flex', width: '100%'
                        }}
                    >
                        { createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        }) }
                    </Header>
                </div>
                <Content
                    className="site-layout-background scroll"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        height: '720px',
                    }}
                >
                    { children }
                </Content>
            </Layout>
        </Layout>
    );
};

export default SidebarMenu;
