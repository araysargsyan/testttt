import { type ReactNode } from 'react';

import SidebarMenu from '@/components/SidebarMenu/SidebarMenu';


const WorkspaceLayout = ({ children }: {
    children: ReactNode;
}) => {
    return (
        <section>
            <SidebarMenu>
                { children }
            </SidebarMenu>
        </section>
    );
};

export default WorkspaceLayout;
