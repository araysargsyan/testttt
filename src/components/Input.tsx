//inputy stanalu type  lable value  u stanaluya onchange function
import React from 'react';
import { Input } from 'antd';


export default function CustomInput(props: {
    type?: string;
    label?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const {
        type = 'text',
        label = '',
        value = '',
        onChange
    } = props;

    return (
        <div>
            <Input
                type={ type }
                placeholder={ label }
                value={ value }
                onChange={ onChange }
            />
        </div>
    );
}
