# OWASP Top 10

##### (Open Web Application Security Project OR Open Worldwide Application Security Project)

#### What is DevSecOps?

* It refers to the integration of security practices into a DevOps software delivery model.
* It is the practice of integrating security into every phase of the software development lifecycle (SDLC) instead of treating it as a final gate before release.
* In a DevSecOps model, security objectives are integrated as early as possible in the lifecycle of software development and security considerations are important throughout the lifecycle.

#### Vulnerabilities

* A security vulnerability is a software code flaw or a system misconfiguration that hackers can use to gain unauthorized access to a system or network.
* A vulnerability is a weakness in software, configuration, or process that an attacker can exploit to compromise confidentiality, integrity, or availability (the CIA triad).

#### Exploit

An exploit is the method hackers used to exploit a vulnerability and exploit is typically a piece of custom software or a sequence of commands.

#### Threat

A threat is the actual or hypothetical event in which one or more exploits vulnerability to mount an attack.

#### Key terminology
&#x09;
|Term|Definition|
|-|-|
|Vulnerability|A weakness (e.g., unsanitized input)|
|Threat|Something that could exploit a weakness (attacker, malware)|
|Exploit|Code or technique that takes advantage of a vulnerability.|
|Risk|Likelihood x impact of a threat exploiting a vulnerability.|
|Attack Surface|Sum of all points where an attacker can interact with the system (APIs, forms, ports, dependencies).|
|Payload|The malicious data sent during an attack.|
|Zero-day|A vulnerability with no available patch, often unknown to the vendor.|
|PoC|Proof of Concept: demonstrates that a vulnerability is exploitable.|

#### What is DevOps?

* A set of practices that combines software development and IT Operations.
* It aims to shorten the Systems Development Lifecycle and provides continuous delivery with high software availability.

#### DevOps vs DevSecOps
|Aspect|DevOps|DevSecOps|
|-|-|-|
|Goal|Deliver software faster and more reliably|Deliver software faster, reliably, and securely|
|Security Timing|Often a late-stage review/gate|Continuous, from planning onward|
|Ownership|Dev + Ops|Dev + Sec + Ops|
|Pipeline|Build -> Test -> Deploy|Build -> Security scans -> Test -> Policy checks -> Deploy -> Runtime monitoring|
|Cost of fixing bugs|Security bugs found late are expensive|Found early, cheap to fix|
|Culture|Collaboration between dev and ops|Collaboration between dev, ops and security|
|Compliance|Manual audits|Automated, continuous compliance checks|
|Feedback Loop|Test failures|Test failures plus vulnerability findings in PRs/IDE|

##### Advantages of DevSecOps over DevOps

* faster delivery
* improved security posture
* reduced costs
* enabling greater overall business access
* improving security integration and pace
* enhancing the value of DevOps

###### Container Challenges (Containers are writing OS level things)

* Increased scope of responsibility
* Lack of expertise
* Maintaining velocity

###### Security vulnerabilities can be found in all different areas related to software.

##### Types of Vulnerabilities(Official Lists)

1. CWE: Common Weakness Enumeration

   1. Porous Defenses
   2. Risky Resource Management
   3. Insecure Interaction Between Components
2. OWASP Top 10

   1. A01: Broken Access Control
   2. A02: Security Misconfiguration
   3. A03: Software Supply Chain Failures
   4. A04: Cryptographic Failures
   5. A05: Injection
   6. A06: Insecure Design
   7. A07: Authentication Failures
   8. A08: Software or Data Integrity Failures
   9. A09: Security Logging and Alerting Failures
   10. A10: Mishandling of Exceptional Conditions



##### 1.CWE: Common Weakness Enumeration

###### 1.Porous Defenses

* A porous defenses weakness is one that could allow users to bypass or spoof authentication and authorization processes. **Authentication** verifies the identity of someone trying to access a system while **authorization** is set of access and usage permissions assigned to the user.
* Porous defense weakness examples:

  * Weak password encoding
  * insufficiently protected credentials
  * missing or single factor authentication
  * insecurely inherited permissions
  * sessions that do not expire in a timely manner.

###### 2. Risky Resource Management

* Risky management of resources such as memory, functions and open-source frameworks.
* Examples:

  * out of bound read/ write
  * buffer overflow
  * path traversal

###### 3. Insecure Interaction Between Components

* Many applications today send and receive data across a wide range of services, threads and processes. The way different components interact with each other can introduce vulnerabilities.
* Examples:

  * cross-site-scripting
  * cross-site request forgery
  * backdoor attacks
  * scripting attacks
  * worms
  * trojan horses
  * other exploits...

##### 2. OWASP Top 10

The Open Worldwide Application Security Project (OWASP) is an open community dedicated to enabling organizations to develop, purchase, and maintain applications and APIs that can be trusted.

###### What are Application Security Risks?

Attackers can potentially use many different paths through your application to do harm to your business or organization. Each of these ways poses a potential risk that needs to be investigated.

###### Data Factors to determine application security lists:

There are data factors that are listed for each of the Top Ten Categories, here is what they mean:

* **CWEs Mapped:** The number of CWEs mapped to a category by the Top Ten team.

* **Incidence Rate:** Incidence rate is the percentage of applications vulnerable to that CWE from the population tested by that org for that year.

* **Weighted Exploit:** The Exploit sub-score from CVSSv2 and CVSSv3 scores assigned to CVEs mapped to CWEs, normalized, and placed on a 10pt scale.

* **Weighted Impact:** The Impact sub-score from CVSSv2 and CVSSv3 scores assigned to CVEs mapped to CWEs, normalized, and placed on a 10pt scale.

* **(Testing) Coverage:** The percentage of applications tested by all organizations for a given CWE.

* **Total Occurrences:** Total number of applications found to have the CWEs mapped to a category.

* **Total CVEs:** Total number of CVEs in the NVD DB that were mapped to the CWEs mapped to a category.

* **Formula:** (Max Incidence Rate % \* 1000) + (Max Coverage % \* 100) + (Avg Exploit \* 10) + (Avg Impact \* 20) + (Sum Occurrences / 10000) = Risk Score

##### A01: Broken Access Control

###### Description.

Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification or destruction of all data, or performing a business function outside the user's limits. Common access control vulnerabilities include:


* Violation of the principle of least privilege, commonly known as deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone.
* Bypassing access control checks by modifying the URL (parameter tampering or force browsing), internal application state, or the HTML page, or by using an attack tool that modifies API requests.
* Permitting viewing or editing someone else's account by providing its unique identifier (insecure direct object references)
* An accessible API with missing access controls for POST, PUT, and DELETE.
* Elevation of privilege. Acting as a user without being logged in or or gaining privileges beyond those expected of the logged in user (e.g. admin access).
* Metadata manipulation, such as replaying or tampering with a JSON Web Token (JWT) access control token, a cookie or hidden field manipulated to elevate privileges, or abusing JWT invalidation.
* CORS misconfiguration allows API access from unauthorized or untrusted origins.
* Force browsing (guessing URLs) to authenticated pages as an unauthenticated user or to privileged pages as a standard user.



###### How to prevent.

Access control is only effective when implemented in trusted server-side code or serverless APIs, where the attacker cannot modify the access control check or metadata.



* Except for public resources, deny by default.
* Implement access control mechanisms once and reuse them throughout the application, including minimizing Cross-Origin Resource Sharing (CORS) usage.
* Model access controls should enforce record ownership rather than allowing users to create, read, update, or delete any record.
* Unique application business limit requirements should be enforced by domain models.
* Disable web server directory listing and ensure file metadata (e.g., .git) and backup files are not present within web roots.
* Log access control failures, alert admins when appropriate (e.g., repeated failures).
* Implement rate limits on API and controller access to minimize the harm from automated attack tooling.
* Stateful session identifiers should be invalidated on the server after logout. Stateless JWT tokens should be short-lived to minimize the window of opportunity for an attacker. For longer-lived JWTs, consider using refresh tokens and following OAuth standards to revoke access.
* Use well-established toolkits or patterns that provide simple, declarative access controls.



Developers and QA staff should include functional access control in their unit and integration tests.



##### A02: Security Misconfiguration

###### Description.

Security misconfiguration is when a system, application, or cloud service is set up incorrectly from a security perspective, creating vulnerabilities.

The application might be vulnerable if:

* It is missing appropriate security hardening across any part of the application stack or improperly configured permissions on cloud services.
* Unnecessary features are enabled or installed (e.g., unnecessary ports, services, pages, accounts, testing frameworks, or privileges).
* Default accounts and their passwords are still enabled and unchanged.
* A lack of central configuration for intercepting excessive error messages. Error handling reveals stack traces or other overly informative error messages to users.
* For upgraded systems, the latest security features are disabled or not configured securely.
* Excessive prioritization of backward compatibility leading to insecure configuration.
* The security settings in the application servers, application frameworks (e.g., Struts, Spring, ASP.NET), libraries, databases, etc., are not set to secure values.
* The server does not send security headers or directives, or they are not set to secure values.
* Without a concerted, repeatable application security configuration hardening process, systems are at a higher risk.

###### How to prevent.

Secure installation processes should be implemented, including:

* A repeatable hardening process enabling the fast and easy deployment of another environment that is appropriately locked down. Development, QA, and production environments should all be configured identically, with different credentials used in each environment. This process should be automated to minimize the effort required to set up a new secure environment.
* A minimal platform without any unnecessary features, components, documentation, or samples. Remove or do not install unused features and frameworks.
* A task to review and update the configurations appropriate to all security notes, updates, and patches as part of the patch management process (see A03 Software Supply Chain Failures). Review cloud storage permissions (e.g., S3 bucket permissions).
* A segmented application architecture provides effective and secure separation between components or tenants, with segmentation, containerization, or cloud security groups (ACLs).
* Sending security directives to clients, e.g., Security Headers.
* An automated process to verify the effectiveness of the configurations and settings in all environments.
* Proactively add a central configuration to intercept excessive error messages as a backup.
* If these verifications are not automated, they should be manually verified annually at a minimum.
* Use identity federation, short-lived credentials, or role-based access mechanisms provided by the underlying platform instead of embedding static keys or secrets in code, configuration files, or pipelines.

##### A03: Software Supply Chain Failures

###### Description.

Software supply chain failures are breakdowns or other compromises in the process of building, distributing, or updating software. They are often caused by vulnerabilities or malicious changes in third-party code, tools, or other dependencies that the system relies on.

You are likely vulnerable if:

* you do not carefully track the versions of all components that you use (both client-side and server-side). This includes components you directly use as well as nested (transitive) dependencies.
* the software is vulnerable, unsupported, or out of date. This includes the OS, web/application server, database management system (DBMS), applications, APIs and all components, runtime environments, and libraries.
* you do not scan for vulnerabilities regularly and subscribe to security bulletins related to the components you use.
* you do not have a change management process or tracking of changes within your supply chain, including tracking IDEs, IDE extensions and updates, changes to your organization's code repository, sandboxes, image and library repositories, the way artifacts are created and stored, etc. Every part of your supply chain should be documented, especially changes.
* you have not hardened every part of your supply chain, with a special focus on access control and the application of least privilege.
* your supply chain systems do not have any separation of duty. No single person should be able to write code and promote it all the way to production without oversight from another human being.
* components from untrusted sources, across any part of the tech stack, are used in or can impact on production environments.
* you do not fix or upgrade the underlying platform, frameworks, and dependencies in a risk-based, timely fashion. This commonly happens in environments when patching is a monthly or quarterly task under change control, leaving organizations open to days or months of unnecessary exposure before fixing vulnerabilities.
* software developers do not test the compatibility of updated, upgraded, or patched libraries.
* you do not secure the configurations of every part of your system (see A02:2025-Security Misconfiguration).
* your CI/CD pipeline has weaker security than the systems it builds and deploys, especially if it is complex.


##### A04: Cryptographic Failures

###### Description.

Generally speaking, all data in transit should be encrypted at the transport layer (OSI layer 4). Previous hurdles such as CPU performance and private key/certificate management are now handled by CPUs having instructions designed to accelerate encryption (eg: AES support) and private key and certificate management being simplified by services like LetsEncrypt.org with major cloud vendors providing even more tightly integrated certificate management services for their specific platforms.

Beyond securing the transport layer, it is important to determine what data needs encryption at rest as well as what data needs extra encryption in transit (at the application layer, OSI layer 7). For example, passwords, credit card numbers, health records, personal information, and business secrets require extra protection, especially if that data falls under privacy laws, e.g., EU's General Data Protection Regulation (GDPR), or regulations such as PCI Data Security Standard (PCI DSS). For all such data:

* Are any old or weak cryptographic algorithms or protocols used either by default or in older code?
* Are default crypto keys in use, are weak crypto keys generated, are keys re-used, or is proper key management and rotation missing?
* Are crypto keys checked into source code repositories?
* Is encryption not enforced, e.g., are any HTTP headers (browser) security directives or headers missing?
* Is the received server certificate and the trust chain properly validated?
* Are initialization vectors ignored, reused, or not generated sufficiently secure for the cryptographic mode of operation? Is an insecure mode of operation such as ECB in use? Is encryption used when authenticated encryption is more appropriate?
* Are passwords being used as cryptographic keys in the absence of a password based key derivation function?
* Is randomness used that was not designed to meet cryptographic requirements? Even if the correct function is chosen, does it need to be seeded by the developer, and if not, has the developer over-written the strong seeding functionality built into it with a seed that lacks sufficient entropy/unpredictability?
* Are deprecated hash functions such as MD5 or SHA1 in use, or are non-cryptographic hash functions used when cryptographic hash functions are needed?
* Are cryptographic error messages or side channel information exploitable, for example in the form of padding oracle attacks?
* Can the cryptographic algorithm be downgraded or bypassed?

##### A05: Injection

###### Description

An injection vulnerability is an application flaw that allows untrusted user input to be sent to an interpreter (e.g. a browser, database, the command line) and causes the interpreter to execute parts of that input as commands.

An application is vulnerable to attack when:

* User-supplied data is not validated, filtered, or sanitized by the application.
* Dynamic queries or non-parameterized calls without context-aware escaping are used directly in the interpreter.
* Unsanitized data is used within object-relational mapping (ORM) search parameters to extract additional, sensitive records.
* Potentially hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures.

Some of the more common injections are SQL, NoSQL, OS command, Object Relational Mapping (ORM), LDAP, and Expression Language (EL) or Object Graph Navigation Library (OGNL) injection. The concept is identical among all interpreters. Detection is best achieved by a combination of source code review along with automated testing (including fuzzing) of all parameters, headers, URL, cookies, JSON, SOAP, and XML data inputs. The addition of static (SAST), dynamic (DAST), and interactive (IAST) application security testing tools into the CI/CD pipeline can also be helpful to identify injection flaws before production deployment.

##### A06: Insecure Design

###### Description

Insecure design is a broad category representing different weaknesses, expressed as “missing or ineffective control design.” Insecure design is not the source for all other Top Ten risk categories. Note that there is a difference between insecure design and insecure implementation. We differentiate between design flaws and implementation defects for a reason, they have different root causes, take place at different times in the development process, and have different remediations. A secure design can still have implementation defects leading to vulnerabilities that may be exploited. An insecure design cannot be fixed by a perfect implementation as needed security controls were never created to defend against specific attacks. One of the factors that contributes to insecure design is the lack of business risk profiling inherent in the software or system being developed, and thus the failure to determine what level of security design is required.

Three key parts of having a secure design are:

* Gathering Requirements and Resource Management
* Creating a Secure Design
* Having a Secure Development Lifecycle

##### A07: Authentication Failures

###### Description

When an attacker is able to trick a system into recognizing an invalid or incorrect user as legitimate, this vulnerability is present. There may be authentication weaknesses if the application:

* Permits automated attacks such as credential stuffing, where the attacker has a breached list of valid usernames and passwords. More recently this type of attack has been expanded to include hybrid password attacks credential stuffing (also known as password spray attacks), where the attacker uses variations or increments of spilled credentials to gain access, for instance trying Password1!, Password2!, Password3! and so on.
* Permits brute force or other automated, scripted attacks that are not quickly blocked.
* Permits default, weak, or well-known passwords, such as "Password1" or "admin" username with an "admin" password.
* Allows users to create new accounts with already known-breached credentials.
* Allows use of weak or ineffective credential recovery and forgot-password processes, such as "knowledge-based answers," which cannot be made safe.
* Uses plain text, encrypted, or weakly hashed passwords data stores (see A04:2025-Cryptographic Failures).
* Has missing or ineffective multi-factor authentication.
* Allows use of weak or ineffective fallbacks if multi-factor authentication is not available.
* Exposes session identifier in the URL, a hidden field, or another insecure location that is accessible to the client.
* Reuses the same session identifier after successful login.
* Does not correctly invalidate user sessions or authentication tokens (mainly single sign-on (SSO) tokens) during logout or a period of inactivity.
* Does not correctly assert the scope and intended audience of the provided credentials.

##### A08: Software or Data Integrity Failures

###### Description

Software and data integrity failures relate to code and infrastructure that does not protect against invalid or untrusted code or data being treated as trusted and valid. An example of this is where an application relies upon plugins, libraries, or modules from untrusted sources, repositories, and content delivery networks (CDNs). An insecure CI/CD pipeline without consuming and providing software integrity checks can introduce the potential for unauthorized access, insecure or malicious code, or system compromise. Another example of this is a CI/CD that pulls code or artifacts from untrusted places and/or doesn’t verify them before use (by checking the signature or similar mechanism). Lastly, many applications now include auto-update functionality, where updates are downloaded without sufficient integrity verification and applied to the previously trusted application. Attackers could potentially upload their own updates to be distributed and run on all installations. Another example is where objects or data are encoded or serialized into a structure that an attacker can see and modify is vulnerable to insecure deserialization.

##### How To Prevent

* Use digital signatures or similar mechanisms to verify the software or data is from the expected source and has not been altered.
* Ensure libraries and dependencies, such as npm or Maven, are only consuming trusted repositories. If you have a higher risk profile, consider hosting an internal known-good repository that's vetted.
* Ensure that there is a review process for code and configuration changes to minimize the chance that malicious code or configuration could be introduced into your software pipeline.
* Ensure that your CI/CD pipeline has proper segregation, configuration, and access control to ensure the integrity of the code flowing through the build and deploy processes.
* Ensure that unsigned or unencrypted serialized data is not received from untrusted clients and subsequently used without some form of integrity check or digital signature to detect tampering or replay of the serialized data.

##### A09: Security Logging and Alerting Failure

##### Description

Without logging and monitoring, attacks and breaches cannot be detected, and without alerting it is very difficult to respond quickly and effectively during a security incident. Insufficient logging, continuous monitoring, detection, and alerting to initiate active responses occurs any time:

* Auditable events, such as logins, failed logins, and high-value transactions, are not logged or logged inconsistently (for instance, only logging successful logins, but not failed attempts).
* Warnings and errors generate no, inadequate, or unclear log messages.
* The integrity of logs is not properly protected from tampering.
* Logs of applications and APIs are not monitored for suspicious activity.
* Logs are only stored locally, and not properly backedup.
* Appropriate alerting thresholds and response escalation processes are not in place or effective. Alerts are not received or reviewed within a reasonable amount of time.
* Penetration testing and scans by dynamic application security testing (DAST) tools (such as Burp or ZAP) do not trigger alerts.
* The application cannot detect, escalate, or alert for active attacks in real-time or near real-time.
* You are vulnerable to sensitive information leakage by making logging and alerting events visible to a user or an attacker (see A01:2025-Broken Access Control), or by logging sensitive information that should not be logged (such as PII or PHI).
* You are vulnerable to injections or attacks on the logging or monitoring systems if log data is not correctly encoded.
* The application is missing or mishandling errors and other exceptional conditions, such that the system is unaware there was an error, and is therefore unable to log there was a problem.
* Adequate ‘use cases’ for issuing alerts are missing or outdated to recognize a special situation.
* Too many false positive alerts make it impossible to distinguish important alerts from unimportant ones, resulting in them being recognized too late or not at all (physical overload of the SOC team).
* Detected alerts cannot be processed correctly because the playbook for the use case is incomplete, out of date, or missing.

##### A10: Mishandling of Exceptional Conditions

###### Description

Mishandling exceptional conditions in software happens when programs fail to prevent, detect, and respond to unusual and unpredictable situations, which leads to crashes, unexpected behavior, and sometimes vulnerabilities. This can involve one or more of the following 3 failings; the application doesn’t prevent an unusual situation from happening, it doesn’t identify the situation as it is happening, and/or it responds poorly or not at all to the situation afterwards.

Exceptional conditions can be caused by missing, poor, or incomplete input validation, or late, high level error handling instead at the functions where they occur, or unexpected environmental states such as memory, privilege, or network issues, inconsistent exception handling, or exceptions that are not handled at all, allowing the system to fall into an unknown and unpredictable state. Any time an application is unsure of its next instruction, an exceptional condition has been mishandled. Hard-to-find errors and exceptions can threaten the security of the whole application for a long time.

Many different security vulnerabilities can happen when we mishandle exceptional conditions,

such as logic bugs, overflows, race conditions, fraudulent transactions, or issues with memory, state, resource, timing, authentication, and authorization. These types of vulnerabilities can negatively affect the confidentiality, availability, and/or integrity of a system or it’s data. Attackers manipulate an application's flawed error handling to strike this vulnerability.