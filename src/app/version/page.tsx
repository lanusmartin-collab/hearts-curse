export default function VersionPage() {
    return (
        <div style={{ padding: "2rem", color: "white", background: "black", minHeight: "100vh" }}>
            <h1>System Status</h1>
            <p>Deployment Version: <strong>v1.3.0 (Silent Wards Keystone & Interactive HUD Update)</strong></p>
            <p>Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
