import { type ReactNode } from 'react';

import SidebarMenu from '@/components/SidebarMenu/SidebarMenu';
import axios from '@/lib/axios';


// export const dynamic = 'force-dynamic';
// export const fetchCache = 'auto';
// export const revalidate = 14;
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
