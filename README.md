<div align="center">
  <img src="acm_logo.png" alt="ACM Logo" height="140"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="convergelogo.png" alt="Converge Logo" height="80"/>

  # 🌐 BUILD THE INTERNET
  **Build. Connect. Troubleshoot. Stand out.**
</div>

---

**📍 Location:** Excel Lab, MITS Kochi  
**⏰ Time:** 2:00 PM - 6:00 PM  

A 4-hour hands-on technical challenge where teams of 4 go beyond using the internet to build and connect their own mini internet system. Gain hands-on technical experience that you can showcase on your CV and portfolio.

## 📖 About the Event

"Build the Internet" is a hands-on, beginner-friendly hackathon designed to teach core networking and microservice concepts through contract-driven development. Working from fill-in-the-blanks starter templates guided by strict OpenAPI 3.0 specifications, teams build and connect four distinct services:

- **`acm-dns`**: Dynamic service discovery
- **`acm-db`**: User credential storage
- **`acm-server`**: Password hashing and cookie-based session management
- **`acm-app`**: Web client gateway

Throughout the event, participants implement realistic network flows—resolving service endpoints dynamically without hardcoded IPs, handling fallback registration loops, and maintaining authenticated sessions—all visualized live on the client interface through a real-time, icon-based progress indicator.

Explore DNS, Linux, IP addresses, ports, TCP/UDP, web development, and backend technologies while solving real technical challenges as a team. You don’t need to know everything beforehand—problem-solving, teamwork, and adaptability matter most.

## 💻 Prerequisites

- **Linux Environment:** Install a Linux virtual machine (VM) on your laptop before the event. Ensure the VM is fully functional and ready to use.

## 🏆 Evaluation Criteria

1. **Speed of the Flow:** Efficiency and responsiveness of the network communication between microservices.
2. **Error Responses Handling:** Graceful failure management, fallback loops, and appropriate HTTP error messaging.
3. **Presentation:** Quality of the web client UI, including the clarity of the real-time visualization.
4. **Security:** Secure implementation across all modules (e.g., password hashing, proper session management).

## 📜 Rules & Guidelines

1. **Microservice Architecture:** The system must be composed of four distinct and separate microservices (`acm-dns`, `acm-db`, `acm-server`, `acm-app`). Merging them into a single monolithic application is not allowed.
2. **Dynamic Service Discovery:** Services must dynamically register with and discover each other via the `acm-dns` service. Direct service-to-service communication bypassing DNS resolution is prohibited.
3. **No Hardcoded IPs:** Hardcoding IP addresses is strictly forbidden across all services. Even for the DNS server, the IP address must be provided dynamically (e.g., via user input or environment variables) when a client or service starts.
4. **Interactive Web Client:** The `acm-app` (Client) must be a fully functional web application. It must feature a real-time visualization (such as an icon-based progress indicator) of the network flows and background events as they happen.
5. **Monitoring Dashboards (Bonus):** Implementing individual monitoring dashboards for each of the four microservices to view live event logs is highly recommended and will earn bonus points during evaluation.
6. **Distributed Development:** Teams consist of four members. To simulate a real-world microservices workflow, each participant must take ownership of exactly one microservice. Participants are encouraged to use AI tools; however, team members should work independently on their respective services until the final integration phase.
7. **Strict Contract Compliance:** Teams must strictly adhere to the provided OpenAPI 3.0 YAML contracts for each microservice. While participants are free to expand the APIs and add new features, altering or removing any part of the predefined contract is strictly prohibited.
