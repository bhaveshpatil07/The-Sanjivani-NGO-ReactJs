import '../css/page_header.css';

export default function PageHeader({ title, path, name }) {

    return (
        <div className="page-header" >
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>{title}</h2>
                    </div>
                    <div className="col-12">
                        <a href="/">Home</a>
                        <a href={path}>{name}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}