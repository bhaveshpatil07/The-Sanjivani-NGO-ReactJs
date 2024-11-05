import '../css/donate.css';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import BackToTop from "../components/BackToTop";
import PageHeader from '../components/PageHeader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Donate() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recentLogin, setRecentLogin] = useState("");
    const [amount, setAmount] = useState(100);
    const [showPopup, setShowPopup] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("NGO");
        if (loggedInUser) {
            setIsLogin(true);
            setShowPopup(false);
            setShowLogin(true);
            setPassword(loggedInUser);
            setEmail(atob(loggedInUser).split(':').at(0));
            fetchRecentLogin(loggedInUser, atob(loggedInUser).split(':').at(0));
        } else {
            setIsLogin(false);
        }
    }, []);


    const fetchRecentLogin = async (auth, mail) => {
        var options = {
            method: 'GET',
            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/registration/getLogs?email=' + mail,
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
        };
        await axios.request(options)
            .then((response) => { setRecentLogin(response.data);})
            .catch(() => { localStorage.removeItem('NGO'); alert("Server Authentication Failed!\nLogin Again."); window.location.reload(); });
    };

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const loading = MySwal.fire({
                title: 'Initializing payment.',
                text: "Don't close or refresh the tab. Please Wait...",
                didOpen() {
                    MySwal.showLoading()
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
            var result = {};
            var options = {
                method: 'POST',
                url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/donate/pay',
                headers: {
                    Authorization: `Basic ${password}`,
                    'Content-Type': 'application/json'
                },
                data: { name: name, amount: amount },
            };

            await axios.request(options)
                .then(response => {
                    result = response.data;
                }).catch(error => {
                    console.error(error);
                    MySwal.fire({
                        title: "Server Error!",
                        text: "Check Your Internet. Are you online?",
                        icon: "question"
                    }).then(() => { return; });
                });
            try {
                const res = await loadScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );

                if (!res) {
                    MySwal.fire({
                        title: "Check Your Internet!",
                        text: "Razorpay SDK failed to load. Are you online?",
                        icon: "question"
                    }).then(() => { return; });

                }

                var get_razKey = {
                    method: 'GET',
                    url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/donate',
                    headers: {
                        Authorization: `Basic ${password}`,
                        'Content-Type': 'application/json'
                    },
                };
                const { data: { key } } = await axios.request(get_razKey).catch(() => { localStorage.removeItem('NGO'); alert("Server Authentication Failed!\nLogin Again."); window.location.reload(); });
                const { amount, id: order_id, currency } = result;

                const options = {
                    key,
                    amount: amount.toString(),
                    currency,
                    name: "The Sanjivani NGO :)",
                    description: "Donation for Sanjivani Charity purpose.",
                    image: "https://i.ibb.co/pWxpKHz/checkout.jpg",
                    order_id: order_id,
                    handler: async function (response) {
                        const data = {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        };

                        var options = {
                            method: 'POST',
                            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/donate/pay/verify',
                            headers: {
                                Authorization: `Basic ${password}`,
                                'Content-Type': 'application/json'
                            },
                            data,
                        };

                        await axios.request(options)
                            .then(response => {
                                if (response.data === "updated") {
                                    MySwal.fire({
                                        icon: "success",
                                        title: "Payment Captured Successfully!",
                                        text: "Your PaymentId: " + data.paymentId
                                    }).then(() => { return; });
                                } else {
                                    MySwal.fire({
                                        icon: "error",
                                        title: "Failed to Capture Payment!",
                                        text: "Your PaymentId: " + data.paymentId + "\n" + response.data
                                    }).then(() => { return; });
                                }
                            }).catch(error => {
                                console.error(error);
                                MySwal.fire({
                                    title: "Failed!",
                                    text: "Unable to capture your payment!",
                                    icon: "error"
                                }).then(() => { return; });
                            });
                    },
                    prefill: {
                        name: name,
                        email: email,
                    },
                    theme: {
                        color: "#010457",
                    },
                };

                const paymentObject = new window.Razorpay(options);
                loading.close();
                paymentObject.open();
                paymentObject.on("payment.failed", (response) => {
                    console.log(response);
                    // MySwal.fire({
                    //     icon: "error",
                    //     title: "Oops payment failed...",
                    //     text: "Something went wrong!",
                    // });
                })
            } catch (error) {
                console.error("Error in checkoutHandler:", error);
            }


        } else {
            setShowPopup(true);
        }
    };
    const handleEmail = async () => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(String(email).toLowerCase())) {
            const url = "https://the-sanjivani-ngo-server.onrender.com/api/v1/registration?email=" + String(email).toLowerCase();
            await axios.get(url)
                .then(response => {
                    if (response.data === "Login") {
                        setShowLogin(true);
                    } else {
                        localStorage.setItem('user', email);
                        navigate("/signup");
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the data: ', error);
                });
        } else {
            alert("Invalid Email: " + email);
        }
    };
    const handleLogin = async () => {
        const options = {
            method: 'POST',
            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/registration/auth',
            data: { email: email, password: password },
        };
        await axios.request(options)
            .then(response => {
                MySwal.fire({
                    icon: "success",
                    title: "Logged in Successfully!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => { window.location.reload(); });
                localStorage.setItem('NGO', btoa(`${email}:${password}`));
                localStorage.removeItem("ADMIN_NGO");
                setShowPopup(false);
            })
            .catch(error => {
                alert(error.response.data);
            })
    };

    return (
        <>
            <Navbar />
            {showPopup ? <div className='popUp'>
                <div className='popup-content'>
                    <div className="closeBtn">
                        <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowPopup(!showPopup) }}></button>
                    </div>
                    <h1>Your Account</h1>
                    <h2>{showLogin ? 'Enter your password to LogIn' : `Enter your email to LogIn or Create an account.`}</h2>
                    <div className="form">
                        <input type="email" name="mail" id="mail" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter your email address' autoComplete='email' readOnly={showLogin} required />
                        {showLogin && <input type="password" name="pass" id="pass" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} required />}
                        <button type="button" className="btn btn-success" onClick={showLogin ? handleLogin : handleEmail}>{showLogin ? "LogIn" : "Continue"}</button>
                    </div>
                </div>
            </div> : null}
            <PageHeader title={"Donate Now"} path={"/donate"} name={"Donate"} />

            {/* <!-- Donate Start --> */}
            <div className="donations">
                <h2 className='logs' style={{backgroundColor:recentLogin?'whitesmoke':'transparent'}}>{recentLogin.length>0?`Last Login: ${recentLogin}`:<span>&#8203;</span>}</h2>
                <div className="container">
                    <div className="donate">
                        <div className="row align-items-center">
                            <div className="col-lg-7">
                                <div className="donate-content">
                                    <div className="section-header">
                                        <p>Donate Now</p>
                                        <h2>Let's donate to needy people for better lives</h2>
                                    </div>
                                    <div className="donate-text">
                                        <p>
                                            Lorem ipsum dolor sit amet elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non. Aliquam metus tortor, auctor id gravida, viverra quis sem. Curabitur non nisl nec nisi maximus. Aenean convallis porttitor. Aliquam interdum at lacus non blandit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="donate-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="control-group">
                                            <input onChange={(e) => setName(e.target.value)} id='name' type="text" className="form-control" placeholder="Name" required autoComplete='name' />
                                        </div>
                                        <div className="control-group">
                                            <input onChange={(e) => setEmail(e.target.value)} value={email} id='email' type="email" className="form-control" placeholder="Email" disabled={showLogin} required autoComplete='email' />
                                        </div>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" defaultChecked onChange={() => setAmount(100)} />
                                            <label htmlFor='btnradio1' className="btn btn-custom btn-outline-warning"><i className='fa fa-indian-rupee' /> 100</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onChange={() => setAmount(500)} />
                                            <label htmlFor='btnradio2' className="btn btn-custom btn-outline-warning"><i className='fa fa-indian-rupee' /> 500</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" onChange={() => setAmount(1)} />
                                            <label htmlFor='btnradio3' className="btn btn-custom btn-outline-warning"><i className='fa fa-indian-rupee' /> 1000</label>
                                        </div>
                                        <div>
                                            <button className="btn btn-custom" type="submit" style={{ borderRadius: "12px" }}>Donate Now</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Donate End --> */}
            <Footer />
            <BackToTop />
        </>
    );
}