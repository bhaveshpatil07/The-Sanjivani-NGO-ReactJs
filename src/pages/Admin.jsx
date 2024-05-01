import axios from "axios";
import Navbar from "../components/Navbar";
import '../css/admin.css';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [selectedMail, setSelectedMail] = useState(null);
    const [data, setData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);
    const [logs, setLogs] = useState([]);
    const [donations, setDonations] = useState([]);
    const [allDonations, setAllDonations] = useState([]);
    const [auth, setAuth] = useState("");
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const user = localStorage.getItem("ADMIN_NGO");
        if (user) {
            setAuth(user);
            fetchDonations(user);
        } else {
            adminLogin();
            setAllDonations([]);
        }
    }, []);

    const adminLogin = async () => {
        MySwal.fire({
            title: "ADMIN LOGIN",
            html:
                '<div class="form-floating mb-3">' +
                '<input type="email" id="floatingInput" class="form-control" placeholder="Admin Email" autocomplete="email">' +
                '<label for="floatingInput">ADMIN Email</label>' +
                '</div>' +
                '<div class="form-floating">' +
                '<input type="password" id="floatingPassword" class="form-control" placeholder="Your Password">' +
                '<label for="floatingPassword">Enter Password</label>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "LogIn",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    const url = `https://the-sanjivani-ngo-server.onrender.com/api/v1/registration/auth`;
                    const mail = document.getElementById("floatingInput").value;
                    const pass = document.getElementById("floatingPassword").value;
                    // console.log(email, pass);
                    const response = await axios.post(url, { email: mail, password: pass });
                    localStorage.setItem("ADMIN_NGO", btoa(mail + ':' + pass));
                    localStorage.removeItem("NGO");
                    return response.data;
                } catch (error) {
                    MySwal.showValidationMessage(`Request failed: ${error}`);
                };
            },
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: "ADMIN LoggedIn Successfully!",
                    icon: "success"
                }).then(() => { window.location.reload(); });
            } else if (result.dismiss === MySwal.DismissReason.cancel) {
                navigate("/");
            }
        });
    };

    const fetchDonations = async (auth1) => {
        var options = {
            method: 'GET',
            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/search/allDonations',
            headers: {
                Authorization: `Basic ${auth1}`,
                'Content-Type': 'application/json'
            },
        };
        await axios.request(options)
            .then((response) => {
                // console.log(response.data);
                setAllDonations(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };


    const fetchUserInfo = async (mail) => {
        var options = {
            method: 'GET',
            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/search/donations?email=' + mail,
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
        };
        await axios.request(options)
            .then((response) => {
                // console.log(response.data);
                let remainingDonations = [];
                response.data.forEach(data => {
                    if ('totalAmount' in data && 'isEnabled' in data && 'logs' in data) {
                        setTotalAmount(data.totalAmount);
                        setLogs(data.logs);
                        setIsEnabled(data.isEnabled);
                    } else {
                        remainingDonations.push(data);
                    }
                });
                setDonations(remainingDonations);
            }).catch((error) => {
                console.log(error);
            });
    };

    const search = async () => {
        const searchDiv = document.getElementById('search-input');
        let query = searchDiv.value;
        const div = document.getElementById("search-result");
        if (query === '') {
            div.style.display = "none";
            return;
        } else {
            // Remove special characters at the beginning of the string
            query = query.replace(/^[^a-zA-Z0-9]+/, '');
            // Remove all spaces
            query = query.replace(/\s/g, '');
            searchDiv.value = query;
            query = query.toLowerCase();
            if (query === '') {
                div.style.display = "none";
                return;
            }
            div.style.display = "block";
        }
        var options = {
            method: 'GET',
            url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/search/' + query,
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
        };
        await axios.request(options)
            .then((response) => {
                // console.log(response.data);
                setData(response.data);
                div.style.display = "block";
            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Navbar />
            <div className="admin">
                <div className="container ">
                    {selectedMail &&
                        <>
                            <div className="popup">
                                <div className="popupContent" id="myPopup">
                                    <span className="text-last"><button onClick={() => { setSelectedMail(null); }} className="btn btn-close btn-outline-danger"></button></span>
                                    <div className="card">
                                        <div className="card-body">
                                            <h1 className="text-center text-warning p-3 bg-dark rounded-top-4">THE SANJIVANI NGO</h1>
                                            <table className="table text-center fs-5 table-dark table-hover">
                                                <thead>
                                                    <tr>
                                                        <th colSpan={2}>USER INFO</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-start">
                                                    <tr>
                                                        <th scope="col">Email</th>
                                                        <td scope="col">{selectedMail}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">IsEnabled</th>
                                                        <td scope="col">{isEnabled ? <i className="fa fa-solid fa-circle-check fa-lg" style={{ color: "green" }} /> : <i className="fa fa-solid fa-circle-xmark fa-lg" style={{ color: "red" }} />}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Total Amount Donated</th>
                                                        <td>{totalAmount} <i className='fa fa-indian-rupee' /></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Login Logs</th>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    UserLogs
                                                                </button>
                                                                <ul className="dropdown-menu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                    {logs.map((item, index) => (
                                                                        <li className="dropdown-item" key={index}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Donations List</th>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button className="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Donations
                                                                </button>
                                                                <ul className="dropdown-menu" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                                                    <li className="dropdown-item">
                                                                        <table className="table text-center">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Order Id</th>
                                                                                    <th>Amount (<i className='fa fa-indian-rupee' style={{ color: "black" }} />)</th>
                                                                                    <th>Date</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {donations.map((donation, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{donation.orderId}</td>
                                                                                        <td>{donation.amount} </td>
                                                                                        <td>{donation.date}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <h2 className="text-center text-light text-uppercase font-monospace fw-bold">ADMIN</h2>
                    <div className="search-container pt-3 pb-4" >
                        <input onFocus={search} onKeyUp={search} id="search-input" className="form-control bg-dark text-light fs-5 me-2" type="search" placeholder="Search by Email" aria-label="Search" autoComplete="email" />
                        <div className="search-result p-2" id="search-result">
                            {data && <div className='list-group'>
                                {data.map((mail, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        onClick={() => { fetchUserInfo(mail); setSelectedMail(mail); setData(null); }}
                                        className='z-1 list-group-item list-group-item-action list-group-item-secondary'
                                    >
                                        {mail}
                                    </a>
                                ))}
                            </div>}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-borderless table-dark table-hover">
                            <caption className="caption-top text-light">List of Donations</caption>
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Donation</th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allDonations.map((donation, index) => (
                                    <tr key={index} className="table-light">
                                        <th scope="row">{index + 1}</th>
                                        <td>{donation._id}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    View Donations
                                                </button>
                                                <ul className="dropdown-menu bg-dark" aria-labelledby={`dropdownMenuButton${index}`} style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                    {donation.orderIds.map((orderId, i) => (
                                                        <li key={i} className="dropdown-item text-success">{orderId}: {donation.amounts[i]} <i className='fa fa-indian-rupee' /></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                        <td>{donation.totalAmount} <i className='fa fa-indian-rupee' /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}



export default Admin