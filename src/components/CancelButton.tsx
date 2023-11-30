import React, { useState } from 'react';
import {
    Button, Input 
} from 'antd';


const App: React.FC = () => {
    const [ showInput, setShowInput ] = useState<boolean>(false);
    const [ inputValue, setInputValue ] = useState<string>('');

    const handleButtonClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        setShowInput(false);
    };

    return (
        <div>
            <Button
                onClick={ handleButtonClick }
                style={{
                    color:'red', fontWeight:'bold' 
                }}
            >X
            </Button>
            { showInput && (
                <div>
                    <Input
                        style={{
                            width:'400px', height:'100px' 
                        }}
                        value={ inputValue }
                        onChange={ handleInputChange }
                        onBlur={ handleInputBlur }
                        onPressEnter={ handleInputBlur }
                    />
                </div>
            ) }
        </div>
    );
};

export default App;
