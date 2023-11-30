import {
    AuthGetApi, IAuthGetApiReturn 
} from '@/lib/fetchApi';
import OrderProcessCard from '@/components/OrderProcess/OrderProcessCard';
import {
    EAuthCookie, IOrderProcess 
} from '@/types/common';
import { SingleOrderProcessProvider } from '@/store/singlOrderProcess';
import UpdateAccessToken from '@/lib/UpdateAccessToken';


interface IOrderProcessProps {
    id: string;
}

async function SingleOrderProcessContainer({ id }: IOrderProcessProps) {
    let isRefreshDie = false;
    const {
        data, newAccessToken, session 
    } = await AuthGetApi<IOrderProcess>(`/order-process/${id}`).then((response) => {
        console.log('SingleOrderProcessContainer: RESPONSE: data', { [`/order-process/${id}`]: response.data });
        console.log('SingleOrderProcessContainer: RESPONSE: newAccessToken', { [`/order-process/${id}`]: response.newAccessToken });
        console.log('SingleOrderProcessContainer: RESPONSE: session', { [`/order-process/${id}`]: response.session });
        return response;
    }).catch(e => {
        console.log('SingleOrderProcessContainer: ERROR', e);
        if (e.message === 'refreshDie') {
            isRefreshDie = true;
        }
        return {} as IAuthGetApiReturn<IOrderProcess>;
    });

    return (
        <SingleOrderProcessProvider payload={{
            data, error: '' 
        }}
        >
            <UpdateAccessToken
                newAccessToken={ newAccessToken }
                oldAccessToken={ session?.user[EAuthCookie.ACCESS] }
                isRefreshDie={ isRefreshDie }
            >
                <OrderProcessCard
                    title={ data.name }
                />
            </UpdateAccessToken>
        </SingleOrderProcessProvider>
    );
}

export default SingleOrderProcessContainer;
