import '../../styles/header.css';

export function StickyHeader() {
    return (
        <header className="app-header">
            <div className="hdr-inner">
                <a href="/">
                    <img
                        src="/assets/HWC-Logo-Light.png"
                        alt="HWC Engineering Logo"
                        className="brand-logo"
                    />
                </a>
            </div>
        </header>
    );
}