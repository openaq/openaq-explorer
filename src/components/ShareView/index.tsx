
import styles from './ShareView.module.scss'


interface UserAccessDefintion {
    name: string;
    email: string;
    access: string;

}

function UserAccess(props: UserAccessDefintion) {


    return(
        <li>
            <div>
                <span></span>
                <span></span>
            </div>
            <div>
                <select name="" id="">
                    <option value="">Viewer</option>
                    <option value="">Editor</option>
                    <option value="">Transfer Ownership</option>
                    <option value="">Remove access</option>
                </select>
                <button>Resend invite</button>
            </div>
        </li>
    )
}


export function ShareView() {


    return (<div class={styles['share-view']}>
        <section class={styles['users-access-section']}>
            <h3>People with access</h3>
            <ul class={styles['users-list']}>
                <li>Russ Biggs</li>
            </ul>
            <form action="" class={styles['add-person-form']}>
                <input type="email" placeholder="Enter email address" />
                <button type="submit">Add Person</button>
            </form>
        </section>
        <section class={styles['list-access-section']}>
        <h3>Access</h3>
        <div>
            <form action="">
                <input type="radio" name="" id="" />
                <label for=""><span>Restricted.</span>Only people who have been given Editor or Viewer roles can access the list.</label>
                <input type="radio" name="" id="" />
                <label for=""><span>Public.</span> Anyone with the link can view the list.</label>
            </form>
            </div>
        </section>

        <section class={styles['link-section']}>
        <h3>Link</h3>

        <div>
            <input type="text" />
            <button>Copy</button>
        </div>
        </section>


    </div>)
}