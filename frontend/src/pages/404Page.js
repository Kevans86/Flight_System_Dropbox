
import './PagesCss/404.css';
import clouds from '../pages/PagesCss/Images/clouds.png'


const NotFound = () => {

return (
    <div className="wrapper-404">
    <div className="text_group">
        <p className="text_404">404</p>
        <p className="text_lost">The page you are looking for <br />has been lost among the clouds.</p>
    </div>
    <div className="window_group">
        <div className="window_404">
                <img id="clouds" src={clouds} alt="clouds"/>

        </div>
    </div>
    </div>
    )
}

export default NotFound

