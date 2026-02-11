export default function NotFound() {
    return (
        <main className="page-container flex items-center justify-center section-padding">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-serif">404</h1>
                <p className="text-xl text-charcoal/70">This page could not be found</p>
                <a href="/" className="btn-primary inline-block">
                    Return Home
                </a>
            </div>
        </main>
    );
}
