export default function VersionPage() {
    return (
        <div style={{ padding: "2rem", color: "white", background: "black", minHeight: "100vh" }}>
            <h1>System Status</h1>
            <p>Deployment Version: <strong>v2.0 (Market Update)</strong></p>
            <p>Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
