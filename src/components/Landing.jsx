import '../css/landing.css';
import main from '../assets/LandImg.png';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    return(
        <div className="landing">
                <span className="left">
                    <div className="caption1">
                        <hr />
                        <h4>WE ARE SANJIVANI NGO</h4>
                    </div>
                    <div className="titles">
                        <div className="caption2">
                            <p>At <span>Sanjivani,</span> we work towards the betterment of our <span>world</span> </p>
                        </div>
                        <div className="caption3">
                            <p>Bring out the change in society by spreading hands to help the unprivileged children and other backward communities.</p>
                        </div>
                        <div className="btns">
                            <button onClick={() => window.open("https://swd.vit.edu/", "_blank", "noopener noreferrer")} type="button" className="btn btn-outline-info">Know More</button>
                            <button type="button" className="btn btn-success" onClick={()=>navigate("/donate")}>DONATE</button>
                        </div>
                    </div>

                </span>
                <span className="right">
                    <img src={main} alt="Smiling Faces" />
                </span>
            </div>
    );
}