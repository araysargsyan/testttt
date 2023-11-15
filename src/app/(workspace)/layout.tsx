import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import {ReactNode} from "react";

const WorkspaceLayout = ({children}: {
    children: ReactNode
}) => {
    return (
        <section>
            <SidebarMenu>
                {children}
            </SidebarMenu>
        </section>
    )
};

export default WorkspaceLayout;
