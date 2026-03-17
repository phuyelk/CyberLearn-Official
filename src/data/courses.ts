export interface ContentBlock {
  type: "text" | "callout" | "quiz" | "code" | "multi-quiz" | "order" | "scenario" | "fill-blank";
  value?: string;
  variant?: "info" | "warning" | "tip";
  title?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  explanation?: string;
  language?: string;
  items?: string[];
  setup?: string;
  choices?: ScenarioChoice[];
  answer?: string;
  acceptedAnswers?: string[];
  hint?: string;
}

export interface ScenarioChoice {
  text: string;
  isCorrect: boolean;
  outcome: string;
}

export interface Lesson {
  title: string;
  slug: string;
  content: ContentBlock[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessonCount: number;
  lessons: Lesson[];
}

export const courses: Course[] = [
{
  slug: "cloud-security-fundamentals",
  title: "Cloud Security Fundamentals",
  description: "Understand the shared responsibility model, cloud-native threats, and how to secure workloads across major cloud platforms.",
  category: "Cloud Security",
  difficulty: "Intermediate",
  duration: "~25 min",
  lessonCount: 3,
  lessons: [
    {
      title: "The Shared Responsibility Model",
      slug: "shared-responsibility-model",
      content: [
        {
          type: "text",
          value: "Cloud providers like AWS, Azure, and GCP operate under a shared responsibility model. The provider secures the underlying infrastructure — physical data centers, hypervisors, and global network — while customers are responsible for everything they deploy on top: operating systems, applications, data, and access controls."
        },
        {
          type: "text",
          value: "Misunderstanding this boundary is the leading cause of cloud breaches. A common mistake is assuming the provider handles encryption or access policies automatically. In IaaS, you manage nearly everything above the hypervisor. In SaaS, the provider handles more, but you still own identity, data classification, and sharing settings."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Default Settings Are Not Secure",
          value: "Most cloud services launch with permissive defaults — public S3 buckets, open security groups, and no encryption at rest. Always audit default configurations before deploying workloads."
        },
        {
          type: "quiz",
          question: "In an IaaS model, who is responsible for patching the guest operating system?",
          options: [
            "The cloud provider",
            "The customer",
            "Both equally",
            "Neither — it is automated"
          ],
          correctIndex: 1,
          explanation: "In IaaS, the customer manages the guest OS and everything above it, including patches, runtime, and application code. The provider only manages the physical hardware and hypervisor layer."
        }
      ]
    },
    {
      title: "Identity and Network Controls in the Cloud",
      slug: "identity-network-controls-cloud",
      content: [
        {
          type: "text",
          value: "Cloud IAM (Identity and Access Management) policies define who can do what on which resources. Overly broad policies like granting full admin access to all services violate least privilege and create massive blast radius if credentials are compromised. Use role-based policies scoped to specific services and actions."
        },
        {
          type: "text",
          value: "Network controls include Virtual Private Clouds (VPCs), security groups, network ACLs, and private endpoints. A well-segmented cloud network isolates workloads so that a compromised web server cannot reach your database directly. Use private subnets for backend services and expose only load balancers to the internet."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Use Condition Keys",
          value: "Cloud IAM policies support condition keys that restrict access based on IP range, time of day, MFA status, or source VPC. Adding conditions significantly reduces the risk of credential misuse."
        },
        {
          type: "quiz",
          question: "What is the primary risk of overly permissive IAM policies?",
          options: [
            "Slower API response times",
            "Higher cloud billing costs",
            "Larger blast radius when credentials are compromised",
            "Incompatibility with third-party tools"
          ],
          correctIndex: 2,
          explanation: "Broad IAM policies mean compromised credentials can access far more resources than necessary. Least-privilege policies limit damage by restricting what any single identity can do."
        }
      ]
    },
    {
      title: "Securing Cloud Storage and Data",
      slug: "securing-cloud-storage-data",
      content: [
        {
          type: "text",
          value: "Cloud storage services like S3, Azure Blob, and GCS are frequent targets because misconfigured buckets expose sensitive data publicly. Enable server-side encryption (SSE) for data at rest, enforce HTTPS for data in transit, and use bucket policies that explicitly deny public access unless required."
        },
        {
          type: "text",
          value: "Logging and monitoring are essential. Enable access logging on storage buckets to track who accessed what and when. Cloud-native tools like AWS CloudTrail, Azure Monitor, and GCP Audit Logs provide visibility into API calls and configuration changes that could indicate compromise or misconfiguration."
        },
        {
          type: "callout",
          variant: "info",
          title: "Versioning and MFA Delete",
          value: "Enable object versioning on critical buckets to recover from accidental or malicious deletion. MFA Delete requires multi-factor authentication to permanently remove objects, adding a strong safeguard against ransomware-style attacks."
        },
        {
          type: "quiz",
          question: "Which control best prevents accidental public exposure of cloud storage?",
          options: [
            "Enabling versioning",
            "Using server-side encryption",
            "Applying a bucket policy that explicitly denies public access",
            "Enabling access logging"
          ],
          correctIndex: 2,
          explanation: "A deny-public-access bucket policy ensures no object can be made public regardless of individual object ACLs. Encryption protects data confidentiality but does not prevent public access."
        }
      ]
    }
  ]
},
{
  slug: "wireless-network-security",
  title: "Wireless Network Security",
  description: "Learn how Wi-Fi protocols work, common wireless attacks, and how to secure wireless networks against eavesdropping and unauthorized access.",
  category: "Network Security",
  difficulty: "Intermediate",
  duration: "~25 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Wi-Fi Protocols and Encryption",
      slug: "wifi-protocols-encryption",
      content: [
        {
          type: "text",
          value: "Wi-Fi security has evolved through several generations: WEP (broken, never use), WPA (improved but flawed), WPA2 (AES-CCMP, current standard), and WPA3 (SAE handshake, forward secrecy). Each generation addressed weaknesses in its predecessor. WPA2-Enterprise with 802.1X and RADIUS provides per-user authentication and is the recommended minimum for organizations."
        },
        {
          type: "text",
          value: "The four-way handshake in WPA2 establishes a session key without transmitting the pre-shared key. However, an attacker who captures this handshake can perform offline dictionary attacks against weak passwords. WPA3's Simultaneous Authentication of Equals (SAE) replaces the handshake with a protocol resistant to offline attacks, even if the password is weak."
        },
        {
          type: "callout",
          variant: "warning",
          title: "WEP Is Completely Broken",
          value: "WEP can be cracked in minutes using freely available tools. If any network in your environment still uses WEP, upgrade immediately. There is no safe way to run WEP."
        },
        {
          type: "quiz",
          question: "What advantage does WPA3-SAE provide over WPA2-PSK?",
          options: [
            "Faster connection speeds",
            "Resistance to offline dictionary attacks on captured handshakes",
            "Backward compatibility with WEP devices",
            "Longer encryption key length"
          ],
          correctIndex: 1,
          explanation: "WPA3's SAE handshake ensures that capturing the authentication exchange does not allow offline brute-force attacks. In WPA2-PSK, a captured four-way handshake can be attacked offline against weak passwords."
        }
      ]
    },
    {
      title: "Common Wireless Attacks",
      slug: "common-wireless-attacks",
      content: [
        {
          type: "text",
          value: "Evil twin attacks involve setting up a rogue access point with the same SSID as a legitimate network. Unsuspecting users connect to the attacker's AP, which can intercept all traffic, inject malicious content, or harvest credentials. Deauthentication attacks force clients off a legitimate AP, pushing them toward the evil twin."
        },
        {
          type: "text",
          value: "Other wireless attacks include KRACK (Key Reinstallation Attacks) against WPA2, which manipulates handshake messages to force nonce reuse and decrypt traffic. Bluetooth attacks like BlueBorne exploit vulnerabilities in the Bluetooth stack to gain remote code execution without pairing. Wardriving involves scanning for vulnerable wireless networks from a moving vehicle."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Detect Rogue APs",
          value: "Use wireless intrusion detection systems (WIDS) to monitor for unauthorized access points broadcasting your SSID. Enterprise solutions from Cisco, Aruba, and others can automatically contain rogue APs by sending deauth frames."
        },
        {
          type: "quiz",
          question: "How does a deauthentication attack help an evil twin attack succeed?",
          options: [
            "It encrypts traffic so users cannot see the real network",
            "It forces clients to disconnect from the legitimate AP, making them reconnect to the attacker's AP",
            "It changes the SSID of the real network",
            "It disables WPA2 encryption on the target network"
          ],
          correctIndex: 1,
          explanation: "Deauthentication frames are unencrypted management frames in 802.11. An attacker sends spoofed deauth frames to disconnect clients, who then auto-reconnect — often to the stronger-signal evil twin AP."
        }
      ]
    },
    {
      title: "Securing Wireless Networks",
      slug: "securing-wireless-networks",
      content: [
        {
          type: "text",
          value: "Securing wireless starts with strong authentication: WPA3 where supported, WPA2-Enterprise with 802.1X for organizations, and long random passphrases for WPA2-PSK home networks. Disable WPS (Wi-Fi Protected Setup) — its PIN-based mode is trivially brute-forced. Segment wireless traffic from wired networks using VLANs, and put IoT devices on isolated guest networks."
        },
        {
          type: "text",
          value: "Operational hardening includes disabling SSID broadcast only as a minor measure (determined attackers detect hidden SSIDs easily), using 802.11w Protected Management Frames to prevent deauthentication attacks, and regularly auditing connected devices. For enterprises, deploy Network Access Control (NAC) to verify device health and compliance before granting network access."
        },
        {
          type: "callout",
          variant: "info",
          title: "802.11w Management Frame Protection",
          value: "802.11w (now mandatory in WPA3) encrypts management frames like deauthentication and disassociation. This prevents the spoofed deauth attacks commonly used in evil twin and handshake capture attacks."
        },
        {
          type: "quiz",
          question: "Why should WPS be disabled on wireless access points?",
          options: [
            "It slows down Wi-Fi speeds",
            "Its PIN mode can be brute-forced to recover the WPA passphrase",
            "It conflicts with WPA3",
            "It only works with WEP encryption"
          ],
          correctIndex: 1,
          explanation: "WPS PIN mode uses an 8-digit PIN that can be brute-forced in hours due to a design flaw that splits validation into two halves. Once cracked, the attacker obtains the full WPA/WPA2 passphrase."
        }
      ]
    }
  ]
},
{
  slug: "threat-intelligence-basics",
  title: "Threat Intelligence Basics",
  description: "Learn how to collect, analyze, and apply threat intelligence using frameworks like MITRE ATT&CK to improve your organization's defenses.",
  category: "Threat Intelligence",
  difficulty: "Intermediate",
  duration: "~25 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Understanding Threat Intelligence",
      slug: "understanding-threat-intelligence",
      content: [
        {
          type: "text",
          value: "Threat intelligence is evidence-based knowledge about existing or emerging threats that informs security decisions. It goes beyond raw data (IP addresses, hashes) to provide context: who is attacking, why, how, and what you can do about it. The intelligence lifecycle includes planning, collection, processing, analysis, dissemination, and feedback."
        },
        {
          type: "text",
          value: "There are four levels of threat intelligence. Strategic intelligence informs executive decisions about risk. Tactical intelligence describes attacker TTPs for security teams. Operational intelligence provides details about specific campaigns or attacks in progress. Technical intelligence includes IOCs (Indicators of Compromise) like malicious IPs, domains, and file hashes used in detection rules."
        },
        {
          type: "callout",
          variant: "info",
          title: "Intelligence vs. Data",
          value: "A list of malicious IP addresses is data, not intelligence. Intelligence adds context: which threat actor uses those IPs, what campaign they support, what the attacker's objectives are, and how long the indicators remain valid."
        },
        {
          type: "quiz",
          question: "What distinguishes threat intelligence from raw threat data?",
          options: [
            "Intelligence is always classified",
            "Intelligence adds context like attribution, motivation, and actionable recommendations",
            "Data is more accurate than intelligence",
            "Intelligence only applies to nation-state threats"
          ],
          correctIndex: 1,
          explanation: "Raw data (hashes, IPs) becomes intelligence when enriched with context: who is behind it, what they target, how long indicators are valid, and what defensive actions to take."
        }
      ]
    },
    {
      title: "MITRE ATT&CK Framework",
      slug: "mitre-attack-framework",
      content: [
        {
          type: "text",
          value: "MITRE ATT&CK is a knowledge base of adversary tactics and techniques based on real-world observations. It organizes attacker behavior into a matrix: tactics (the why — Initial Access, Execution, Persistence, etc.) and techniques (the how — Spearphishing, PowerShell, Registry Run Keys, etc.). Each technique includes real-world examples, detection guidance, and mitigations."
        },
        {
          type: "text",
          value: "Security teams use ATT&CK to map detection coverage — identifying which techniques their tools can detect and where gaps exist. Red teams use it to structure adversary emulation plans. Threat intelligence teams map threat actor profiles to ATT&CK techniques, enabling defenders to prioritize detections against the most relevant threats to their organization."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Start With High-Impact Techniques",
          value: "You cannot detect everything at once. Prioritize ATT&CK techniques that are most commonly used (such as T1059 Command Scripting, T1078 Valid Accounts, T1566 Phishing) and build detection from there."
        },
        {
          type: "quiz",
          question: "How do security teams primarily use the MITRE ATT&CK framework?",
          options: [
            "To replace antivirus software",
            "To map detection coverage and identify gaps in their defenses",
            "To encrypt sensitive data",
            "To comply with GDPR requirements"
          ],
          correctIndex: 1,
          explanation: "ATT&CK provides a common language for mapping which adversary techniques an organization can detect, which it cannot, and where to invest in new detection capabilities."
        }
      ]
    },
    {
      title: "Threat Feeds and Sharing",
      slug: "threat-feeds-sharing",
      content: [
        {
          type: "text",
          value: "Threat feeds provide streams of IOCs — malicious IPs, domains, URLs, and file hashes — that can be ingested into SIEMs, firewalls, and endpoint tools for automated detection and blocking. Sources include commercial feeds (Recorded Future, Mandiant), open-source feeds (AlienVault OTX, Abuse.ch), and ISACs (Information Sharing and Analysis Centers) for specific industries."
        },
        {
          type: "text",
          value: "STIX (Structured Threat Information Expression) and TAXII (Trusted Automated Exchange of Intelligence Information) are standards for representing and sharing threat intelligence. STIX defines the format for threat objects (indicators, malware, campaigns, threat actors) and their relationships. TAXII provides the transport protocol for exchanging STIX data between organizations."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Feed Quality Matters",
          value: "Low-quality threat feeds with stale or false-positive-heavy indicators cause alert fatigue and can block legitimate traffic. Evaluate feeds by freshness, accuracy, and relevance to your threat profile before integrating them into automated blocking."
        },
        {
          type: "quiz",
          question: "What is the role of TAXII in threat intelligence sharing?",
          options: [
            "It defines the format for threat intelligence objects",
            "It provides the transport protocol for exchanging STIX-formatted intelligence between organizations",
            "It scores the severity of vulnerabilities",
            "It encrypts threat data for storage"
          ],
          correctIndex: 1,
          explanation: "TAXII is the transport layer — it defines how STIX objects are requested, sent, and received between systems. STIX defines the content format; TAXII handles the delivery mechanism."
        }
      ]
    }
  ]
},
{
  slug: "identity-access-management",
  title: "Identity & Access Management",
  description: "Master the principles of identity management, authentication protocols, and access control models that protect organizational resources.",
  category: "Access Control",
  difficulty: "Intermediate",
  duration: "~25 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Access Control Models",
      slug: "access-control-models",
      content: [
        {
          type: "text",
          value: "Access control models define how permissions are assigned and enforced. Role-Based Access Control (RBAC) assigns permissions to roles, and users inherit permissions through role membership — ideal for organizations with well-defined job functions. Attribute-Based Access Control (ABAC) evaluates policies based on user attributes, resource attributes, and environmental conditions for fine-grained control."
        },
        {
          type: "text",
          value: "The principle of least privilege states that users should have only the minimum permissions needed to perform their job. Mandatory Access Control (MAC) enforces this through system-level labels (used in military and high-security environments). Discretionary Access Control (DAC) lets resource owners set permissions — flexible but prone to over-sharing. Most enterprises use RBAC with periodic access reviews."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Regular Access Reviews",
          value: "Permissions accumulate over time as users change roles. Conduct quarterly access reviews to remove stale permissions. Automated tools can flag users with excessive or unused privileges for review."
        },
        {
          type: "quiz",
          question: "What is the key advantage of RBAC over DAC?",
          options: [
            "RBAC is faster to implement",
            "RBAC centralizes permission management through roles, reducing errors from individual permission assignments",
            "RBAC does not require user accounts",
            "RBAC eliminates the need for passwords"
          ],
          correctIndex: 1,
          explanation: "RBAC groups permissions into roles that map to job functions. This centralizes management — updating a role updates all members — instead of managing permissions individually for each user, which is error-prone at scale."
        }
      ]
    },
    {
      title: "SSO and Federation Protocols",
      slug: "sso-federation-protocols",
      content: [
        {
          type: "text",
          value: "Single Sign-On (SSO) lets users authenticate once and access multiple applications without re-entering credentials. This improves user experience and security — fewer passwords mean fewer weak or reused passwords. SSO centralizes authentication at an Identity Provider (IdP), which issues tokens to Service Providers (SPs) after verifying the user."
        },
        {
          type: "text",
          value: "SAML 2.0 is the enterprise standard for SSO, using XML assertions exchanged between IdP and SP. OAuth 2.0 is an authorization framework (not authentication) that grants third-party apps limited access via access tokens. OpenID Connect (OIDC) adds an authentication layer on top of OAuth 2.0, providing ID tokens with user identity claims — it is the modern standard for web and mobile SSO."
        },
        {
          type: "callout",
          variant: "info",
          title: "OAuth Is Not Authentication",
          value: "OAuth 2.0 only authorizes access to resources. It does not verify who the user is. Using OAuth alone for login is insecure — always use OpenID Connect (which builds on OAuth) for authentication."
        },
        {
          type: "quiz",
          question: "What does OpenID Connect add on top of OAuth 2.0?",
          options: [
            "Encryption for all API calls",
            "An authentication layer with ID tokens containing user identity claims",
            "A replacement for SAML",
            "Passwordless authentication"
          ],
          correctIndex: 1,
          explanation: "OAuth 2.0 handles authorization (access tokens for resources). OIDC adds authentication by introducing an ID token — a JWT containing claims about who the user is (sub, email, name) — verified by the relying party."
        }
      ]
    },
    {
      title: "Privileged Access and Zero Trust",
      slug: "privileged-access-zero-trust",
      content: [
        {
          type: "text",
          value: "Privileged Access Management (PAM) secures accounts with elevated permissions — domain admins, root accounts, database admins. PAM solutions vault privileged credentials, enforce just-in-time access (granting admin rights only when needed and revoking them after), record sessions for audit, and require approval workflows for sensitive actions."
        },
        {
          type: "text",
          value: "Zero Trust assumes no implicit trust based on network location. Every access request is verified based on identity, device health, location, and behavior — regardless of whether it originates inside or outside the corporate network. Key principles: verify explicitly, use least-privilege access, and assume breach. Micro-segmentation, continuous authentication, and conditional access policies implement Zero Trust."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Shared Admin Accounts",
          value: "Never use shared admin accounts. They eliminate accountability — if something goes wrong, you cannot determine who did it. Use individual named accounts with PAM-controlled elevation for all privileged access."
        },
        {
          type: "quiz",
          question: "What is the core principle of Zero Trust architecture?",
          options: [
            "Trust users inside the corporate network",
            "Never trust, always verify — regardless of network location",
            "Block all external traffic",
            "Require VPN for all connections"
          ],
          correctIndex: 1,
          explanation: "Zero Trust eliminates implicit trust based on network perimeter. Every request is authenticated and authorized based on identity, device posture, and context — whether the user is on the LAN or a coffee shop Wi-Fi."
        }
      ]
    }
  ]
},
{
  slug: "reverse-engineering-basics",
  title: "Reverse Engineering Basics",
  description: "Learn the fundamentals of reverse engineering, binary analysis, and understanding compiled code.",
  category: "Offensive Security",
  difficulty: "Advanced",
  duration: "~30 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Introduction to Binary Analysis",
      slug: "introduction-to-binary-analysis",
      content: [
        {
          type: "text",
          value: "Binary analysis forms the foundation of reverse engineering. When analyzing compiled executables, you work with machine code that has lost high-level abstractions—variable names, type information, and control flow structure. The ELF (Executable and Linkable Format) and PE (Portable Executable) formats encode metadata in headers: entry points, section tables, import/export directories, and relocation information. Understanding these structures allows you to locate critical code paths, identify anti-analysis techniques, and map program behavior without source access."
        },
        {
          type: "text",
          value: "Static analysis examines the binary without execution. Key techniques include identifying the compiler and packer signatures through entropy analysis and section characteristics, reconstructing control flow graphs (CFGs) from disassembly, and detecting known patterns such as string encryption routines or API call sequences. Tools like radare2, Ghidra, and IDA Pro provide different abstraction levels—from raw hex to pseudo-C decompilation—each suited to specific analysis phases."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Legal Considerations",
          value: "Reverse engineering may violate DMCA Section 1201, EULA terms, or computer fraud statutes in your jurisdiction. Always obtain explicit authorization before analyzing software you do not own or have rights to analyze. Document your authorization scope and maintain chain-of-custody for any artifacts."
        },
        {
          type: "quiz",
          question: "What is the primary purpose of analyzing the PE/ELF section table during static binary analysis?",
          options: [
            "To extract embedded configuration files",
            "To identify code vs data regions, locate entry points, and detect packer/obfuscation",
            "To decrypt strings at runtime",
            "To patch the binary for debugging"
          ],
          correctIndex: 1,
          explanation: "Section tables define memory regions (code, data, BSS, etc.), their permissions, and virtual addresses. This enables locating executable regions, understanding memory layout, and detecting anomalies like high entropy or unusual section names that indicate packing."
        },
        {
          type: "code",
          language: "bash",
          value: "objdump -h binary.elf | head -40"
        }
      ]
    },
    {
      title: "Disassembly and Decompilation",
      slug: "disassembly-and-decompilation",
      content: [
        {
          type: "text",
          value: "Disassembly translates raw bytes into assembly mnemonics. The challenge is distinguishing code from data—a single misaligned disassembly can cascade into incorrect CFG reconstruction. Linear sweep assumes sequential execution; recursive traversal follows control flow (calls, jumps, returns) and is more accurate for variable-length instruction sets like x86. ARM and RISC-V have fixed instruction sizes, simplifying disassembly. Obfuscation techniques—junk bytes, overlapping instructions, self-modifying code—deliberately break naive disassembly."
        },
        {
          type: "text",
          value: "Decompilation elevates assembly to higher-level representations. Modern decompilers (Ghidra, Hex-Rays, Binary Ninja) use pattern matching, data flow analysis, and type inference to recover structures approximating original source. They handle calling conventions, stack frames, and common idioms. Output quality depends on compiler optimizations—heavily optimized code produces less readable pseudo-C. Understanding compiler output patterns (e.g., switch statement lowering, tail call optimization) improves interpretation."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Decompiler Limitations",
          value: "Decompilers often misidentify types and produce false positives for structures. Cross-reference the decompiled output with raw disassembly for security-critical paths. Pay attention to pointer arithmetic and casts—these frequently indicate custom data structures or obfuscation."
        },
        {
          type: "quiz",
          question: "Why does recursive traversal produce more accurate disassembly than linear sweep on x86?",
          options: [
            "It runs faster on multi-core systems",
            "x86 has variable-length instructions; linear sweep can misalign and disassemble data as code",
            "Recursive traversal supports more output formats",
            "Linear sweep cannot handle 64-bit binaries"
          ],
          correctIndex: 1,
          explanation: "Variable-length x86 instructions mean the disassembler must know where instructions start. Linear sweep assumes sequential flow; a jump into the middle of an instruction or data embedded in code causes cascading misalignment. Recursive traversal follows actual control flow, starting disassembly only at known entry points."
        },
        {
          type: "code",
          language: "bash",
          value: "ghidra_headless binary.elf -import -postScript Decompile.java -scriptPath /scripts"
        }
      ]
    },
    {
      title: "Dynamic Analysis and Debugging",
      slug: "dynamic-analysis-and-debugging",
      content: [
        {
          type: "text",
          value: "Dynamic analysis observes behavior at runtime. Debuggers (GDB, WinDbg, x64dbg) provide breakpoints, watchpoints, and execution tracing. Instrumentation frameworks like Frida and PIN enable hooking arbitrary functions, modifying arguments/return values, and tracing syscalls. The key advantage over static analysis: you see actual values, bypass obfuscation that only executes at runtime, and observe anti-debugging or VM-detection behavior. The tradeoff is coverage—you only see executed paths."
        },
        {
          type: "text",
          value: "Anti-analysis detection is common in malware and protected software. Techniques include timing checks (RDTSC), debug register inspection (DR0-DR7), NtQueryInformationProcess for debug flags, and exception handler abuse. Evasion strategies: patch detection routines, use hardware breakpoints sparingly, run in controlled VMs with consistent timing, or employ emulation (QEMU, Unicorn) for isolated code execution. Always assume your analysis environment may be fingerprinted."
        },
        {
          type: "callout",
          variant: "info",
          title: "Sandbox Isolation",
          value: "Run dynamic analysis in isolated VMs or containers with no network access to production systems. Malware may attempt lateral movement, data exfiltration, or destructive actions. Use snapshot/restore for repeatable analysis and consider bare-metal analysis for rootkit-level samples."
        },
        {
          type: "quiz",
          question: "What is a primary limitation of dynamic analysis compared to static analysis?",
          options: [
            "Dynamic analysis cannot handle encrypted binaries",
            "You only observe executed code paths; unexplored branches remain unanalyzed",
            "Debuggers cannot attach to 64-bit processes",
            "Dynamic analysis requires source code"
          ],
          correctIndex: 1,
          explanation: "Dynamic analysis is path-dependent. Code that only executes under specific conditions (e.g., after a certain date, with specific input, or in a particular environment) may never run during your session. Static analysis examines the entire binary regardless of execution."
        },
        {
          type: "code",
          language: "javascript",
          value: "Interceptor.attach(Module.findExportByName(null, \"strcmp\"), {\n  onEnter: function(args) { this.a = args[0].readCString(); this.b = args[1].readCString(); },\n  onLeave: function(retval) { console.log(this.a + \" vs \" + this.b + \" => \" + retval); }\n});"
        }
      ]
    }
  ]
},
{
  slug: "digital-forensics",
  title: "Digital Forensics",
  description: "Master digital forensics techniques for investigating security incidents, evidence collection, and chain of custody.",
  category: "Forensics",
  difficulty: "Advanced",
  duration: "~30 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Forensic Acquisition and Evidence",
      slug: "forensic-acquisition-and-evidence",
      content: [
        {
          type: "text",
          value: "Forensic acquisition must preserve evidence integrity for legal admissibility. Create bit-for-bit copies (forensic images) using hardware write-blockers to prevent modification of source media. Hash the original and copy at acquisition—SHA-256 or SHA-512—and document the hash in your chain-of-custody form. Any subsequent analysis works on the copy; the original remains sealed. Live system acquisition (memory, volatile data) occurs before power-down when investigating running systems, but alters state and must be documented."
        },
        {
          type: "text",
          value: "Evidence handling follows the ACPO (Association of Chief Police Officers) principles: no action should change data that may be relied upon in court; individuals must be competent; an audit trail must be created; the case lead is responsible for compliance. In practice: document every step, use forensically sound tools that produce verifiable output, maintain write-blocking throughout, and never work on original evidence. Timestamps, tool versions, and operator credentials belong in your case notes."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Legal Admissibility",
          value: "Forensic evidence may be excluded if collection violated chain of custody, tools are not validated, or methodology cannot be reproduced. Consult legal counsel and follow jurisdiction-specific requirements (e.g., FRE 902(14) for US federal, local rules for state courts)."
        },
        {
          type: "quiz",
          question: "Why must forensic acquisition use write-blockers?",
          options: [
            "To accelerate the imaging process",
            "To prevent the acquisition tool from modifying source media, preserving evidence integrity",
            "To encrypt the forensic image",
            "To enable parallel imaging of multiple drives"
          ],
          correctIndex: 1,
          explanation: "Write-blockers ensure the acquisition system cannot write to the source drive. Even read operations can trigger drive firmware or OS behaviors that alter data. Unmodified source media is required for defensible chain of custody and legal admissibility."
        },
        {
          type: "code",
          language: "bash",
          value: "dc3dd if=/dev/sdb of=evidence.img hash=sha256 log=acquisition.log"
        }
      ]
    },
    {
      title: "Memory and Disk Analysis",
      slug: "memory-and-disk-analysis",
      content: [
        {
          type: "text",
          value: "Memory forensics captures RAM state: running processes, loaded modules, network connections, and artifacts that never touch disk. Volatility 3 and Rekall parse memory dumps to extract process lists, DLLs, command history, and malware-injected code. Memory structures (EPROCESS, PEB, TEB on Windows; task_struct on Linux) are version-specific—you must identify the OS build to use correct profiles. Unallocated memory may contain remnants of terminated processes or wiped data; carving recovers fragments."
        },
        {
          type: "text",
          value: "Disk analysis focuses on file system metadata and unallocated space. NTFS $MFT, $LogFile, and $UsnJrnl record file creation, modification, and deletion—often recoverable after file deletion. FAT exFAT journals provide similar metadata. Carving (file signature-based recovery) extracts files from unallocated clusters without file system metadata; success depends on fragmentation and overwriting. Timestamp analysis (MACB: Modified, Accessed, Changed, Birth) builds timelines of activity."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Profile Selection",
          value: "Volatility profiles must match the exact kernel version of the captured system. Use 'volatility -f memory.dmp imageinfo' to suggest profiles, or 'linux.banner' / 'windows.info' for identification. Wrong profiles produce garbage output or crashes."
        },
        {
          type: "quiz",
          question: "What does $UsnJrnl (Update Sequence Number Journal) on NTFS primarily record?",
          options: [
            "File content checksums",
            "Changes to files and directories—creation, renaming, deletion, attribute changes",
            "User login events",
            "Encryption keys for EFS"
          ],
          correctIndex: 1,
          explanation: "$UsnJrnl is a change journal logging file system modifications. It records what changed, when, and by which process. This enables timeline reconstruction and detection of file operations that may have been performed by malware or during an incident."
        },
        {
          type: "code",
          language: "bash",
          value: "volatility -f memory.raw windows.cmdline"
        }
      ]
    },
    {
      title: "Timeline and Chain of Custody",
      slug: "timeline-and-chain-of-custody",
      content: [
        {
          type: "text",
          value: "Super timelines aggregate timestamps from multiple sources—file system metadata, registry, event logs, browser history, prefetch—into a unified chronological view. Tools like Plaso (log2timeline), Timesketch, and Autopsy build timelines that reveal attacker activity sequences: when malware was executed, what was exfiltrated, and lateral movement steps. Correlating timestamps across systems reconstructs incident chronology. Timezone handling is critical; normalize to UTC and document timezone assumptions."
        },
        {
          type: "text",
          value: "Chain of custody documents who possessed evidence, when, and under what conditions. Each transfer—from scene to lab, analyst to analyst, storage to court—requires a signed entry. Gaps or undocumented handling can result in evidence exclusion. Use standardized forms, secure storage with access logs, and cryptographic hashes to detect tampering. Digital evidence presents unique challenges: copies are identical to originals, so hash verification is essential at each custody transfer."
        },
        {
          type: "callout",
          variant: "info",
          title: "Documentation Standards",
          value: "Maintain a case notebook with dated entries for every action. Include tool commands, parameters, output excerpts, and screenshots. Your notes may be subpoenaed; assume they will be scrutinized by opposing experts. Inconsistent or missing documentation undermines credibility."
        },
        {
          type: "quiz",
          question: "Why is normalizing timestamps to UTC important in forensic timeline analysis?",
          options: [
            "UTC is required by court systems",
            "Evidence from multiple systems may use different timezones; UTC enables accurate correlation",
            "Forensic tools only accept UTC input",
            "It reduces storage requirements"
          ],
          correctIndex: 1,
          explanation: "Incidents often span systems in different timezones or with misconfigured clocks. Converting to UTC creates a consistent reference for correlating events across sources. Document the original timezone and conversion method for reproducibility."
        },
        {
          type: "code",
          language: "bash",
          value: "log2timeline.py --storage-file timeline.plaso /evidence/image.dd"
        }
      ]
    }
  ]
},
{
  slug: "red-team-operations",
  title: "Red Team Operations",
  description: "Explore adversary simulation, attack planning, and advanced offensive security methodologies.",
  category: "Offensive Security",
  difficulty: "Advanced",
  duration: "~30 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Adversary Emulation",
      slug: "adversary-emulation",
      content: [
        {
          type: "text",
          value: "Adversary emulation replicates specific threat actor TTPs (Tactics, Techniques, and Procedures) rather than arbitrary penetration testing. Frameworks like MITRE ATT&CK map techniques to real-world adversary behavior; red teams select techniques matching the threat profile (e.g., APT29, FIN7) and execute them in sequence. This validates whether defenses detect and respond to realistic attacks. Emulation requires understanding technique implementation—not just the ATT&CK label—and adapting to target environment constraints."
        },
        {
          type: "text",
          value: "Adversary emulation platforms (CALDERA, Atomic Red Team, Infection Monkey) provide automated technique execution with pre-built atomic tests. Customization is often necessary: default payloads may be flagged, techniques may need environment-specific parameters, and some TTPs require manual execution. Document deviations from the threat model and ensure scope alignment. Purple team exercises—red and blue collaborating during emulation—increase defensive visibility and accelerate detection engineering."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Scope and Authorization",
          value: "Red team operations must have explicit, written authorization defining scope, techniques, timing, and exclusion zones. Unauthorized access is illegal regardless of intent. Establish emergency stop procedures and maintain continuous communication with stakeholders during active operations."
        },
        {
          type: "quiz",
          question: "What distinguishes adversary emulation from traditional penetration testing?",
          options: [
            "Adversary emulation only uses automated tools",
            "Emulation replicates specific threat actor TTPs to validate defenses against realistic attack patterns",
            "Penetration testing is illegal; emulation is not",
            "Emulation does not require authorization"
          ],
          correctIndex: 1,
          explanation: "Traditional pentesting often prioritizes finding vulnerabilities. Adversary emulation focuses on executing a defined set of techniques that mirror a specific threat actor, testing whether the organization's controls would detect and respond to that adversary's real-world behavior."
        },
        {
          type: "code",
          language: "yaml",
          value: "technique_id: T1566.001\ndisplay_name: Phishing - Spearphishing Attachment\ntests:\n  - name: Emotet-style doc with macro\n    description: Delivers macro-enabled document\n    executor: command_prompt\n    command: Invoke-MalDoc -Path payload.docm"
        }
      ]
    },
    {
      title: "Attack Planning",
      slug: "attack-planning",
      content: [
        {
          type: "text",
          value: "Effective red team operations require structured planning. Reconnaissance—OSINT, passive DNS, certificate transparency, leaked credentials—informs target selection and initial access vectors. Develop multiple attack paths; single-path plans fail when assumptions break. Map dependencies: which systems must be compromised to reach objectives? Identify detection points and plan evasions or accept detection as a test outcome. Operational security (OPSEC) considerations: avoid burning techniques, use infrastructure that blends with target traffic, and minimize forensic artifacts."
        },
        {
          type: "text",
          value: "Kill chain alignment ensures coverage across the attack lifecycle. Initial access (phishing, external services), execution, persistence, privilege escalation, defense evasion, credential access, discovery, lateral movement, collection, exfiltration—each phase has distinct objectives and detection opportunities. Plan for failure: have fallback techniques, expect some paths to be blocked, and design objectives that can be partially achieved. Post-operation, document what worked, what was detected, and recommendations for defensive improvement."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Objective Design",
          value: "Define clear, measurable objectives (e.g., 'access domain admin credentials' or 'exfiltrate sample from finance share') rather than vague goals. Objectives drive technique selection and provide unambiguous success criteria for the engagement."
        },
        {
          type: "quiz",
          question: "Why should red team plans include multiple attack paths?",
          options: [
            "To increase the total number of vulnerabilities found",
            "Single-path plans fail when assumptions break; alternatives enable adaptation",
            "Multiple paths are required by compliance frameworks",
            "To confuse blue team defenders"
          ],
          correctIndex: 1,
          explanation: "Reconnaissance may be incomplete, defenses may block expected techniques, or target configurations may differ from assumptions. Having alternative paths (different initial access, different privilege escalation) allows the red team to adapt and still achieve objectives."
        },
        {
          type: "code",
          language: "powershell",
          value: "Invoke-AtomicTest T1547.001 -TestNumbers 1,2 -CheckPrereqs"
        }
      ]
    },
    {
      title: "Operational Security",
      slug: "operational-security",
      content: [
        {
          type: "text",
          value: "Red team OPSEC prevents defenders from easily identifying and blocking operations. Infrastructure should resemble legitimate traffic: use domains that blend with target industry, avoid known-bad IP ranges, and rotate infrastructure between engagements. C2 (Command and Control) channels—HTTPS, DNS, or domain fronting—must evade network detection. Payloads should avoid static signatures: use obfuscation, encryption, or compile-time customization. Assume blue team has EDR, network monitoring, and threat intelligence; design evasions accordingly."
        },
        {
          type: "text",
          value: "Operational tempo affects detection. Rapid, noisy execution triggers alerts; slow, measured progression may evade threshold-based detection but extends engagement time. Balance speed against stealth based on objectives. Cleanup—removing persistence, logs, and artifacts—reduces post-engagement forensic evidence but may itself be detectable. Document what cleanup was performed for the after-action report. Never leave backdoors or persistence beyond the authorized engagement period."
        },
        {
          type: "callout",
          variant: "info",
          title: "Attribution Avoidance",
          value: "Red team infrastructure and tooling can be attributed to your organization if discovered. Use separate infrastructure per engagement, avoid reusing domains or certificates, and ensure tool configurations do not leak operator identifiers. Blue team may share IOCs with threat intel; design for anonymity."
        },
        {
          type: "quiz",
          question: "What is a key OPSEC consideration when designing red team C2 infrastructure?",
          options: [
            "C2 must use the fastest available protocol",
            "Infrastructure and traffic should blend with legitimate patterns to evade network detection",
            "C2 servers must be in the same country as the target",
            "All C2 traffic must be encrypted with AES-256"
          ],
          correctIndex: 1,
          explanation: "Network defenders use traffic analysis, certificate inspection, and threat intel to identify C2. Infrastructure that resembles normal business traffic (e.g., cloud provider domains, common CDNs) and uses standard HTTPS reduces the likelihood of detection and blocking."
        },
        {
          type: "code",
          language: "bash",
          value: "cobalt-strike teamserver 192.168.1.100 password123 /path/to/profiles/amazon.profile"
        }
      ]
    }
  ]
},
{
  slug: "secure-devops-cicd",
  title: "Secure DevOps & CI/CD",
  description: "Integrate security into DevOps workflows, CI/CD pipelines, and learn shift-left security practices.",
  category: "DevSecOps",
  difficulty: "Advanced",
  duration: "~30 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Shift-Left Security",
      slug: "shift-left-security",
      content: [
        {
          type: "text",
          value: "Shift-left security moves security activities earlier in the SDLC—from production and deployment to design, development, and commit. The goal: find and fix vulnerabilities before they reach production, when remediation cost is lowest. This requires embedding security tools into developer workflows: SAST (Static Application Security Testing) in IDEs and PR pipelines, dependency scanning in package managers, secret detection in pre-commit hooks, and security-focused code review checklists. Developers become the first line of defense."
        },
        {
          type: "text",
          value: "Implementation challenges include tool noise (false positives erode trust), integration friction (blocking pipelines frustrate velocity), and skill gaps (developers may not interpret security findings). Effective shift-left: tune tools to reduce false positives, provide actionable remediation guidance, integrate findings into existing issue trackers, and offer security training. Security teams shift from gatekeepers to enablers—providing guardrails, not bottlenecks. Measure success by time-to-remediation and vulnerability escape rate, not just scan coverage."
        },
        {
          type: "callout",
          variant: "tip",
          title: "Developer Experience",
          value: "Security tools that block or slow developers without clear value get disabled or bypassed. Prioritize fast feedback, low false positive rates, and integration with existing workflows. Security findings should feel like helpful code review, not punitive audits."
        },
        {
          type: "quiz",
          question: "What is the primary benefit of shift-left security?",
          options: [
            "It eliminates the need for production security monitoring",
            "Finding and fixing vulnerabilities earlier reduces remediation cost and risk",
            "It allows developers to bypass security reviews",
            "Shift-left refers to left-wing political alignment in security policy"
          ],
          correctIndex: 1,
          explanation: "Vulnerabilities discovered in production are expensive to fix (hotfixes, rollbacks, incident response). Fixing during development is cheaper and prevents exposure. Shift-left maximizes early detection and remediation."
        },
        {
          type: "code",
          language: "yaml",
          value: "pre-commit:\n  hooks:\n    - id: detect-secrets\n      args: ['--baseline', '.secrets.baseline']\n    - id: semgrep\n      args: ['--config', 'p/security-audit']"
        }
      ]
    },
    {
      title: "Pipeline Security",
      slug: "pipeline-security",
      content: [
        {
          type: "text",
          value: "CI/CD pipelines are high-value attack targets. Compromised pipelines can inject malicious code into builds, exfiltrate secrets, or deploy backdoored artifacts. Pipeline security requires: least-privilege access to pipeline credentials, signed commits and verified provenance, immutable pipeline definitions (pipeline-as-code in version control), and integrity verification of build artifacts. The pipeline itself must be treated as critical infrastructure—who can modify it, and how are changes audited?"
        },
        {
          type: "text",
          value: "Supply chain security extends to pipeline dependencies. Build agents, base images, and plugins are attack surfaces. Use minimal, pinned base images; scan them for vulnerabilities. Restrict which plugins and external services the pipeline can access. Implement SLSA (Supply-chain Levels for Software Artifacts) or similar frameworks: provenance attestations link artifacts to source commits and build parameters, enabling consumers to verify integrity. Consider a trusted CI environment with restricted network egress."
        },
        {
          type: "callout",
          variant: "warning",
          title: "Pipeline Compromise Impact",
          value: "A compromised pipeline can silently inject malware into every build. Attackers have used this to backdoor widely deployed software. Protect pipeline credentials, audit pipeline changes, and verify artifact provenance before deployment."
        },
        {
          type: "quiz",
          question: "What does SLSA (Supply-chain Levels for Software Artifacts) primarily provide?",
          options: [
            "A vulnerability scoring system for dependencies",
            "Provenance attestations linking artifacts to source and build, enabling integrity verification",
            "A license compliance framework",
            "Encryption standards for artifact storage"
          ],
          correctIndex: 1,
          explanation: "SLSA defines levels of supply chain integrity. Provenance attestations document where artifacts came from (source repo, commit, build parameters), allowing consumers to verify they received what was intended and detect tampering."
        },
        {
          type: "code",
          language: "yaml",
          value: "jobs:\n  build:\n    steps:\n      - uses: actions/checkout@v4\n      - run: go build -o app .\n      - uses: sigstore/cosign-installer@v3\n      - run: cosign sign-blob app --output-signature app.sig"
        }
      ]
    },
    {
      title: "Secrets Management",
      slug: "secrets-management",
      content: [
        {
          type: "text",
          value: "Secrets in code—API keys, passwords, certificates—are a critical vulnerability. Once committed, they exist in git history forever, even if 'removed' in later commits. Scanners (TruffleHog, Gitleaks, GitGuardian) detect secrets in repos and history; prevention requires pre-commit hooks and branch protection. The solution: never commit secrets. Use secrets managers (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) and inject at runtime or build time through secure mechanisms (environment variables from secure sources, OIDC federation, short-lived tokens)."
        },
        {
          type: "text",
          value: "CI/CD pipelines need secrets for deployments, artifact publishing, and integration tests. Avoid long-lived credentials; prefer OIDC/OAuth with identity federation (e.g., GitHub Actions OIDC to AWS) so pipelines request short-lived tokens. Rotate secrets regularly and use different secrets per environment. For containerized workloads, avoid baking secrets into images—use init containers, sidecars, or runtime injection. Audit secret access; centralized managers provide access logs for compliance."
        },
        {
          type: "callout",
          variant: "info",
          title: "Secret Rotation",
          value: "Rotate secrets before they appear in breach dumps or logs. Automated rotation (e.g., Vault dynamic secrets, database credential rotation) reduces exposure window. Document rotation procedures and test them—emergency rotation during an incident is not the time to discover process gaps."
        },
        {
          type: "quiz",
          question: "Why are pre-commit hooks important for secrets management?",
          options: [
            "They encrypt secrets before commit",
            "They prevent secrets from ever entering git history, avoiding permanent exposure",
            "They compress repository size",
            "They validate commit message format"
          ],
          correctIndex: 1,
          explanation: "Once a secret is committed, it exists in git history. Even if removed in a later commit, anyone with repo access can recover it. Pre-commit hooks block commits containing secrets before they enter history."
        },
        {
          type: "code",
          language: "hcl",
          value: "path \"secret/data/ci/*\" {\n  capabilities = [\"read\"]\n  allowed_roles = [\"github-actions\"]\n}\npath \"auth/jwt/login\" {\n  capabilities = [\"create\", \"read\"]\n}"
        }
      ]
    }
  ]
},
{
  slug: "introduction-to-cybersecurity",
  title: "Introduction to Cybersecurity",
  description: "Learn the basics of cybersecurity, why it matters, and how to protect yourself online.",
  category: "Fundamentals",
  difficulty: "Beginner",
  duration: "~20 min",
  lessonCount: 3,
  lessons: [
    {
      title: "What is Cybersecurity?",
      slug: "what-is-cybersecurity",
      content: [
        { type: "text", value: "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks. These attacks often aim to access, change, or destroy sensitive information, extort money, or disrupt business operations. Understanding cybersecurity helps you protect your personal information and stay safe online." },
        { type: "text", value: "The field covers many areas including network security, application security, and information security. As more of our lives move online, basic cybersecurity knowledge becomes essential for everyone, not just IT professionals." },
        { type: "callout", variant: "info", title: "Why It Matters", value: "Cyber attacks cost individuals and businesses billions each year. A single data breach can expose passwords, financial data, and personal information. Learning the basics now can help you avoid becoming a victim." },
        { type: "quiz", question: "What is the primary goal of cybersecurity?", options: ["To make computers faster", "To protect systems, networks, and data from digital attacks", "To design new software", "To manage social media accounts"], correctIndex: 1, explanation: "Cybersecurity focuses on protecting digital assets from unauthorized access, theft, or damage." }
      ]
    },
    {
      title: "Common Threats",
      slug: "common-threats",
      content: [
        { type: "text", value: "Malware is malicious software designed to harm your device or steal data. Viruses, ransomware, and spyware are all types of malware. Phishing uses fake emails or websites to trick you into revealing passwords or financial information." },
        { type: "text", value: "Other common threats include social engineering, where attackers manipulate people into giving up sensitive information, and weak passwords that are easily guessed. Understanding these threats is the first step toward defending against them." },
        { type: "callout", variant: "warning", title: "Ransomware Alert", value: "Ransomware encrypts your files and demands payment to unlock them. Never pay ransom—there is no guarantee you will get your data back, and it funds criminal activity. Regular backups are your best defense." },
        { type: "quiz", question: "Which of these is an example of social engineering?", options: ["A firewall blocking traffic", "An attacker calling and pretending to be tech support to get your password", "Updating your operating system", "Using a VPN"], correctIndex: 1, explanation: "Social engineering relies on human manipulation rather than technical exploits to obtain sensitive information." }
      ]
    },
    {
      title: "Defense Basics",
      slug: "defense-basics",
      content: [
        { type: "text", value: "Strong passwords, software updates, and antivirus protection form the foundation of personal cybersecurity. You should use unique passwords for each account and enable two-factor authentication wherever possible. Keeping software updated patches known vulnerabilities that attackers exploit." },
        { type: "text", value: "Be cautious about what you click and share online. Verify the sender of emails before opening attachments, and think twice before sharing personal information on websites or with strangers. These habits significantly reduce your risk." },
        { type: "callout", variant: "tip", title: "Start Small", value: "You do not need to do everything at once. Begin with strong passwords and enabling 2FA on your most important accounts. Build from there as you learn more." },
        { type: "quiz", question: "What is one of the most effective ways to protect your accounts?", options: ["Using the same password everywhere", "Enabling two-factor authentication", "Sharing passwords with family", "Disabling software updates"], correctIndex: 1, explanation: "Two-factor authentication adds a second verification step, making it much harder for attackers to access your accounts even if they have your password." }
      ]
    }
  ]
},
{
  slug: "how-phishing-works",
  title: "How Phishing Works",
  description: "Understand how phishing attacks trick users and learn to recognize and avoid them.",
  category: "Social Engineering",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "What is Phishing?",
      slug: "what-is-phishing",
      content: [
        { type: "text", value: "Phishing is a type of cyber attack where attackers impersonate legitimate organizations to steal sensitive information. They send emails, messages, or create fake websites that look like real ones to trick you into entering passwords, credit card numbers, or other personal data." },
        { type: "text", value: "The term comes from fishing—attackers cast a wide net hoping someone will bite. Phishing has evolved from obvious scam emails to sophisticated campaigns that are hard to distinguish from legitimate communications." },
        { type: "callout", variant: "info", title: "Scale of the Problem", value: "Phishing is one of the most common cyber attacks. Millions of phishing emails are sent every day, and a significant number of data breaches start with a successful phishing attempt." },
        { type: "quiz", question: "What do phishing attackers typically try to steal?", options: ["Your computer's hardware", "Passwords, credit card numbers, and other personal data", "Your internet connection", "Your software licenses"], correctIndex: 1, explanation: "Phishing aims to obtain sensitive information that can be used for fraud or identity theft." }
      ]
    },
    {
      title: "Recognizing Phishing Attempts",
      slug: "recognizing-phishing-attempts",
      content: [
        { type: "text", value: "Phishing emails often create urgency, asking you to act immediately or face consequences. They may threaten account suspension, claim you have won a prize, or say there is a problem with your account. Legitimate organizations rarely demand immediate action via email." },
        { type: "text", value: "Check the sender's email address carefully—phishers use addresses that look similar but have small differences. Hover over links before clicking to see the real destination URL. Poor grammar and spelling are also common red flags." },
        { type: "callout", variant: "warning", title: "Urgency is a Red Flag", value: "Attackers use urgency to bypass your critical thinking. If an email says your account will be closed in 24 hours or you must verify immediately, slow down and verify through official channels." },
        { type: "quiz", question: "Which is a common sign of a phishing email?", options: ["Professional formatting with no errors", "Urgent language demanding immediate action", "Coming from a known contact", "Containing only text with no links"], correctIndex: 1, explanation: "Phishers create urgency to pressure you into acting without verifying the request." }
      ]
    },
    {
      title: "Protecting Yourself",
      slug: "protecting-yourself",
      content: [
        { type: "text", value: "Never click links in suspicious emails. Instead, type the organization's website address directly into your browser or use a bookmark. If you need to verify an account issue, log in through the official app or website, not through an email link." },
        { type: "text", value: "Enable two-factor authentication on all important accounts. Even if a phisher gets your password, they cannot access your account without the second factor. Report phishing attempts to your email provider and the impersonated organization." },
        { type: "callout", variant: "tip", title: "When in Doubt", value: "If you are unsure whether an email is legitimate, contact the organization directly using a phone number or website you find yourself—never use contact details from the suspicious email." },
        { type: "quiz", question: "What should you do if you receive a suspicious email asking you to click a link?", options: ["Click the link to see what happens", "Type the organization's website directly in your browser instead", "Forward it to all your contacts", "Reply to ask if it is real"], correctIndex: 1, explanation: "Going directly to the official website avoids potentially malicious links and lets you verify any real issues safely." }
      ]
    }
  ]
},
{
  slug: "social-engineering-tactics",
  title: "Social Engineering Tactics",
  description: "Learn how attackers manipulate people and how to defend against psychological tricks.",
  category: "Social Engineering",
  difficulty: "Beginner",
  duration: "~20 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Understanding Social Engineering",
      slug: "understanding-social-engineering",
      content: [
        { type: "text", value: "Social engineering exploits human psychology rather than technical vulnerabilities. Attackers manipulate people into divulging confidential information or performing actions that compromise security. They rely on trust, fear, curiosity, or the desire to be helpful." },
        { type: "text", value: "Because it targets human behavior, social engineering can bypass even the strongest technical defenses. A well-crafted social engineering attack can convince someone to hand over passwords, grant access, or install malware—all without exploiting a single software bug." },
        { type: "callout", variant: "info", title: "Human Weakness", value: "Attackers know that people are often the weakest link in security. They study psychology and use proven techniques that work across cultures and demographics. Awareness is your best defense." },
        { type: "quiz", question: "What does social engineering primarily exploit?", options: ["Software bugs", "Human psychology and behavior", "Network vulnerabilities", "Hardware failures"], correctIndex: 1, explanation: "Social engineering targets human decision-making and emotions rather than technical systems." }
      ]
    },
    {
      title: "Common Tactics",
      slug: "common-tactics",
      content: [
        { type: "text", value: "Pretexting involves creating a fabricated scenario to gain trust. An attacker might pose as IT support, a bank representative, or a colleague in need. They build a story that makes their request seem legitimate and urgent." },
        { type: "text", value: "Baiting offers something enticing—a free USB drive, a prize, or exclusive content—to lure victims into taking an action that compromises security. Tailgating is the physical version: following someone through a secure door without proper authorization." },
        { type: "callout", variant: "warning", title: "Authority Exploitation", value: "Attackers often pretend to be authority figures—managers, police, or tech support—because people are conditioned to comply with authority. Always verify identity through independent channels before sharing sensitive information." },
        { type: "quiz", question: "What is pretexting in social engineering?", options: ["A type of encryption", "Creating a fabricated scenario to gain trust and extract information", "A firewall technique", "A backup method"], correctIndex: 1, explanation: "Pretexting builds a false narrative that makes the victim feel the request is legitimate." }
      ]
    },
    {
      title: "Staying Vigilant",
      slug: "staying-vigilant",
      content: [
        { type: "text", value: "Verify the identity of anyone requesting sensitive information. If someone calls claiming to be from your bank or IT department, hang up and call back using a number from your statement or the official website. Do not use numbers they provide." },
        { type: "text", value: "Be skeptical of unsolicited requests, especially those creating urgency. Take time to think before acting. Share only what is necessary, and question why someone needs the information they are asking for. When something feels off, trust your instincts." },
        { type: "callout", variant: "tip", title: "Verify Independently", value: "Never trust contact information provided by the person contacting you. Look up phone numbers and email addresses yourself. A real representative will understand and support this verification." },
        { type: "quiz", question: "What should you do if someone calls claiming to be from your bank and asks for your account details?", options: ["Provide the information since they called you", "Hang up and call the bank using a number from your card or statement", "Give them your password to verify your identity", "Email them the information later"], correctIndex: 1, explanation: "Calling back through verified channels ensures you are speaking with the real organization, not an impersonator." }
      ]
    }
  ]
},
{
  slug: "password-security",
  title: "Password Security",
  description: "Master the fundamentals of creating and managing strong passwords to protect your accounts.",
  category: "Fundamentals",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Why Passwords Matter",
      slug: "why-passwords-matter",
      content: [
        { type: "text", value: "Passwords are the primary defense for most of your online accounts. A weak or reused password can give attackers access to your email, banking, social media, and more. Once one account is compromised, attackers often try the same credentials elsewhere." },
        { type: "text", value: "Data breaches regularly expose millions of passwords. If you reuse passwords, a breach at one site can compromise all your accounts. Strong, unique passwords for each account significantly reduce this risk." },
        { type: "callout", variant: "warning", title: "Credential Stuffing", value: "Attackers use leaked passwords from one breach to try logging into other services. If you reuse passwords, one breach can unlock many accounts. Unique passwords prevent this cascade." },
        { type: "quiz", question: "Why is reusing passwords across multiple accounts dangerous?", options: ["It uses too much memory", "A breach at one site can compromise all accounts using that password", "Passwords get weaker when reused", "It slows down login times"], correctIndex: 1, explanation: "Leaked credentials from one breach are routinely tested against other services in automated attacks." }
      ]
    },
    {
      title: "Creating Strong Passwords",
      slug: "creating-strong-passwords",
      content: [
        { type: "text", value: "A strong password is long, random, and unique. Aim for at least 12 characters—longer is better. Use a mix of letters, numbers, and symbols, but avoid predictable patterns like replacing 'a' with '@' or adding '123' at the end." },
        { type: "text", value: "Passphrases—several random words strung together—can be easier to remember while remaining strong. Avoid personal information like birthdays or names that attackers could guess. Randomness is key; predictable patterns are vulnerable to dictionary attacks." },
        { type: "callout", variant: "tip", title: "Use a Password Manager", value: "Password managers generate and store strong, unique passwords for each account. You only need to remember one master password. This makes it practical to have different passwords everywhere." },
        { type: "quiz", question: "What makes a password strong?", options: ["Using your birthdate", "Being long, random, and unique", "Using only letters", "Using the same password with slight variations"], correctIndex: 1, explanation: "Length and randomness resist guessing and brute-force attacks; uniqueness limits breach impact." }
      ]
    },
    {
      title: "Password Best Practices",
      slug: "password-best-practices",
      content: [
        { type: "text", value: "Never share your passwords with anyone, including IT support or family. Legitimate services will never ask for your password via email or phone. Enable two-factor authentication wherever possible—it adds a critical second layer of protection." },
        { type: "text", value: "Change passwords if you suspect compromise, and avoid writing them down in insecure locations. Check if your passwords have been exposed in breaches using services like Have I Been Pwned. Update passwords for any compromised accounts immediately." },
        { type: "callout", variant: "info", title: "2FA Over Passwords", value: "Two-factor authentication is often more important than password complexity. A strong password with 2FA is far more secure than the longest password without it. Prioritize enabling 2FA on critical accounts." },
        { type: "quiz", question: "Who should you share your password with?", options: ["IT support when they call asking for it", "Family members for convenience", "No one—legitimate services never ask for your password", "Friends who need to use your account"], correctIndex: 2, explanation: "Genuine support will never request your password. Sharing it compromises your account security." }
      ]
    }
  ]
},
{
  slug: "safe-browsing-habits",
  title: "Safe Browsing Habits",
  description: "Develop habits to browse the web safely and avoid malicious websites and downloads.",
  category: "Web Safety",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Understanding Web Risks",
      slug: "understanding-web-risks",
      content: [
        { type: "text", value: "Malicious websites can infect your device with malware, steal your information through fake login pages, or trick you into downloading harmful files. Some sites are designed to look legitimate while capturing your data or installing unwanted software." },
        { type: "text", value: "Risks include drive-by downloads that install malware without your consent, typosquatting sites that use misspellings of popular URLs, and compromised legitimate sites that have been hacked. Awareness of these threats helps you browse more safely." },
        { type: "callout", variant: "info", title: "HTTPS Matters", value: "Look for the padlock icon and HTTPS in the address bar. This indicates encrypted connection to the site. However, HTTPS alone does not mean a site is trustworthy—scammers can obtain certificates too." },
        { type: "quiz", question: "What is typosquatting?", options: ["A type of encryption", "Using misspelled URLs of popular sites to trick visitors", "A browser feature", "A safe browsing technique"], correctIndex: 1, explanation: "Typosquatters register domains like goggle.com or amaz0n.com to catch users who mistype URLs." }
      ]
    },
    {
      title: "Safe Browsing Practices",
      slug: "safe-browsing-practices",
      content: [
        { type: "text", value: "Verify URLs before entering sensitive information. Check that the address matches the real site—scammers use subtle differences. Avoid clicking links in emails or messages; type URLs directly or use bookmarks for important sites." },
        { type: "text", value: "Keep your browser and operating system updated. Updates often include security patches. Use a modern browser with built-in security features like phishing protection and avoid disabling security warnings. Be cautious with browser extensions—only install from official stores and review permissions." },
        { type: "callout", variant: "warning", title: "Free Download Risks", value: "Free software and media downloads often bundle malware. Download only from official sources. Avoid 'cracked' software and suspicious download sites. When installing, watch for pre-checked boxes that add unwanted programs." },
        { type: "quiz", question: "Where should you download software from?", options: ["Any site that offers it for free", "Official sources and verified app stores only", "Email attachments from unknown senders", "Pop-up ads offering downloads"], correctIndex: 1, explanation: "Official sources and app stores vet software; unofficial sources frequently distribute malware." }
      ]
    },
    {
      title: "Recognizing Dangerous Sites",
      slug: "recognizing-dangerous-sites",
      content: [
        { type: "text", value: "Warning signs include unexpected pop-ups, requests to install software or extensions, and sites that look unprofessional or have many ads. Be suspicious of sites offering too-good-to-be-true deals or requesting unnecessary personal information." },
        { type: "text", value: "Your browser may show warnings for known malicious sites. Do not bypass these warnings. Use browser security features and consider tools that block known bad domains. When in doubt, close the tab and navigate away." },
        { type: "callout", variant: "tip", title: "Bookmark Trusted Sites", value: "Create bookmarks for banks, shopping, and other sites where you enter sensitive data. Using bookmarks reduces the risk of landing on a fake site through a mistyped URL or malicious link." },
        { type: "quiz", question: "What should you do when your browser shows a security warning about a site?", options: ["Click through to continue anyway", "Close the tab and avoid the site", "Disable the warning feature", "Take a screenshot and share it"], correctIndex: 1, explanation: "Browser warnings indicate known threats. Bypassing them can lead to malware infection or data theft." }
      ]
    }
  ]
},
{
  slug: "two-factor-authentication",
  title: "Two-Factor Authentication",
  description: "Learn how 2FA adds a critical layer of security and how to set it up on your accounts.",
  category: "Authentication",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "What is Two-Factor Authentication?",
      slug: "what-is-two-factor-authentication",
      content: [
        { type: "text", value: "Two-factor authentication (2FA) adds a second verification step when logging in. After entering your password, you must provide something else—a code from your phone, a fingerprint, or a security key. This means even if someone steals your password, they cannot access your account without the second factor." },
        { type: "text", value: "The two factors typically fall into categories: something you know (password), something you have (phone or security key), or something you are (fingerprint or face). Using two different categories makes accounts much harder to compromise." },
        { type: "callout", variant: "info", title: "Why 2FA Matters", value: "Passwords alone are increasingly insufficient. Data breaches, phishing, and keyloggers can expose passwords. 2FA blocks most account takeover attempts because attackers rarely have access to your second factor." },
        { type: "quiz", question: "What does two-factor authentication require?", options: ["Two different passwords", "A password plus a second verification method", "Two email addresses", "Two usernames"], correctIndex: 1, explanation: "2FA combines something you know (password) with something you have (phone, key) or are (biometric)." }
      ]
    },
    {
      title: "Types of 2FA",
      slug: "types-of-2fa",
      content: [
        { type: "text", value: "SMS codes are common but less secure—attackers can intercept them through SIM swapping. Authenticator apps like Google Authenticator or Authy generate time-based codes on your device and are more secure. Hardware security keys like YubiKey provide the strongest protection." },
        { type: "text", value: "Push notifications ask you to approve login attempts in an app. Backup codes are one-time codes you save for when you cannot access your normal second factor. Choose the strongest option each service offers; avoid SMS when better options exist." },
        { type: "callout", variant: "warning", title: "SMS 2FA Weakness", value: "SMS codes can be intercepted through SIM swapping attacks where attackers convince carriers to transfer your number. Use authenticator apps or hardware keys for important accounts when possible." },
        { type: "quiz", question: "Which 2FA method is generally considered most secure?", options: ["SMS codes", "Authenticator apps or hardware security keys", "Email verification", "Security questions"], correctIndex: 1, explanation: "Authenticator apps and hardware keys are not vulnerable to SIM swapping or email compromise." }
      ]
    },
    {
      title: "Setting Up 2FA",
      slug: "setting-up-2fa",
      content: [
        { type: "text", value: "Enable 2FA on your email first—it is the recovery method for most other accounts. Then secure banking, social media, and any account with sensitive data. Look for security or privacy settings in each service; 2FA is often under account or login security." },
        { type: "text", value: "Save backup codes in a secure place when offered. You will need them if you lose your phone or security key. Do not store them in the same place as your passwords. Test your 2FA setup to ensure you can log in before you need it." },
        { type: "callout", variant: "tip", title: "Start with Email", value: "Your email account is the key to resetting passwords on other services. Securing it with 2FA protects your entire digital identity. Add 2FA to email before any other account." },
        { type: "quiz", question: "Why should you save backup codes when setting up 2FA?", options: ["To share with family", "To use if you lose access to your phone or security key", "To disable 2FA later", "To speed up login"], correctIndex: 1, explanation: "Backup codes let you regain account access when your primary 2FA method is unavailable." }
      ]
    }
  ]
},
{
  slug: "email-security-fundamentals",
  title: "Email Security Fundamentals",
  description: "Protect your email from threats and learn to spot dangerous messages and attachments.",
  category: "Email Security",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Email as an Attack Vector",
      slug: "email-as-an-attack-vector",
      content: [
        { type: "text", value: "Email is a primary vector for cyber attacks. Phishing, malware distribution, and business email compromise all rely on email. Attackers exploit the trust people place in email and the difficulty of verifying sender identity." },
        { type: "text", value: "Malicious attachments can install malware when opened. Links can lead to fake login pages or drive-by download sites. Even seemingly harmless emails can contain hidden tracking or be part of reconnaissance for targeted attacks." },
        { type: "callout", variant: "info", title: "Email Spoofing", value: "Attackers can forge the 'From' address to make emails appear to come from someone you trust. The displayed name and address can be faked. Always verify through another channel for sensitive requests." },
        { type: "quiz", question: "Why is email a common attack vector?", options: ["Email is outdated technology", "Attackers exploit trust in email and the difficulty of verifying senders", "Email has no security features", "Only businesses use email"], correctIndex: 1, explanation: "Email's ubiquity and the ease of spoofing make it an effective channel for social engineering and malware delivery." }
      ]
    },
    {
      title: "Identifying Dangerous Emails",
      slug: "identifying-dangerous-emails",
      content: [
        { type: "text", value: "Be suspicious of unexpected attachments, especially from unknown senders. Common dangerous file types include .exe, .zip, .docm, and .js. Even PDFs can contain malicious content. Verify the sender before opening any attachment." },
        { type: "text", value: "Hover over links to see the actual URL before clicking. Legitimate companies use their own domains—a link claiming to be from your bank should go to the bank's domain, not a random string. Urgent requests and too-good-to-be-true offers are red flags." },
        { type: "callout", variant: "warning", title: "Macro-Enabled Documents", value: "Documents that ask you to enable macros can run malicious code. Unless you specifically requested a macro-enabled file from a known sender, do not enable macros. Many attacks use .docm or .xlsm files." },
        { type: "quiz", question: "What should you do before opening an email attachment from an unknown sender?", options: ["Open it to see what it is", "Verify the sender and consider whether you expected the attachment", "Forward it to colleagues", "Reply to ask for verification"], correctIndex: 1, explanation: "Verifying the sender and considering context helps avoid malware. When in doubt, do not open." }
      ]
    },
    {
      title: "Securing Your Email",
      slug: "securing-your-email",
      content: [
        { type: "text", value: "Use a strong, unique password for your email account and enable two-factor authentication. Email is the key to resetting passwords on other accounts—compromised email means compromised identity. Use a reputable email provider with strong security features." },
        { type: "text", value: "Be cautious about what you share via email. Do not send passwords, financial details, or sensitive documents through unencrypted email. Consider encrypted email for sensitive communications. Regularly review connected apps and third-party access to your account." },
        { type: "callout", variant: "tip", title: "Separate Personal and Sensitive", value: "Consider using a separate email for financial accounts, work, and casual signups. If one account is compromised, it limits the attacker's access to your other sensitive accounts." },
        { type: "quiz", question: "Why is securing your email account especially important?", options: ["Email is used for social media only", "Email is used to reset passwords on other accounts—compromise gives access to everything", "Email has no other uses", "Email cannot be secured"], correctIndex: 1, explanation: "Password reset links go to your email; controlling your email means controlling access to most of your accounts." }
      ]
    }
  ]
},
{
  slug: "mobile-device-security",
  title: "Mobile Device Security",
  description: "Keep your smartphone and tablet secure from threats and data loss.",
  category: "Device Security",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "Mobile Security Risks",
      slug: "mobile-security-risks",
      content: [
        { type: "text", value: "Mobile devices face unique security risks. Lost or stolen phones can expose all your data. Malicious apps can steal information, track your location, or access your camera and microphone. Public Wi-Fi networks can intercept your traffic." },
        { type: "text", value: "Mobile malware often disguises itself as legitimate apps or comes from unofficial app stores. Jailbreaking or rooting your device removes security protections. Understanding these risks helps you make better choices about how you use your device." },
        { type: "callout", variant: "info", title: "Data on the Go", value: "Your phone likely contains more sensitive data than your computer—messages, photos, banking apps, and authentication codes. Treat it as a high-value target and protect it accordingly." },
        { type: "quiz", question: "What increases mobile security risk?", options: ["Using the official app store", "Downloading apps from unofficial sources or jailbreaking", "Keeping the device updated", "Using a lock screen"], correctIndex: 1, explanation: "Unofficial sources and jailbreaking bypass security controls that protect against malicious apps." }
      ]
    },
    {
      title: "Protecting Your Device",
      slug: "protecting-your-device",
      content: [
        { type: "text", value: "Use a strong lock screen—PIN, pattern, or biometric. Enable remote find and wipe features so you can locate or erase your device if lost. Keep your operating system and apps updated; updates often fix security vulnerabilities." },
        { type: "text", value: "Review app permissions carefully. Does a flashlight app need your location? Revoke permissions that are not necessary. Avoid public Wi-Fi for sensitive activities, or use a VPN. Back up your data regularly in case of loss or theft." },
        { type: "callout", variant: "warning", title: "App Permissions", value: "Many apps request more permissions than they need. Deny unnecessary access to location, contacts, camera, and microphone. If an app will not work without excessive permissions, find an alternative." },
        { type: "quiz", question: "What should you do with app permissions?", options: ["Accept all requested permissions", "Grant only permissions the app needs for its function", "Disable all permissions", "Share permission settings with others"], correctIndex: 1, explanation: "Least privilege—granting only necessary permissions—limits what compromised or malicious apps can access." }
      ]
    },
    {
      title: "Safe Mobile Habits",
      slug: "safe-mobile-habits",
      content: [
        { type: "text", value: "Do not connect to unknown Wi-Fi networks for banking or sensitive tasks. Be cautious with QR codes—they can hide malicious links. Avoid charging your phone on public USB ports; use a power-only cable or USB data blocker to prevent data theft." },
        { type: "text", value: "Be selective about what you install. Stick to official app stores when possible. Read reviews and check developer information. Enable automatic updates for your device and apps. Consider what data you store on your phone and whether encryption is enabled." },
        { type: "callout", variant: "tip", title: "USB Charging Risk", value: "Public USB charging stations can be modified to steal data or install malware when you connect. Use a wall outlet with your own charger, or a USB data blocker that prevents data transfer while allowing charging." },
        { type: "quiz", question: "Why can public USB charging ports be risky?", options: ["They charge too slowly", "They can be modified to steal data or install malware when you connect", "They use too much power", "They are always broken"], correctIndex: 1, explanation: "Juice jacking attacks use modified USB ports to access or compromise connected devices." }
      ]
    }
  ]
},
{
  slug: "data-privacy-basics",
  title: "Data Privacy Basics",
  description: "Understand how your data is collected and used, and learn to protect your privacy online.",
  category: "Privacy",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "What is Data Privacy?",
      slug: "what-is-data-privacy",
      content: [
        { type: "text", value: "Data privacy is your right to control how your personal information is collected, used, and shared. Companies collect vast amounts of data about your online behavior, preferences, and identity. This data can be used for advertising, sold to third parties, or exposed in breaches." },
        { type: "text", value: "Personal data includes your name, email, location, browsing history, and more. Understanding what data exists about you and who has access helps you make informed choices. Privacy is not about having nothing to hide—it is about controlling your information." },
        { type: "callout", variant: "info", title: "Data Has Value", value: "Your data is valuable to companies for advertising and analytics. When a service is free, you are often the product. Consider what you exchange for convenience and whether it is worth it." },
        { type: "quiz", question: "What does data privacy primarily concern?", options: ["The speed of your internet", "Your right to control how personal information is collected and used", "Computer hardware", "Software licensing"], correctIndex: 1, explanation: "Data privacy focuses on individual control over personal information in the digital age." }
      ]
    },
    {
      title: "How Your Data is Collected",
      slug: "how-your-data-is-collected",
      content: [
        { type: "text", value: "Websites use cookies and tracking scripts to monitor your browsing. Apps collect usage data, location, and device information. Social media platforms build detailed profiles from your posts, likes, and connections. Search engines record your queries and clicks." },
        { type: "text", value: "Data brokers aggregate information from many sources and sell profiles to advertisers, employers, and others. Your data can be combined from different services to create a comprehensive picture. Understanding these practices helps you limit what you share." },
        { type: "callout", variant: "warning", title: "Terms of Service", value: "When you accept terms of service, you often grant broad data collection and sharing rights. Most people do not read them, but they define what companies can do with your information. Be aware of what you are agreeing to." },
        { type: "quiz", question: "How do websites typically track your browsing?", options: ["By asking you directly", "Through cookies and tracking scripts", "They cannot track you", "Only when you log in"], correctIndex: 1, explanation: "Cookies and embedded tracking scripts allow sites to follow your activity across the web." }
      ]
    },
    {
      title: "Protecting Your Privacy",
      slug: "protecting-your-privacy",
      content: [
        { type: "text", value: "Limit what you share on social media and adjust privacy settings. Use privacy-focused browsers and search engines. Consider browser extensions that block trackers. Use a VPN for sensitive browsing on untrusted networks. Read privacy policies before signing up for services." },
        { type: "text", value: "Use different email addresses for different purposes—one for important accounts, one for signups. Opt out of data broker databases when possible. Enable two-factor authentication to protect accounts. Small changes add up to significantly better privacy." },
        { type: "callout", variant: "tip", title: "Privacy Settings", value: "Regularly review privacy settings on social media and other accounts. Default settings often maximize data sharing. Take time to restrict what is visible and what data is collected. Settings change with updates—check periodically." },
        { type: "quiz", question: "What is one way to improve your online privacy?", options: ["Share more on social media", "Use privacy-focused browsers and adjust privacy settings", "Use the same password everywhere", "Disable all security features"], correctIndex: 1, explanation: "Privacy tools and thoughtful settings reduce the amount of data collected and shared about you." }
      ]
    }
  ]
},
{
  slug: "secure-file-sharing",
  title: "Secure File Sharing",
  description: "Learn to share files safely and avoid exposing sensitive data to unauthorized parties.",
  category: "Data Protection",
  difficulty: "Beginner",
  duration: "~15 min",
  lessonCount: 3,
  lessons: [
    {
      title: "File Sharing Risks",
      slug: "file-sharing-risks",
      content: [
        { type: "text", value: "Sharing files can expose sensitive data to the wrong people. Email attachments can be forwarded or intercepted. Cloud links may be shared beyond intended recipients. Files left on shared drives might be accessible to more people than you realize." },
        { type: "text", value: "Malware can spread through shared files. Infected documents can compromise recipients' devices. Files may contain hidden metadata—author names, edit history, or location data—that reveals more than intended. Understanding these risks helps you share more safely." },
        { type: "callout", variant: "info", title: "Metadata Leaks", value: "Documents often contain metadata: author names, creation dates, and sometimes location. Photos can include GPS coordinates. Remove metadata before sharing sensitive files, or use tools that strip it automatically." },
        { type: "quiz", question: "What can happen when you share files insecurely?", options: ["Files get smaller", "Sensitive data can be exposed to unauthorized parties or intercepted", "Files become encrypted", "Sharing is always secure"], correctIndex: 1, explanation: "Insecure sharing can lead to data exposure, interception, or unintended access." }
      ]
    },
    {
      title: "Secure Sharing Methods",
      slug: "secure-sharing-methods",
      content: [
        { type: "text", value: "Use encrypted file sharing services that offer password protection and expiration for links. Set links to expire after the recipient downloads. Use services that require recipient authentication. Avoid sharing sensitive files via unencrypted email when possible." },
        { type: "text", value: "For highly sensitive data, consider end-to-end encrypted options where only the recipient can decrypt. Verify the recipient's identity before sharing—sending to the wrong email is a common cause of data leaks. Use secure channels to share passwords for encrypted files." },
        { type: "callout", variant: "warning", title: "Link Expiration", value: "File sharing links that never expire can be discovered and accessed long after you intended. Set expiration dates. Some services allow one-time download links that disable after use. Use these for sensitive files." },
        { type: "quiz", question: "What makes file sharing more secure?", options: ["Using the fastest service", "Password protection, link expiration, and recipient verification", "Sharing via unencrypted email", "Making links public"], correctIndex: 1, explanation: "Access controls and expiration limit exposure; verification ensures files reach the right person." }
      ]
    },
    {
      title: "Best Practices",
      slug: "best-practices",
      content: [
        { type: "text", value: "Only share what is necessary. Redact or remove sensitive information from documents when possible. Use the principle of least privilege—give access only to those who need it, and only for as long as needed. Audit shared links periodically and revoke access when no longer required." },
        { type: "text", value: "Scan files for malware before sharing. Be cautious with file types that can execute code—.exe, .docm, .js. When receiving files, verify the sender and scan before opening. For work, use approved sharing platforms with proper security controls." },
        { type: "callout", variant: "tip", title: "Separate Passwords", value: "When sharing password-protected files, send the password through a different channel than the file link. If email is compromised, the attacker would need both. Use a secure messaging app or phone call for the password." },
        { type: "quiz", question: "Why should you send file passwords through a different channel than the file link?", options: ["To make it more convenient", "If one channel is compromised, the attacker would need both to access the file", "Passwords cannot be sent by email", "It is required by law"], correctIndex: 1, explanation: "Separating the link and password across channels reduces the risk of a single compromise exposing both." }
      ]
    }
  ]
}
];
