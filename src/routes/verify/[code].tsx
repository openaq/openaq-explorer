
import {verify} from '~/db';

export const route = {
    load: ({params}) => verify(params.code)
}


export default function Verify() {


    return (
        <>
        </>
    )


}