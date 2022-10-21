import imgSvg from '../../assets/logo.svg';

export default function Header() {
    return (
        <header class="header">
            <div>
                <img src={imgSvg} alt="" />
            </div>
        </header>
    )
}