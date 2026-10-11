# Portfolio-Redeploy Backend App (v2)
## Branch Purpose:
This branch contains the project's files adapted to bypass strict cross-site tracking and cookie policies on iOS devices and browsers like Safari (where cookies between two different domains are blocked). These updates replace HttpOnly cookies with localStorage variables for JWT storage.

* **Main Branch:** Contains the original project logic and secure cookie architecture.
* **Portfolio-Deployment Branch:** Deployed to Vercel and Render, using localStorage to ensure full compatibility across all mobile and desktop browsers.

## Alternative approaches:
Alternative approaches considered included purchasing a custom domain to unify the site under a single root domain or migrating to Firebase with a NoSQL database. However, this deployment branch successfully preserves the goal of a JavaScript-based full-stack project while maintaining a zero-cost publishing model.

---
*Developed by Giorgos Den.*
