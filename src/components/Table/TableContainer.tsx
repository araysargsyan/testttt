import {AuthGetApi} from "@/lib/fetchApi";
import {Table} from "./Table";
import TableHead from "@/components/Table/TableHead";

async function TableContainer({
    dataUrl,
    ignoreColumns = [],
    isRowClickable = false
}: { dataUrl: string; ignoreColumns?: string[], isRowClickable?: boolean }) {
    const data = await AuthGetApi(dataUrl).then((response) => {
        console.log('TableContainer: RESPONSE', {[dataUrl]: response.count})
        console.log('TableContainer: RESPONSE_DATA', {[dataUrl]: response.result})
        return response.result
    }).catch(e => {
        console.log('TableContainer: ERROR', e)
        return []
    })

    const columns = Object.keys(data[0])
        .filter((k) => k !== 'id' && !ignoreColumns.includes(k))

    return (
        <>
            {/*<TableHead columns={columns}/>*/}
            <Table
                dataUrl={dataUrl}
                data={data}
                columns={columns}
                isRowClickable={isRowClickable}
            />
        </>
    )
}

export default TableContainer;
