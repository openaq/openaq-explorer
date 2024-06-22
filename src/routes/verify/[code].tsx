
import { createAsync, useParams } from '@solidjs/router';
import {verify} from '~/db';

export const route = {
    load: ({params}) => verify(params.code)
}


export default function Verify() {
    const {code} = useParams();
    createAsync(() => verify(code));

    return (
        <>
        </>
    )


}