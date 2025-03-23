
"use client"
// import { useEffect, useState } from "react";
// import WelcomePage from "./welcome-page";
// import RoleRedirect from "@/components/role-redirect";

// export default function Home() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Example: Fetch user auth status from localStorage or any state management
//     const user = localStorage.getItem("user"); // Replace with actual auth logic

//     if (user) {
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   if (loading) return null; // Avoid flickering while checking auth

//   return isAuthenticated ? <RoleRedirect /> : <WelcomePage />;
// }



import WelcomePage from "./welcome-page"

export default function Home() {
  // Show the welcome page without any automatic redirects
  return <WelcomePage />
}