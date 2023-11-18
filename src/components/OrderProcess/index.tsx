import { AuthGetApi } from '@/lib/fetchApi';
import OrderProcessCard from '@/components/OrderProcess/OrderProcessCard';
import { IOrderProcess } from '@/types/common';
import { OrderProcessProvider } from '@/store/orderProcess';


interface IOrderProcessProps {
    id: string;
}

async function OrderProcess({ id }: IOrderProcessProps) {
    const data = await AuthGetApi<IOrderProcess, true>(`/order-process/${id}`).catch(e => {
        console.log('OrderProcess: ERROR', e);
        return {} as IOrderProcess;
    });

    console.log('OrderProcess', data);

    return (
        <OrderProcessProvider payload={{ data, error: '' }}>
            <OrderProcessCard
                // data={ data.processSteps }
                title={ data.name }
            />
        </OrderProcessProvider>
    );
}

export default OrderProcess;
