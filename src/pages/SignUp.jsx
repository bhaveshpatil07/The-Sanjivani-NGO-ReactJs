import React, { useEffect, useState } from 'react';
import '../css/signup.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SignUp = () => {

    useEffect(() => {
        const user = localStorage.getItem('NGO');
        if(user){
            navigate('/donate');
        }
    }, [])
    
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: localStorage.getItem('user')?localStorage.getItem('user'):'', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ email: false, password: false, confirmPassword: false });
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const handleInputChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        if (!(/\S+@\S+\.\S+/.test(form.email))) {
            setErrors({ email: true });
            return false;
        }
        if (!(form.password.length >= 8)) {
            setErrors({ password: true });
            return false;
        }
        if (!(form.password === form.confirmPassword)) {
            setErrors({ confirmPassword: true });
            return false;
        }
        setErrors({});
        return true;
    };


    const handleSubmit = async(event) => {
        event.preventDefault();
        if (validateForm()) {
            var options = {
                method: 'POST',
                url: 'https://the-sanjivani-ngo-server.onrender.com/api/v1/registration',
                data: { email: form.email, password: form.confirmPassword },
            };

            await axios.request(options)
                .then(response => {
                    console.log("Token: ", response.data);
                    MySwal.fire({
                        title: "Registration Successful!",
                        text: "Verification mail has been sent to "+form.email,
                        icon: "success"
                    }).then(()=>{localStorage.removeItem('user'); navigate('/donate'); });
                }).catch(error => {
                    console.log(error);
                    MySwal.fire({
                        title: "Request Failed!",
                        text: "Check Your credentials and internet connection, then try again.",
                        icon: "error"
                    });
                });
        }
    };

    return (
        <>
            <Navbar />
            <div className="wrapper d-flex align-items-center justify-content-center">
                <div className="signUp">
                    <h2 className="title text-center pb-2 mb-3 border-bottom border-warning">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-2">
                            <label htmlFor="email" className='form-label'>Email</label>
                            <input type="email" className="form-control" name="email" id="email" placeholder="Enter Your Email" autoComplete='email' value={form.email} onChange={handleInputChange} />
                            {errors.email && <div className="alert alert-danger">Please enter a valid email.</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="password" className='form-label'>Password</label>
                            <input type={showPassword ? 'text' : 'password'} className="form-control" name="password" id="password" placeholder="Enter Password" autoComplete='current-password' value={form.password} onChange={handleInputChange} />
                            {errors.password && <div className="alert alert-danger">Use 8 characters or more for your password.</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="confirmPassword" className='form-label'>Confirm Password</label>
                            <input type={showPassword ? 'text' : 'password'} className="form-control" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" autoComplete='current-password' value={form.confirmPassword} onChange={handleInputChange} />
                            {errors.confirmPassword && <div className="alert alert-danger">Those passwords didn’t match. Try again.</div>}
                        </div>
                        <div className="form-check text-end">
                            <input className="form-check-input" name='showPassword' checked={showPassword} type="checkbox" id="check" onChange={() => { setShowPassword(!showPassword); }} />
                            <label className="form-check-label" htmlFor="check">
                                Show Password
                            </label>
                        </div>
                        <div className="form-check terms">
                            <input className="form-check-input" type="checkbox" id="invalidCheck" required />
                            <label className="form-check-label" htmlFor="invalidCheck">
                                Agree to terms and conditions.
                            </label>
                            <div className="invalid-feedback">
                                You must agree before submitting.
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success w-100 mb-2">Sign Up</button>
                    </form>
                </div>
            </div>

        </>
    );
};

export default SignUp;
