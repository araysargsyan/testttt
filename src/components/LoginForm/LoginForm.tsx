'use client';
import {
    FC, useCallback, useLayoutEffect, useRef, useState
} from 'react';
import {
    LockOutlined, UserOutlined
} from '@ant-design/icons';
import {
    Alert, Button, Checkbox, Form, type FormInstance, Input
} from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { ProtectedPages } from '@/constants';
import {
    EAuthCookie, IUserLogin
} from '@/types/common';
import setAccessToken from '@/lib/util/setAccessToken';

import styles from './Login.module.scss';


const LoginForm: FC = () => {
    const formRef = useRef<FormInstance | null>(null);
    const [ loginError, setLoginError ] = useState('');
    const router = useRouter();

    useLayoutEffect(() => {
        if (localStorage.getItem(EAuthCookie.ACCESS)) {
            localStorage.removeItem(EAuthCookie.ACCESS);
        }
    }, []);

    const onFinish = useCallback(async (value: IUserLogin) => {
        try {
            const res = await signIn('credentials', {
                username: value.username,
                password: value.password,
                remember: value.remember,
                // callbackUrl: ProtectedPages.main,
                redirect: false
            });

            if (res?.ok) {
                setAccessToken();
                router.replace(ProtectedPages.main);
            } else {
                if (res?.status === 401) {
                    setLoginError('Wrong username or password!');
                } else {
                    setLoginError('Something went wrong, please try later!');
                }
            }
        } catch (e) {
            console.log('onFinish: ERROR', e);
            setLoginError('Something went wrong, please try later!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={ styles.loginContainer }>
            <div className={ styles.loginItem }>
                <Form
                    name="normal_login"
                    className="loginForm"
                    ref={ formRef }
                    initialValues={{ remember: true }}
                    onFinish={ onFinish }
                >
                    <Form.Item
                        name="username"
                        rules={ [ {
                            required: true, message: 'Please input your Username!'
                        } ] }
                    >
                        <Input
                            className={ styles.loginInput }
                            prefix={ <UserOutlined className="site-form-item-icon" /> }
                            placeholder="Username"
                            name="Username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={ [ {
                            required: true, message: 'Please input your Password!'
                        } ] }
                    >
                        <Input
                            className={ styles.loginInput }
                            prefix={ <LockOutlined className="site-form-item-icon" /> }
                            type="password"
                            placeholder="Password"
                            name="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox name="Remember">Remember me</Checkbox>
                        </Form.Item>

                        <a
                            className="login-form-forgot"
                            href=""
                        >
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={ styles.loginFormButton }
                        >
                            Log in
                        </Button>
                    </Form.Item>
                    { loginError && (
                        <Alert
                            message={ loginError }
                            type="error"
                            showIcon
                        />
                    ) }
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;
