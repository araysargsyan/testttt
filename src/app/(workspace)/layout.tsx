import { type ReactNode } from 'react';

import SidebarMenu from '@/components/SidebarMenu/SidebarMenu';


// export const dynamic = 'force-dynamic';
// export const fetchCache = 'auto';
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
