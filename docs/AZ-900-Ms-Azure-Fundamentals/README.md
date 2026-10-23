# Azure Essentials for an SDE-1

Covers the AZ-900 syllabus (your 3 modules), plus the extra topics a developer needs day to day. Note: Azure Active Directory (Azure AD) is now **Microsoft Entra ID**; older material and videos still use the old name.

\---

# Module 1: Cloud Concepts

## 1.1 Cloud computing

Renting compute, storage, networking and services over the internet, on demand, instead of owning hardware. Shift from **CapEx** (buy servers upfront) to **OpEx** (pay as you use).

## 1.2 Shared responsibility model

The provider always owns physical hosts, network and datacenter. You always own your **data, identities, and devices/accounts**. Everything in between shifts by service type.

|Layer|On-prem|IaaS|PaaS|SaaS|
|-|-|-|-|-|
|Data, identities, access|You|You|You|You|
|Applications|You|You|You|Provider|
|Runtime / middleware|You|You|Provider|Provider|
|OS|You|You|Provider|Provider|
|Virtual network, hypervisor|You|Provider|Provider|Provider|
|Physical hosts, datacenter|You|Provider|Provider|Provider|

## 1.3 Cloud models

* **Public**: shared Microsoft-owned infrastructure, pay-per-use, no hardware to maintain.
* **Private**: dedicated to one organization (on-prem or hosted); more control, higher cost.
* **Hybrid**: public + private/on-prem connected (e.g., Azure Arc, ExpressRoute, VPN).
* **Multi-cloud**: more than one cloud provider.

## 1.4 Consumption-based pricing

Pay only for what you use (per second/minute/hour, per GB, per million executions). No upfront cost, scale down to stop paying. Example: Azure Functions Consumption plan bills per execution and GB-seconds.

## 2\. Benefits of the cloud

* **High availability**: SLA-backed uptime (e.g., 99.9% = \~8.76 hrs downtime/year; 99.99% = \~52 min/year). Composite SLA = product of the SLAs of the services in the path.
* **Scalability**: *Vertical* (scale up/down: bigger VM) vs *horizontal* (scale out/in: more instances). Prefer horizontal for stateless apps.
* **Elasticity**: auto-scale in and out with demand.
* **Reliability**: resilience via redundancy, self-healing, multi-region design.
* **Predictability**: performance (autoscale, load balancing) and cost (calculators, budgets, forecasts).
* **Security and governance**: compliance certifications, Azure Policy, Defender for Cloud.
* **Manageability**: manage *of* the cloud (autoscale, templates, monitoring) and *in* the cloud (Portal, CLI, PowerShell, REST APIs).

## 3\. Service types

||You manage|Examples|Use when|
|-|-|-|-|
|**IaaS**|OS, runtime, apps, data|Virtual Machines, VNets, Disks|Lift-and-shift, full OS control|
|**PaaS**|Apps and data only|App Service, Azure SQL, Functions|Build apps without managing servers (most common for devs)|
|**SaaS**|Just use it (config, data)|Microsoft 365, Dynamics 365|Ready-made software|

**Serverless** (Functions, Logic Apps, Container Apps): PaaS variant where you write code/logic and pay per execution; scale to zero.

\---

# Module 2: Azure Architecture and Services

## 4\. Core architecture

### 4.1 Regions, region pairs, sovereign regions

* **Region**: a set of datacenters connected by a low-latency network (e.g., Central India, East US). Pick by latency, compliance/data residency, service availability, and price.
* **Region pair**: two regions in the same geography, usually 300+ miles apart. Benefits: sequential platform updates (one at a time), prioritized recovery in a broad outage, and geo-redundant storage replicates to the pair.
* **Sovereign regions**: isolated instances for compliance/legal needs: *Azure Government* (US) and *Azure China (21Vianet)*.

### 4.2 Availability Zones (AZs)

Physically separate datacenters (independent power, cooling, network) **within one region**; minimum 3 zones in zone-enabled regions. Protect against datacenter-level failure.

* *Zonal services*: pin to a specific zone (VMs, disks).
* *Zone-redundant services*: replicated across zones automatically (ZRS storage, zone-redundant SQL, Load Balancer Standard).
* **Availability sets** (older) protect against rack-level failures within a datacenter via fault/update domains. Prefer zones.

### 4.3 Datacenters

Physical buildings with servers, power, cooling and networking; Microsoft manages them. You never touch them but choose region/zone.

### 4.4 Resources and resource groups

* **Resource**: any manageable item (VM, storage account, VNet).
* **Resource group (RG)**: logical container for related resources sharing the same lifecycle.

  * A resource lives in exactly **one** RG; resources can be moved between RGs.
  * RGs can't be nested. Deleting an RG deletes everything in it.
  * RG has a location (for metadata) but its resources can be in other regions.
  * RBAC, policy, tags and locks can be applied at RG level and inherited.

### 4.5 Hierarchy: management groups, subscriptions

`Management groups → Subscriptions → Resource groups → Resources`

* **Subscription**: billing and access boundary; also holds limits/quotas. Common split: dev/test/prod.
* **Management group**: container for subscriptions to apply policy/RBAC at scale; up to 6 levels deep (excluding root); one **root** management group per tenant (Entra tenant).
* Policy and RBAC assigned at a higher scope are **inherited** downward.

## 5\. Compute and networking

### 5.1 Compute types

|Type|Service|Notes|
|-|-|-|
|Virtual machines|Azure VMs, VM Scale Sets|IaaS, full control|
|Containers|Container Instances (ACI), Container Apps, AKS|Lightweight, portable|
|Serverless|Functions, Logic Apps|Event-driven, pay per execution|
|PaaS web hosting|App Service|Managed web apps/APIs|

### 5.2 VM options

* **VM sizes/families**: General purpose (B, D), Compute-optimized (F), Memory-optimized (E), Storage-optimized (L), GPU (N), HPC (H).
* **Availability Sets**: fault domains (power/network) + update domains (planned maintenance). Free; SLA 99.95%.
* **Scale Sets (VMSS)**: identical VMs, autoscale by metrics/schedule, load-balanced.
* **Azure Virtual Desktop**: cloud-hosted Windows desktops/apps.
* **Pricing options**: Pay-as-you-go, Reserved Instances (1 or 3 yr, big discount), Savings Plans, Spot VMs (cheap, can be evicted; for interruptible batch work).

### 5.3 Resources needed for a VM

Every VM needs: a **resource group**, **VNet + subnet**, **NIC** (network interface), **OS disk** (plus optional data disks), and an image/size. Optional: public IP, NSG, load balancer. Stop (deallocate) a VM to stop compute billing, but disks still cost money.

### 5.4 Application hosting

|Service|Model|Best for|
|-|-|-|
|**App Service**|PaaS|Web apps, REST APIs, mobile backends; deployment slots (blue/green), autoscale, built-in TLS; .NET, Java, Node, Python, PHP|
|**Azure Functions**|Serverless|Event-driven snippets (HTTP, timer, queue, blob triggers); Consumption, Premium, Dedicated plans|
|**Container Instances**|Serverless containers|Quick single containers, no orchestration|
|**Container Apps**|Serverless containers|Microservices, KEDA autoscaling, scale to zero|
|**AKS**|Managed Kubernetes|Complex orchestration; Azure manages the control plane, you manage nodes/workloads|
|**Static Web Apps**|Static hosting + APIs|SPAs (React/Angular) with Functions backend|

### 5.5 Virtual networking

* **VNet**: private network in a region; you define address space (CIDR) and **subnets**. Resources in a VNet talk to each other by default.
* **NSG (Network Security Group)**: stateful allow/deny rules by IP, port, protocol, priority (lower number = evaluated first); attach to subnet or NIC.
* **Peering**: connect VNets (same or different regions) over the Microsoft backbone; not transitive by default.
* **VPN Gateway**: encrypted tunnel over the internet (site-to-site, point-to-site).
* **ExpressRoute**: private dedicated connection to Azure, not over the public internet; higher reliability and lower latency.
* **Load balancing options**:

  * *Load Balancer*: Layer 4 (TCP/UDP), regional.
  * *Application Gateway*: Layer 7 (HTTP), regional, with WAF.
  * *Front Door*: Layer 7, global, CDN + WAF.
  * *Traffic Manager*: DNS-based global routing.
* **Azure DNS**: host DNS zones. **Azure Firewall**: managed network firewall. **Bastion**: browser-based RDP/SSH without exposing public IPs.

### 5.6 Public and private endpoints

* **Public endpoint**: service reachable via a public IP/URL (restrict with firewall rules).
* **Private endpoint (Private Link)**: gives a PaaS service (Storage, SQL, Key Vault) a private IP in your VNet; traffic stays on the Microsoft backbone. **Service endpoints** extend VNet identity to a service but the service keeps its public endpoint.

## 6\. Storage

### 6.1 Storage services (under one Storage Account)

|Service|Use|
|-|-|
|**Blob**|Unstructured object data (images, logs, backups, data lake)|
|**Files**|Managed SMB/NFS file shares|
|**Queue**|Simple async messaging (up to 64 KB messages)|
|**Table**|NoSQL key-attribute store|
|**Disks**|VM disks (Managed Disks)|

### 6.2 Access tiers (Blob)

**Hot** (frequent, highest storage cost, lowest access cost) → **Cool** (30+ days) → **Cold** (90+ days) → **Archive** (180+ days, offline, hours to rehydrate). Use lifecycle management policies to move data automatically.

### 6.3 Redundancy

|Option|Copies|Protects from|
|-|-|-|
|**LRS**|3 in one datacenter|Disk/rack failure|
|**ZRS**|3 across AZs in one region|Datacenter failure|
|**GRS**|LRS + 3 copies in paired region|Regional outage|
|**GZRS**|ZRS + copy in paired region|Zone + region failure|
|**RA-GRS / RA-GZRS**|As above + read access to secondary|Read during outage|

### 6.4 Storage account

Globally unique name (3-24 lowercase letters/digits). Types: **Standard general-purpose v2** (default), Premium (SSD; block blobs, file shares, page blobs). Secure with Entra ID/RBAC, SAS tokens, firewall/private endpoints, encryption at rest (always on).

### 6.5 Moving files

* **AzCopy**: CLI for fast copy to/from blob and files.
* **Azure Storage Explorer**: GUI tool.
* **Azure File Sync**: sync on-prem file servers with Azure Files.
* **Azure Data Box**: physical device shipped for offline bulk transfer (TBs to PBs).

### 6.6 Migration

* **Azure Migrate**: central hub to discover, assess and migrate servers, databases, web apps.
* **Azure Database Migration Service**: migrate databases with minimal downtime.
* Data Box for offline data (see above).

## 7\. Identity, access and security

### 7.1 Directory services

* **Microsoft Entra ID** (formerly Azure AD): cloud identity provider (users, groups, apps, SSO). Not the same as on-prem AD DS.
* **Entra Domain Services**: managed domain services (LDAP, Kerberos, group policy) without running domain controllers.
* **Entra Connect**: sync on-prem AD identities to Entra ID (hybrid identity).
* **External ID (B2B/B2C)**: guest access for partners/customers.

### 7.2 Authentication methods

* **SSO**: sign in once, access many apps.
* **MFA**: something you know + have + are. Methods: Authenticator app, FIDO2 keys, SMS/voice (weakest).
* **Passwordless**: Windows Hello, Authenticator, FIDO2.
* **SSPR**: self-service password reset.
* **Authentication vs authorization**: AuthN = who are you; AuthZ = what can you do (OAuth 2.0 / OpenID Connect are the protocols).

### 7.3 Conditional Access

If-then policies evaluated at sign-in: *signals* (user, location, device, app, risk) → *decision* (block, require MFA, require compliant device). Needs Entra ID P1+.

### 7.4 RBAC

Controls **what** authenticated identities can do on Azure resources.

* Role assignment = **security principal** (user/group/service principal/managed identity) + **role definition** + **scope** (management group, subscription, RG, resource). Inherited downward.
* Built-in roles: **Owner** (all + assign roles), **Contributor** (all except assigning roles), **Reader** (view only), **User Access Administrator**.
* Give least privilege at the narrowest scope. RBAC ≠ Entra roles (Entra roles manage the directory itself).

### 7.5 Zero Trust and defense in depth

* **Zero Trust**: "never trust, always verify"; verify explicitly, use least privilege, assume breach.
* **Defense in depth** layers: Physical → Identity/Access → Perimeter (DDoS, firewall) → Network (NSG, segmentation) → Compute (patching) → Application → Data (encryption).

### 7.6 Microsoft Defender for Cloud

CSPM (posture management, **Secure Score**, recommendations) and CWPP (threat protection for VMs, containers, databases, storage). Works across Azure, on-prem and other clouds.

\---

# Module 3: Management and Governance

## 8\. Cost management

### 8.1 Factors affecting cost

Resource type and size, region, usage/consumption, **bandwidth** (inbound free; outbound charged), subscription type, reserved vs pay-as-you-go, Azure Hybrid Benefit (bring existing Windows/SQL licenses), Spot pricing, and support plan.

### 8.2 Pricing Calculator vs TCO Calculator

* **Pricing Calculator**: estimate the monthly cost of Azure services you plan to use.
* **TCO Calculator**: compare on-prem cost vs Azure over a period (3-5 yrs) to build a migration business case.

### 8.3 Cost Management + Billing

Analyze spend by scope, set **budgets**, alerts, get forecasts, export data, and see recommendations.

### 8.4 Tags

Key-value metadata on resources/RGs/subscriptions (e.g., `env=prod`, `owner=teamA`, `costcenter=123`) for cost allocation, organization and automation. **Not inherited** by default; use Azure Policy to enforce/inherit.

## 9\. Governance and compliance

* **Azure Blueprints**: packaged environment definitions (RBAC, policy, ARM templates, RGs). **Deprecated** by Microsoft; use **Template Specs + Deployment Stacks** and Azure Policy instead. Still appears in older course material.
* **Azure Policy**: creates rules on resources (e.g., allow only certain regions/SKUs, require tags). Effects: Deny, Audit, Append, Modify, DeployIfNotExists. Policy = *what resources may look like*; RBAC = *who may do what*.
* **Resource locks**: **CanNotDelete** or **ReadOnly** on subscription/RG/resource; inherited; override even Owner permissions until removed (only Owner/User Access Admin can remove).
* **Microsoft Purview**: data governance/compliance. **Service Trust Portal**: compliance reports and audits.

## 10\. Managing and deploying resources

* **Azure Portal**: web GUI; good for exploring and one-off tasks. Not repeatable.
* **Cloud Shell**: browser-based Bash/PowerShell with CLI preinstalled.
* **Azure CLI** (`az`, cross-platform) and **Azure PowerShell** (Az module): scriptable, automatable.
* **Azure Arc**: extend Azure management (policy, monitoring, Defender) to on-prem, other-cloud servers, Kubernetes and data services.
* **Azure Resource Manager (ARM)**: the single control plane; every request (Portal, CLI, SDK, REST) goes through it for auth, validation and deployment.
* **Infrastructure as Code**: **ARM templates** (JSON, declarative, idempotent) and **Bicep** (cleaner DSL that compiles to ARM). Also Terraform.

```bash
az login
az group create -n rg-demo -l centralindia
az storage account create -n stdemo12345 -g rg-demo --sku Standard\_LRS
az deployment group create -g rg-demo -f main.bicep
az group delete -n rg-demo --yes --no-wait
```

## 11\. Monitoring

* **Azure Advisor**: personalized recommendations in 5 areas: **Reliability, Security, Performance, Cost, Operational Excellence**.
* **Azure Service Health**: personalized view of Azure incidents. Includes *Azure Status* (global), *Service Health* (your services/regions), and *Resource Health* (a specific resource).
* **Azure Monitor**: collects metrics and logs across resources. Components: **Metrics**, **Log Analytics** (query with KQL), **Alerts** and action groups, **Application Insights** (APM for apps: traces, exceptions, dependencies), dashboards/workbooks.

\---

# Extra Topics Every SDE-1 Should Know

## Data services

* **Azure SQL Database** (managed SQL Server, PaaS); **Azure Database for PostgreSQL/MySQL**.
* **Cosmos DB**: globally distributed NoSQL, multiple APIs, tunable consistency (Strong → Eventual), RU/s throughput.
* **Azure Cache for Redis**: in-memory cache for speed.

## Secrets and identity for apps

* **Never hard-code secrets.** Store them in **Azure Key Vault** (secrets, keys, certificates).
* **Managed Identity**: Azure-managed identity for your app, so it authenticates to Key Vault, Storage, SQL with no credentials in code. *System-assigned* (tied to the resource) or *user-assigned* (reusable).
* **Service principal**: identity for apps/automation (CI/CD) when managed identity isn't possible.
* Use `DefaultAzureCredential` in the Azure SDK: works with your login locally and managed identity in Azure.

## Messaging and integration

|Service|Purpose|
|-|-|
|**Service Bus**|Enterprise messaging: queues, topics/subscriptions, ordering, dead-letter|
|**Event Grid**|Reactive events (discrete, "something happened")|
|**Event Hubs**|High-throughput streaming/telemetry ingestion (Kafka-compatible)|
|**Storage Queues**|Simple, cheap queues|
|**API Management**|Publish, secure, throttle APIs|
|**Logic Apps**|Low-code workflows|

## DevOps / CI-CD

**Azure DevOps** (Repos, Pipelines, Boards, Artifacts) or **GitHub Actions**. Typical flow: commit → build/test → container image to **Azure Container Registry (ACR)** → deploy to App Service/AKS with staging slots → monitor via Application Insights.

## Design principles to remember

* Design for failure: retries with backoff, timeouts, circuit breakers, idempotent operations.
* Keep services **stateless**; store state in DB/cache/storage so you can scale out.
* Use zones for high availability, paired regions/Traffic Manager/Front Door for DR.
* Tag everything, set budgets, delete unused dev resources (cost hygiene).
* Least privilege everywhere (RBAC, NSG, managed identities).

\---

# Quick Reference and Exam-Style Cheat Sheet

|Question|Answer|
|-|-|
|Protect against datacenter failure?|Availability Zones / ZRS|
|Protect against region failure?|Region pairs / GRS / GZRS|
|Who patches the OS in PaaS?|Microsoft|
|Who is always responsible for data?|You|
|Stop deletion of an RG?|Resource lock (CanNotDelete)|
|Restrict allowed regions?|Azure Policy|
|Who can do what?|RBAC|
|Estimate new Azure spend?|Pricing Calculator|
|Compare on-prem vs Azure?|TCO Calculator|
|Cheapest storage for rare access?|Archive tier|
|Private IP for PaaS service?|Private Endpoint|
|Dedicated private link to Azure?|ExpressRoute|
|Bulk offline data transfer?|Data Box|
|Manage on-prem servers from Azure?|Azure Arc|
|Recommendations to cut cost/improve security?|Azure Advisor|
|Is Azure having an outage affecting me?|Service Health|
|Secure Score / posture?|Defender for Cloud|
|Deploy repeatable infra?|ARM template / Bicep|

**Scope hierarchy**: Management Group → Subscription → Resource Group → Resource (policies, RBAC and locks inherit downward).

