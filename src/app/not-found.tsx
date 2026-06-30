export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <div className="mb-4 text-6xl font-bold text-muted-foreground">404</div>
                <h1 className="mb-2 text-xl font-semibold text-foreground">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
        </div>
    );
}
