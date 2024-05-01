import React, { useEffect } from 'react';
import '../css/backToTop.css';

export default function BackToTop() {
    // Define a state variable to track the visibility of the button
    const [visible, setVisible] = React.useState(false);

    // Define a function to handle the window scroll event
    const handleScroll = () => {
        // Check if the window scroll position is greater than 200 pixels
        if (window.scrollY > 200) {
            // Set the visible state to true
            setVisible(true);
        } else {
            // Set the visible state to false
            setVisible(false);
        }
    };

    // Define a function to handle the button click event
    const handleClick = () => {
        // Scroll to the top of the page with a smooth behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Use the useEffect hook to add and remove the event listeners
    useEffect(() => {
        // Add the event listener for the window scroll
        window.addEventListener('scroll', handleScroll);

        // Return a cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Pass an empty dependency array to run the effect only once

    return (
        // Render the button with a conditional className based on the visible state
        <a className={`back-to-top ${visible ? 'd-block' : 'd-none'}`} onClick={handleClick}>
            <i className="fa fa-chevron-up">
            </i>
        </a>
    );
}
