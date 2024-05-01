import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import BackToTop from '../components/BackToTop';
import PageHeader from "../components/PageHeader";

export default function Contact() {
    return (
        <>
            <Navbar />
            <PageHeader title="Contact Us" path="contact" name="Contact" />
            <ContactForm />
            <Footer />
            <BackToTop />
        </>
    );
}