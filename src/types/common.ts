//! AUTH

export enum EAuthCookie {
    ACCESS = 'accessToken',
    REFRESH = 'refreshToken',
}

export interface IUser {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    email: string;
    phone: string | null;
    username: string;
    firstName: string;
    lastName: string;
    identifier: string | null;
    blockedAt: Date | null;
}

export interface IJwtPayload {
    id: string;
    role: 'admin' | 'superAdmin';
    exp: number;
    iat: number;
    jti: string;
    sub: string;
}

export interface IUserSession extends Pick<IUser, 'firstName' | 'lastName'>, IJwtPayload {
    [EAuthCookie.ACCESS]: string;
    [EAuthCookie.REFRESH]: string;
    maxAge: number;
    _v: string;
}

export interface IUserLogin {
    remember: boolean;
    username: string;
    password: string;
}

//! DATA
export interface IResponsePayload<T> {
    result: T;
    count?: number;
}

const OrderProcessStatus = {
    pending: 'pending',
    inProcess: 'inProcess',
    done: 'done',
} as const;

const OrderProcessStepsStatus = { ...OrderProcessStatus, blocked: 'blocked' };

export type TOrderProcessStepsStatus = keyof typeof OrderProcessStepsStatus;

export type IInputsData = Record<string, { type: 'text' | 'number' | 'date'; value: any }>;


export interface IStaticData {
    info: string;
    title: string;
    startDate?: string/*Date*/;
}

export interface IProcessSteps {
    id: string;
    status: keyof typeof OrderProcessStepsStatus;
    step: number;
    inputsData: IInputsData;
    staticData: IStaticData;
    comment: string | null;
    documents: any[];
}

export interface IOrderProcess {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    status: keyof typeof OrderProcessStatus;
    name: string;
    processSteps: IProcessSteps[];
    users: any[];
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
    updatedBy: Date | null;
}

