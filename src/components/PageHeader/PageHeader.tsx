import { FC } from 'react';

import AddButton from '@/components/Buttons/AddButton';


const PageHeader: FC<{title: string}> = ({ title }) => {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between' 
        }}
        >
            <h1>{ title }</h1>
            <AddButton />
        </div>
    );
};

export default PageHeader;
