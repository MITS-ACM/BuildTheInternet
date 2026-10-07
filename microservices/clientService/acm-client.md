Client Application (acm-app) Specification

acm-app is a web client that dynamically resolves backend service IP addresses, manages user authentication, and renders a live, icon-based real-time visualization of the execution flow.
Workflow

    Input DNS address ip from user.

    DNS Lookup: Send GET /lookup?domain=acm-server to acm-dns to retrieve the server address.

    Authentication / Registration: Send POST /login with user credentials. If login fails because the user does not exist, send POST /register and retry POST /login.

    Session Verification: Capture the session_id cookie from POST /login and send GET /whoami to confirm the active session.

User Interface

    The interface must include a live, icon-based real-time display representing each step of the flow as it occurs.
