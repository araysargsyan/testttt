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
    sub: string;
    id: string;
    role: 'admin' | 'superAdmin';
    iat: number;
    exp: number;
    jti: string;
}

export interface IUserSession extends Pick<IUser, 'firstName' | 'lastName'>, IJwtPayload {
    [EAuthCookie.ACCESS]: string;
    [EAuthCookie.REFRESH]: string;
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

interface ITransaction {
    id?: string;
    updatedAt?:  Date | string | null;
    createdAt?:  Date | string | null;
    updatedBy?:  string | null;
    createdBy?: string | null;
    deletedAt?:  Date | string | null;

    status: 'pending' | 'completed' | 'failed';
    type: 'init' | 'retry' | 'refund' | 'cancel';
    amount: number;
    details: Record<string, any>;
    paymentId: string;
    providerOrderId: number;
    user?: IUser;
    // order?: any;
}

const OrderProcessStatus = {
    pending: 'pending',
    inProcess: 'inProcess',
    done: 'done',
} as const

const OrderProcessStepsStatus = {...OrderProcessStatus, blocked: 'blocked'}

export type TOrderProcessStepsStatus = keyof typeof OrderProcessStepsStatus


// export interface IInputsData {
//     startDate?: string/*Date*/;
//     dateAndTime?: string/*Date*/;
//     phoneNumber?: number;
//     deliveryAddress?: string;
//     "TIN number"?: number | null;
//     "Date of registration"?: string/*Date*/ | null;
//     "Government registration number"?: number | null;
// }

export type IInputsData = Record<string, { type: 'text' | 'number' | 'date', value: any}>


export interface IStaticData {
    info: string;
    title: string;
    startDate?: string/*Date*/;
}
export interface IProcessSteps {
    id: string;
    status: keyof typeof OrderProcessStepsStatus;
    step: number;
    inputsData: IInputsData,
    staticData: IStaticData,
    comment: string | null;
    documents: any[]
}
export interface IOrderProcess {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    status: keyof typeof OrderProcessStatus,
    name: string;
    processSteps: IProcessSteps[];
    users: any[];
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    },
    updatedBy: Date | null;
}

