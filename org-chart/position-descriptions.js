/* Position-based duties, independent of the person holding the seat.
 * Cadet text transcribed from Fall 2026 OPLAN, Section B. PDF page numbers
 * include the two opening image pages. Cadre text is a cited summary.
 * Cadre primary/alternate duties follow the signed Fall 2026 additional duty memo.
 * GMC deputy support duties reflect Capt Russell’s local guidance and the
 * supervisor’s OPLAN scope; responsibility remains with the supervisor.
 * Full source PDFs are not republished. */
const POSITION_DESCRIPTIONS = {
  "wgcc": {
    "title": "Wing Commander (WG/CC)",
    "critical": "Oversees long-term Cadet growth to align with Cadet Wing, Cadre, and Air Force goals and visions.",
    "responsibilities": [
      "Oversees all Cadet operations.",
      "Enacts all policies set by Cadre for the Cadet Wing.",
      "Holds the final decision on all cadet matters with the feedback of A-Staff.",
      "Establishes semester goals and vision for the Cadet Wing.",
      "Responsible for the completion and distribution of the OPLAN and Policy Packet.",
      "Works with incoming WG/CC to ensure proper continuity between semesters.",
      "Holds all POC accountable to job duties.",
      "Holds ACAs and CEFs with COS and WG/CD. Attends ACAs and CEFs for A-Staff."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Wing Commander (WG/CC), PDF pp. 8"
    ]
  },
  "wgcd": {
    "title": "Wing Commander Deputy (WG/CD)",
    "critical": "Representative of the WG/CC when unavailable; aids in all WG/CC duties when necessary.",
    "responsibilities": [
      "Oversee the mentorship system and ensure mentorship opportunities occur on a monthly basis.",
      "Creates and presents monthly Prop Awards.",
      "Holds all POC accountable to job duties.",
      "Supervises the GMCA and POCA, reviewing effectiveness of the positions and ensuring morale events are implemented.",
      "Enforces counseling for improper use of cadet property (i.e., lights on in the wing room, doors left open, destroyed property, etc.).",
      "Manage the Wing Feedback Form and regularly notify Wing Command Team of any submissions with suggested resolutions."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Wing Commander Deputy (WG/CD), PDF pp. 8"
    ]
  },
  "wgcos": {
    "title": "Chief of Staff (WG/COS)",
    "critical": "Executes the vision for the semester regarding operations and A-Staff responsibilities.",
    "responsibilities": [
      "Coordinates and facilitates Commander Update Briefings.",
      "Compiles summary from Commander Update Briefings to distribute to the Detachment.",
      "Updates and maintains the Policy Packet.",
      "Responsible for updating the Detachment regarding Policy Packet updates.",
      "Oversees the distribution, completion, collection, and filing of ACAs and CEFs.",
      "Hold ACAs and CEFs with A1-A9 DTs.",
      "Seek WG/CC approval and submit award packages for any A-Staff member using the AF Form 1206.",
      "Creates and maintains cadet files containing all awards, disciplinary counselings, and routine counselings"
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Chief of Staff (WG/COS), PDF pp. 9"
    ]
  },
  "poca": {
    "title": "POC Advisor (POCA)",
    "critical": "Advisor to Wing Staff regarding any morale-related trends among the POC. Must be approachable and capable of advising POC on topics that they are unsure of or unfamiliar with. Promotes and supports esprit de corps across the detachment.",
    "responsibilities": [
      "Organizing and supervising mentors and mentorship groups.",
      "Works with the GMCA to establish POC and GMC, mentors, and create a system where cadets request to be assigned to specific mentors within the Detachment.",
      "Oversees the planning and execution of POC morale events. At least two flight and two class morale events must occur during the semester.",
      "Collaborates with the GMCA to coordinate Detachment morale events, including a First Friday event every month."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, POC Advisor (POCA), PDF pp. 9"
    ]
  },
  "gmca": {
    "title": "GMC Advisor (GMCA)",
    "critical": "Advisor to Wing Staff regarding any morale-related trends among the GMC. Serves as primary contact after the flight commander for GMC regarding the cadet wing and AFROTC program. Ensures the promotion of esprit de corps across the detachment.",
    "responsibilities": [
      "Works with the POCA to establish POC and GMC, mentors, and create a system where cadets request to be assigned to specific mentors within the Detachment.",
      "Oversees the planning and execution of GMC morale events. At least two flight and two class morale events must occur during the semester.",
      "Collaborates with the POCA to coordinate Detachment morale events, including a First Friday event every month."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, GMC Advisor (GMCA), PDF pp. 9-10"
    ]
  },
  "gpcc": {
    "title": "Group Commander (GP/CC)",
    "critical": "Oversees the weekly tasking, instruction, feedback, and accountability of the SQ/CCs.",
    "responsibilities": [
      "Completes ACAs and CEFs for SQ/CCs.",
      "Oversees and rates effectiveness of supplemental flight meetings.",
      "Assigns weekly flight duties to flights and communicates with A2/DT to include assignments in the weekly Supplemental Information.",
      "Responsible for monitoring attendance reported by FLT/CCs for all PMT events. Ensures accountability is accessible to A-Staff and Wing Staff.",
      "Standardizes wingroom cleanup checklist and enforcement of completed duty.",
      "Receive Warrior Knowledge quizzes from A2/DT and distribute to SQ/CCs."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Group Commander (GP/CC), PDF pp. 10"
    ]
  },
  "squadron": {
    "title": "Squadron Commander (SQ/CC)",
    "critical": "Oversees the week-by-week tasking, instruction, and feedback of the FLT/CCs",
    "responsibilities": [
      "Evaluates and completes ACAs and CEFs for FLT/CCs.",
      "Monitors flight performance and reports patterns and trends to the GP/CC.",
      "Plans and executes flight meetings when necessary, upon approval from GP/CC, WG/CC, WG/CD.",
      "Responsible for ensuring that attendance is reported from FLT/CCs to GP/CC for all mandatory PMT events.",
      "Receive Warrior Knowledge quizzes from GP/CC and distribute to FLT/CCs."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Squadron Commander (SQ/CC), PDF pp. 10-11"
    ]
  },
  "flight": {
    "title": "Flight Commander (FLT/CC)",
    "critical": "Primary contact for GMC cadets, serving as evaluator and mentor for the flight members.",
    "responsibilities": [
      "Responsible for exemplifying regulations and enforcing GMC adherence to standards.",
      "Facilitates and reports attendance to GP/CC for all PMT events; communicates with SQ/CC when complete.",
      "Conduct feedback session for GMC cadets within the flight.",
      "Regularly collect and report GMC feedback to the SQ/CC.",
      "Ensures completion of flight duties and facilitates proper training of cadets to achieve this.",
      "Receive Warrior Knowledge quizzes from SQ/CC and distribute to the flight.",
      "Establish expectations for FLT/CD and conducts feedback sessions when necessary."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Flight Commander (FLT/CC), PDF pp. 11"
    ]
  },
  "flightDeputy": {
    "title": "Deputy Flight Commander (FLT/CD)",
    "critical": "Assumes flight command in the absence of the FLT/CC; assists in the daily training, accountability, and mentorship of the flight.",
    "responsibilities": [
      "Assumes all FLT/CC duties in the absence of the FLT/CC.",
      "Assists the FLT/CC in exemplifying regulations and enforcing GMC adherence to standards.",
      "Assists in taking and reporting attendance for all PMT events to the FLT/CC.",
      "Assists the FLT/CC in conducting feedback sessions for GMC cadets within the flight.",
      "Mentors GMC cadets and relays flight concerns and feedback to the FLT/CC.",
      "Assists in the distribution of Warrior Knowledge quizzes to the flight.",
      "Coordinates with the FLT/CC on flight duties and training to ensure continuity within the flight."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, Deputy Flight Commander (FLT/CD), PDF pp. 11"
    ]
  },
  "a1": {
    "title": "A1 Personnel Director (A1/DT)",
    "critical": "Ensures Cadet Wing has access to all resources provided through the A1 DT, and that opportunities and events happen according to a general timeline established at the beginning of the semester.",
    "responsibilities": [
      "Grants approval for events proposed by A11-13.",
      "Monitors A11-13 to ensure deadlines are met.",
      "Creates and maintains a cadet flight roster.",
      "Organizes and assigns cadet lockers and mailboxes. Responsible for updating lockers and mailboxes in accordance with personnel changes.",
      "Assists COS in the maintenance of cadet files.",
      "Works with Cadre Recruiting Officer to collaborate with the A12."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A1 Personnel Director (A1/DT), PDF pp. 12"
    ]
  },
  "a11": {
    "title": "A11 Academics Officer (ACDO)",
    "critical": "Provides access to academic resources and assesses Wing academic readiness.",
    "responsibilities": [
      "Coordinates tutoring through the Academic Success Center at ISU.",
      "Plans and executes weekly study hours for the entire semester.",
      "Organize tutoring sessions for cadets with similar majors and/or classes.",
      "May work with the TSO to organize a tri-service tutoring opportunity if there are not enough AFROTC cadets with similar majors."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A11 Academics Officer (ACDO), PDF pp. 12"
    ]
  },
  "a12": {
    "title": "A12 Public Affairs and Recruiting Officer (PARO)",
    "critical": "Responsible for public image of the Detachment, both on campus and through social media.",
    "responsibilities": [
      "Coordinates recruiting events with A1/DT and Cadre Recruiting Officer, ensures participation and support from the Cadet Wing at recruiting events.",
      "Updates Detachment social media accounts to reflect cadet activity to the public.",
      "Assists SPO by creating a video for Dining-In.",
      "Coordinating and updating the semester cadet photos for all cadets.",
      "Updates the Detachment photo board on a monthly basis.",
      "Works with A52 to update the PFA record board IAW cadet performance.",
      "Works with A11 to update the Academic Record board.",
      "Coordinates with A2/DT to post the Detachment 250 Newsletter."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A12 Public Affairs and Recruiting Officer (PARO), PDF pp. 12"
    ]
  },
  "a13": {
    "title": "A13 Development Officer (DEVO)",
    "critical": "Provides access to career resources and professional development opportunities.",
    "responsibilities": [
      "Coordinate, plan, and successfully execute professional development opportunities, including but not limited to: Base Visits, Brown Bags, and Air Force Association events.",
      "Ensure professional development events happen at least once per month.",
      "Work with the TSO to plan at least one tri-service professional development event."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A13 Development Officer (DEVO), PDF pp. 13"
    ]
  },
  "a2": {
    "title": "A2 Intelligence Director (A2/DT)",
    "critical": "Reports current events and changes to any AFI, AFROTCI, DAFPAM, and DAFI publications. Oversees the management of the Warrior and Honor Point system.",
    "responsibilities": [
      "Provide weekly current-event briefings to the entire Detachment.",
      "Report changes in AFROTC policy to COS.",
      "Publish a weekly newsletter detailing current events applicable to the USAF/USSF – including updates and events happening in and around the Detachment.",
      "Ensure newsletter is accurate, accessible to all cadets, and is posted on the cadet photo board weekly.",
      "In charge of developing Warrior Knowledge and the associated quiz each week (no longer than 5 minutes) in addition to sending the quizzes to the GP/CC.",
      "Creates Supplemental Information and supplies weekly to A6/DT.",
      "In coordination with FLI, communicate with Iowa State University IT any updates or maintenance requests for the Flight Simulators"
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A2 Intelligence Director (A2/DT), PDF pp. 13"
    ]
  },
  "a22": {
    "title": "A22 Historical Officer (HISTO)",
    "critical": "Compiles and organizes all available historical data and items within the Detachment. Creates a display to highlight the history of Detachment 250.",
    "responsibilities": [
      "Organize historical data, documents, and photos currently spread around the Armory.",
      "Create a system to store all historical information.",
      "Create a display of the history of Detachment 250 for public viewing and education."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A22 Historical Officer (HISTO), PDF pp. 13"
    ]
  },
  "a23": {
    "title": "A23 Flight Simulator Instructor (FLI)",
    "critical": "Manages the Flight Simulator staff, ensures cadets have access to Flight Simulators, and communicates maintenance requests to A2/DT.",
    "responsibilities": [
      "Facilitates the Flight Simulator Hours.",
      "Establishes qualification metrics for Flight Simulator supervisors.",
      "Communicates with A2/DT concerning updates and maintenance for the Flight Simulators.",
      "Responsible for the cleanliness and organization of the Flight Simulator Room."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A23 Flight Simulator Instructor (FLI), PDF pp. 14"
    ]
  },
  "a3": {
    "title": "A3 Operations Director (A3/DT)",
    "critical": "Oversees and mentors A31-A34, ensuring their progress, development, and planning align with the detachment’s vision.",
    "responsibilities": [
      "Enforces deadlines IAW schedule developed and coordinated with A31-A34.",
      "Ensures A31-A34 is tracking deadlines and has plans to execute when called upon.",
      "Approves schedule of special events (O-Course opportunities, 5Ks, Dining Out, etc.)",
      "Provides feedback and mentorship for A31-A34 as necessary."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A3 Operations Director (A3/DT), PDF pp. 14"
    ]
  },
  "a31": {
    "title": "A31 Special Projects Officer (SPO)",
    "critical": "Responsible for planning and executing Dining In, Commissioning and other approved Detachment activities for Fall 2026.",
    "responsibilities": [
      "Ensures the successful planning and execution of Dining-In, creates and oversees committees to seek buy in from the Detachment.",
      "Plans and executes FORTE.",
      "Coordinates commissioning IAW vision from Wing Command, Cadre, and the cadets commissioning in the Fall of 2026.",
      "Initiates planning for Dining Out including but not limited to venue booking, catering COAs, and fundraising options."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A31 Special Projects Officer (SPO), PDF pp. 14"
    ]
  },
  "a32": {
    "title": "A32 Drill and Ceremonies Commander (D&C/CC)",
    "critical": "Responsible for training cadets to execute honor guard procedures and coordinating events for them to use them.",
    "responsibilities": [
      "Proficient in all D&C commands and documents.",
      "Reviews current Honor Guard manuals and provides updated guidance.",
      "Trains and prepares details for: Opening Ceremonies, color guard for ISU Athletic events, Commissioning, Dining-In, and any presentation of colors/honor guard ceremonies requested by the community.",
      "Communicates and educates the Wing on the standardization of Flag Duties.",
      "Responsible for providing Honor Guard materials to all required Detachment 250 events.",
      "Responsible for planning and organizing a Marching Assistance Program IAW. deficiencies noted during D&C, in consultation with FLT/CCs, SQ/CCs, and GP/CC.",
      "Create a plan and budget for purchasing new Honor Guard Equipment to replace old items.",
      "Gathers interest and communicates event requests with the Cadet Choir."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A32 Drill and Ceremonies Commander (D&C/CC), PDF pp. 15"
    ]
  },
  "a33": {
    "title": "A33 Tri-Service Officer (TSO)",
    "critical": "Establishes communication with AROTC and NROTC as a reliable contact for any tri-service event requests. Coordinates with cadets within the Detachment to ensure tri- service event goals are met.",
    "responsibilities": [
      "Communicating with the other branches when integration of tri-service is available.",
      "Acts as the main point of contact from AFROTC for all tri-service requests.",
      "Relays requests for tri-service events to the respective DT in a timely manner to increase collaboration time.",
      "May coordinate small-scale tri-service events when necessary.",
      "Ensures tri-service event goals are met, working primarily with: GMCA, POCA, A13 (DEVO), A52 (PFO), and A11 (ACDO)."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A33 Tri-Service Officer (TSO), PDF pp. 15"
    ]
  },
  "a34": {
    "title": "A34 Special Events Officer (SEO)",
    "critical": "Plan Detachment events executed in partnership with other organizations",
    "responsibilities": [
      "Plan and execute the POW/MIA Memorial Run, coordinating with Cadre, Wing Command, and state agencies to ensure safety and success of the event.",
      "Plan and execute at least one large scale GLP/FTX event; JTD or Tri-Service event encouraged."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A34 Special Events Officer (SEO), PDF pp. 16"
    ]
  },
  "a4": {
    "title": "A4 Logistics Director (A4/DT)",
    "critical": "Responsible for wingroom supplies, pop project, and all Peterson Squadron funding or purchases.",
    "responsibilities": [
      "Creates and follows a yearly budget for the Cadet Wing reported to A-Staff at the beginning of the semester, followed by weekly updates during Commander Update Briefings.",
      "Gathers input from positions to estimate Detachment spending for the semester, and evaluates requests for purchases throughout the semester.",
      "Ensures fundraising events are completed throughout the semester.",
      "SME regarding university financial management guidelines and policies.",
      "Supplies and updates pop project, wingroom supplies, and cleaning materials (assigns pricing as necessary).",
      "Rents materials for PMT or other approved activities (dodgeballs for Icarus LLAB/Halloween PT, Notre Dame Basketball tournament, etc.)",
      "Responsible for providing Detachment medical equipment at all PMT activities."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A4 Logistics Director (A4/DT), PDF pp. 16"
    ]
  },
  "a41": {
    "title": "A41 Fundraising Officer (FUNO)",
    "critical": "Create fundraising goal for the semester, find new fundraising opportunities for the Detachment, and coordinate manning and success of fundraising.",
    "responsibilities": [
      "Create a fundraising SMART Goal for the Fall 2026 semester, along with incentives for cadets to volunteer in fundraising events.",
      "Ensures the successful planning and execution of fundraising events."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A41 Fundraising Officer (FUNO), PDF pp. 16"
    ]
  },
  "a5": {
    "title": "A5 Planning Director (A5/DT)",
    "critical": "Responsible for overseeing the planning of all PMT events, creates OPORDS.",
    "responsibilities": [
      "Coordinates with WG/CC and WG/CD to create an initial plan for the semester schedule of LLABs including the objective completion and The Why for each one to be added to the OPLAN for approval by Cadre.",
      "Coordinates with WG/CC and WG/CD to update the semester schedule as necessary to ensure proper objective completion; communicates changes with Detachment.",
      "SME on all objectives and ensures all personnel meet required objectives IAW AFROTCI 36-2011, Volume 1.",
      "Responsible for providing, completing, standardizing, and maintaining the integrity of objective proficiency tracking documents for all LLAB events.",
      "Objective tracking documents will only include objectives that still need to be completed.",
      "Final CONOPS oversight authority.",
      "Approves final CONOPS and PT plans, sends them to OFC and adds them to the POC chat.",
      "LLABs will start at 0615 to allow for proper attendance and warrior knowledge administration.",
      "Responsible for creating weekly OPORDS in advance for submission to Detachment. OFC, and submission to A6 for Detachment distribution.",
      "Attends all Execution Meetings and AAR Meetings."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A5 Planning Director (A5/DT), PDF pp. 17"
    ]
  },
  "a5d": {
    "title": "A5 Planning Director Deputy (A5/DTD)",
    "critical": "Reviews and provides feedback for each LLAB CONOPS.",
    "responsibilities": [
      "Works with A5/DT to ensure all responsibilities are met for A51-A53.",
      "Works with the CTO to synergize training standards for each LLAB.",
      "Integral in the support of the Planning Directorate by helping with additional tasks at the discretion of A5/DT."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A5 Planning Director Deputy (A5/DTD), PDF pp. 17"
    ]
  },
  "a51": {
    "title": "A51 Chief of Training Officer (CTO)",
    "critical": "Advises LLAB POCIC and POCIC evaluators, standardizes training for all LLAB POC Trainers",
    "responsibilities": [
      "Responsible for standardizing training among all LLAB POC Trainers, helping equip them to make decisions within the bounds of their authority.",
      "Collects POCIC evaluation forms.",
      "Organizes, schedules, and records the content of LLAB AARs, publishes AARs to POC Chat in Teams and records files for future reference and continuity in the Files Tab.",
      "Creates accountability structure for POC Trainers in LLAB environments IAW Wing Command vision.",
      "Works with A53 to synergize training standards for each LLAB."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A51 Chief of Training Officer (CTO), PDF pp. 18"
    ]
  },
  "a52": {
    "title": "A52 Physical Fitness Officer (PFO)",
    "critical": "Plans and executes PT and PFAs for the Detachment. Following the first mock PFA, use metrics to create workouts that target specific necessary improvements for the Detachment.",
    "responsibilities": [
      "Plans, organizes and executes mock and official PFA(s). Responsible for bringing all necessary equipment for each.",
      "Coordinates with A9/DT to keep record of scoring and Detachment fitness status/improvement areas.",
      "Oversees all official and supplemental cadet fitness programs.",
      "Coordinates with TSO for tri-service fitness events.",
      "Creates opportunities during PT for flights to win Warrior Points.",
      "Knowledgeable on topics of recovery, dynamic vs static warm-ups, and proper form for all exercises incorporated in PT."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A52 Physical Fitness Officer (PFO), PDF pp. 18"
    ]
  },
  "a53": {
    "title": "A53 Concept of Operations Officer (CONO)",
    "critical": "Reviews and provides feedback for each LLAB CONOPS IAW Wing Command vision and A5/DT expectations",
    "responsibilities": [
      "Oversees and attends all execution meetings for LLAB events.",
      "Adds final CONOPS to Teams after approval of A5/DT.",
      "Works with A5/DT to ensure all objectives are met correctly.",
      "Works with A51 to synergize training standards for each LLAB.",
      "Sets and enforces all LLAB-relates deadlines, including descriptions, CONOPS, and execution meetings.",
      "Works with POCICs to provide feedback for each set of CONOPS, ensure final CONOPS are completed on time."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A53 Concept of Operations Officer (CONO), PDF pp. 19"
    ]
  },
  "a6": {
    "title": "A6 Communications Director (A6/DT)",
    "critical": "Distributes all messages and announcements to the Detachment.",
    "responsibilities": [
      "Update and maintain the Detachment Email distribution list and CyBox/Teams editor and admin access list.",
      "Responsible for the upkeep of the Microsoft Teams platform, including channels and files.",
      "Coordinate all Detachment communications, including Teams and email notifications.",
      "Sends out weekly supplemental information and OPORDS to the Detachment.",
      "Sends Outlook Calendar invites for all large events, including JTDs, POW/MIA events, and Dining In/Dining Out.",
      "Responsible for the scheduling/reservation system of cadet academic spaces.",
      "Creates and maintains a Detachment calendar system."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A6 Communications Director (A6/DT), PDF pp. 19"
    ]
  },
  "a9": {
    "title": "A9 Assessment and Improvement Director (A9/DT)",
    "critical": "Reviews readiness and discipline of the Detachment, maintains counseling file system, and oversees the implementation of improvement projects regarding Detachment spaces and/or processes.",
    "responsibilities": [
      "Manages and supervises the A91 and A92 positions. Ensure that they have the resources they need to succeed.",
      "Establishes and upholds actionable deadlines for the positions under them.",
      "Presents progress reports for the projects being planned and executed within A9 at weekly Commander Update Briefings.",
      "Provides feedback to WG/CC, WG/CD, and WG/COS regarding patterns and trends in counselings.",
      "Assess the discipline, efficiency, economy, and readiness of the Wing through observations and inspections during SPMT.",
      "Maintains a counseling file system to include Form 174s and 341s, LOCs, and LORs.",
      "Collects counseling paperwork from POC supervisors.",
      "Provides past counseling paperwork for reference when requested."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A9 Assessment and Improvement Director (A9/DT), PDF pp. 20"
    ]
  },
  "a91": {
    "title": "A91 Innovation Officer (INVO)",
    "critical": "Review areas of improvement for the Detachment and coordinate innovation committees supplying GMC with leadership opportunities.",
    "responsibilities": [
      "Create a timeline for each committee and explain what they will accomplish over the semester for A9/DT approval.",
      "Mentor and ensure the success of existing/incomplete GMC project committees.",
      "Provide GMC opportunities to develop COAs for specific improvement projects.",
      "Project oversight for all GMC committees and projects.",
      "Provides COAs for any large-scale project to A9/DT, WG/CC, WG/CD, and Cadre upon request."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A91 Innovation Officer (INVO), PDF pp. 20"
    ]
  },
  "a92": {
    "title": "A92 Wellness Officer (WELLO)",
    "critical": "Monitors the wellness and readiness of the Detachment",
    "responsibilities": [
      "Establishes a plan to monitor cadet wellness and reports monthly to A9/DT and Cadre as requested.",
      "Distributes support resources for areas of struggle for cadets as requested and as seen fit.",
      "Plan and execute at least one workshop on the topic of an area of struggle for cadet.",
      "Work with the GMCA and POCA to create a shared vision and plan for morale-related events within the detachment."
    ],
    "sources": [
      "Fall 2026 OPLAN, Section B, A92 Wellness Officer (WELLO), PDF pp. 21"
    ]
  },
  "cacic": {
    "critical": "Leads detachment administration, operations, recruiting, and compliance while ensuring cadre are qualified to train and develop cadets.",
    "responsibilities": [
      "Direct detachment administration, operations, recruiting, and policy compliance; ensure cadre manage participant, applicant, and cadet records.",
      "Ensure instructor-qualified cadre teach and receive required training and evaluations; approve substitute AS activities, tutorial instruction, and summer classes.",
      "Direct the safety and risk management program, determine high-risk PMT activities, approve them, and send the risk management plan to the Region Commander before the event.",
      "Appoint cadre to detachment duties, oversee recruiting plans and locally produced promotional materials, and nominate or select award recipients.",
      "Rank cadets each term for selection processes and ensure compliance with accession requirements.",
      "Oversee scholarship estimates, tuition invoice submissions, HSSP interviews, and cadet travel profiles and orders.",
      "Ensure cadre who interact with cadets unsupervised have the required acknowledgement and qualifications; oversee local qualification training, remedial training, and recertification coordination."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), paras. 1.14.1-1.14.23, pp. 14-15",
      "AFROTCI 36-2011 Vol 2 (11 September 2024), para. 1.11, p. 6",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Commander, PDF p. 1"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "AS200 Instructor/Advisor/Records",
      "Military Advisor to Dean of LAS",
      "Department Chair",
      "PSP Manager",
      "ASIMS Manager",
      "AFPAAS/COR",
      "Family Care Plan Manager",
      "Cadre Awards/Evals/Decs",
      "DDR",
      "Leave Auditor",
      "Cadet Pay (257) Certifying Official",
      "IUF Manager"
    ],
    "alternateDuties": [
      "NOTACC Manager",
      "Cadet Awards Manager",
      "PRFA (as listed in the memo)"
    ]
  },
  "matthews": {
    "critical": "Oversees instruction-related activities, academic program quality, and cadre training and instructor qualifications.",
    "responsibilities": [
      "Ensure cadets enroll in the applicable Aerospace Studies courses; review instructor syllabi, gradebooks, and an exam from each instructor for compliance and effectiveness.",
      "Maintain course surveys, academic records, and the recurring instructor assessment plan; ensure required academic policy briefings and learning management system familiarity.",
      "Establish and maintain cadre Training and Evaluation Folders with certifications, training checklists, assessments, and required documentation.",
      "Develop detachment-specific qualification training plans and syllabi; ensure only fully qualified cadre teach AS courses unsupervised.",
      "Track initial, mission qualification, continuation, just-in-time, and annual in-service training requirements; assist the commander with remedial training.",
      "Track NCO upgrade training and coordinate status with the Region Senior Enlisted Leader; oversee detachment Master Instructor Badge submissions."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), para. 9.2, p. 77",
      "AFROTCI 36-2011 Vol 2 (11 September 2024), para. 1.13, p. 7",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Education Officer, PDF p. 2"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "AS100 Instructor/Advisor/Records",
      "AFIT Liaison & Advisor",
      "NOTACC Manager",
      "Self-Assessment Program Manager",
      "Test Control Officer (TCO)",
      "Unit Training Manager (UTM)",
      "Vehicle Control Officer (VCO)",
      "Unit Fitness Program Manager (UFPM)"
    ],
    "alternateDuties": [
      "Family Care Plan Monitor",
      "ASIMS Monitor",
      "Anti-Terrorism FP",
      "AFPAAS/COR Monitor",
      "HSSP Monitor"
    ]
  },
  "russell": {
    "critical": "Serves as the primary instructor for Practical Military Training and supervises the cadet wing in planning training that accomplishes LLAB objectives.",
    "responsibilities": [
      "Supervise cadet planning of PMT events; ensure LLAB enrollment, access to the syllabus, and required event supervision.",
      "Ensure cadets are treated with dignity and prevent hazing, discrimination, harassment, and other unacceptable conduct; ensure the Honor Code is taught each academic year.",
      "Ensure required LLAB objectives are presented and completed, including requirements for concurrently enrolled cadets and cadets who missed a term.",
      "Track LLAB attendance and grading criteria; ensure post-event counseling in WINGS after non-detachment hosted PMT or Officer Development Training.",
      "Ensure POC cadets serve in a qualifying leadership position at least once; approve cadet rank and organizational chart duty descriptions.",
      "Approve and sign the semester OPLAN and event OPORDs, including required objectives, attendance plans, event details, and risk management information.",
      "Ensure only fully qualified cadre interact with cadets unsupervised during PMT."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), para. 10.2, pp. 82-83",
      "AFROTCI 36-2011 Vol 2 (11 September 2024), para. 1.12, p. 6",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Operations Flight Commander, PDF p. 1"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "AS300 Instructor/Advisor/Records",
      "AYCF Program Manager",
      "Cadet ODT Liaison",
      "Incentive Flight Manager & CAP Advisor",
      "NROTC Obstacle Course Liaison",
      "Cadet Awards Program Manager",
      "Cadet Pay (257) Internal Auditor",
      "AAS Advisor"
    ],
    "alternateDuties": [
      "Honor Guard Advisor",
      "Test Examiner (TE)",
      "Silver Wings Advisor",
      "PFRA"
    ]
  },
  "orr": {
    "critical": "Leads detachment recruiting initiatives for in-college students, high school students, and enlisted members in the detachment’s geographic area.",
    "responsibilities": [
      "Review the current AFROTC Recruiting Officer Guide and generate the detachment spend plan.",
      "Establish and maintain the host-institution detachment website and a web-based recruiting presence.",
      "Generate and maintain recruiting plans; document and evaluate recruiting events and submit after-action reports through the designated HQ tracker.",
      "Maintain recruiting leads, protect personally identifiable information, follow up consistently, and add applicants to WINGS when appropriate."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), paras. 2.4-2.5, pp. 17-18",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Recruiting Officer, PDF p. 2"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "AS100 Instructor/Advisor/Records",
      "Anti-Terrorism FP (ATFP)",
      "Honor Guard Manager",
      "HSSP Manager",
      "ITAM Property Custodian",
      "Unit Safety Manager (USM)",
      "Organizational Email Box Action Officer",
      "PFRA"
    ],
    "alternateDuties": [
      "Self-Assessment Program Monitor",
      "Test Examiner (TE)",
      "Ground and Motorcycle Safety (HRA)",
      "Unit Fitness Program Manager (UFPM)",
      "Unit Fitness Assessment Cell (UFAC)"
    ]
  },
  "cabral": {
    "critical": "Instructs and advises AS100 cadets and manages their records, commissioning, and ICSP/HSSP contracting; serves as a primary contact for DoDMERB and assigned accessions processes.",
    "responsibilities": [
      "Complete the lesson objectives for assigned AS courses and LLAB instruction; modified lesson plans must still present all lesson objectives.",
      "Review assigned AS course grades at the end of each term to ensure academic standards are met.",
      "When assigned cadet feedback duties, discuss expectations and performance with the cadet and document initial and term feedback in WINGS after the verbal discussion."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), paras. 9.6-9.7, p. 78; paras. 9.11.1-9.11.6, p. 79",
      "AFROTCI 36-2011 Vol 2 (11 September 2024), paras. 1.11.1-1.12, p. 6; para. 1.13.4, p. 7",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Officer Accessions Instructor, PDF p. 2"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "AS100 Instructor/Advisor/Records",
      "Commissioning Management",
      "Government Purchase Card Holder",
      "ICSP & HSSP Contracting Management",
      "Unit Security Manager",
      "Unit Leave Monitor",
      "Unit Fitness Assessment Cell (UFAC)",
      "DoDMERB",
      "DDR Trusted Agent"
    ],
    "alternateDuties": [
      "Duty Status Monitor",
      "PRP Monitor",
      "EADs",
      "Vehicle Control Officer",
      "Extended Entitlements",
      "Uniform Program Custodian",
      "Cadet Travel NDEA/ODTA",
      "Cadet Pay (257) Internal Auditor",
      "IFCs"
    ]
  },
  "moore": {
    "critical": "Manages cadet enrollment, scholarships, monthly payment reporting, travel, and uniform program administration, along with other assigned personnel support duties.",
    "responsibilities": [
      "Detachment cadre manage personnel records for participants, applicants, and cadets under the commander’s oversight.",
      "The detachment maintains academic records, including syllabi, exams, gradebooks, and attendance records, for the required retention periods; more restrictive university requirements apply."
    ],
    "sources": [
      "AFROTCI 36-2011 Vol 3 (24 June 2026), para. 1.14.2, p. 14; para. 9.13, p. 81",
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Human Resource Administration, PDF p. 3"
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. Program responsibilities summarize the cited AFROTC guidance.",
    "primaryDuties": [
      "257 Monthly Payment Report Manager",
      "Cadet Travel NDEA/ODTA",
      "Extended Entitlements",
      "HSSP Travel Vouchers",
      "Ground and Motorcycle Safety (HRA)",
      "Scholarships",
      "Cadet Enrollment",
      "PRP Manager",
      "IFCs",
      "EADs",
      "Duty Status Monitor",
      "Uniform Program Custodian"
    ],
    "alternateDuties": [
      "Commissioning Management",
      "DDR Trusted Agent",
      "DoDMERB",
      "ITAM Property Custodian",
      "Task Manager",
      "Unit Leave Manager",
      "Unit Security Manager",
      "Self-Assessment Program Manager",
      "PFRA"
    ]
  },
  "tina": {
    "critical": "Serves as the liaison and primary contact between Detachment 250 and Iowa State University.",
    "responsibilities": [],
    "sources": [
      "Primary, Additional Duties, and Special Projects Roster (27 July 2026), Administrative Assistant, PDF p. 3",
      "University liaison and primary-contact role clarified by Capt Scott Russell."
    ],
    "note": "Primary and alternate duties reflect the Fall 2026 assignments in the signed detachment memo. The university liaison role also reflects Capt Russell’s clarification.",
    "primaryDuties": [
      "Liaison to ISU Administration",
      "Liaison to NROTC and AROTC",
      "Student Employee Pay",
      "University Purchase Card"
    ],
    "alternateDuties": [
      "NOTACC Manager",
      "Tasker Manager",
      "Uniform Program Custodian"
    ]
  },
  "deputyParo": {
    "critical": "Assists the Public Affairs & Recruiting Officer with recruiting, public communication, and cadet photos.",
    "responsibilities": [
      "Assist the PARO with recruiting event preparation, coordination, and cadet participation.",
      "Help prepare social media updates and the Dining-In video for the PARO’s review.",
      "Assist with semester cadet photos and updates to the cadet photo, fitness record, and academic record boards.",
      "Help coordinate publication of the detachment newsletter with the PARO and Intelligence Director."
    ],
    "note": "The Public Affairs & Recruiting Officer retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A12 Public Affairs and Recruiting Officer (PARO), PDF pp. 12"
    ]
  },
  "dhisto": {
    "critical": "Assists the Historical Officer with preserving and sharing detachment history.",
    "responsibilities": [
      "Assist the Historical Officer in organizing historical documents, photos, and other materials around the Armory.",
      "Help maintain the system used to store detachment historical information.",
      "Assist in preparing and maintaining the detachment history display."
    ],
    "note": "The Historical Officer retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A22 Historical Officer (HISTO), PDF pp. 13"
    ]
  },
  "ddc": {
    "critical": "Assists the Drill and Ceremony Commander with drill instruction, honor guard preparation, and ceremonial support.",
    "responsibilities": [
      "Assist with reviewing drill and honor guard guidance and preparing training materials under the commander’s direction.",
      "Help train and prepare ceremonial details and communicate standardized flag-duty procedures.",
      "Assist with honor guard equipment preparation, event coordination, and proposed equipment purchases.",
      "Support Marching Assistance Program planning and cadet choir event coordination as directed by the commander."
    ],
    "note": "The Drill and Ceremony Commander retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A32 Drill and Ceremonies Commander (D&C/CC), PDF pp. 15"
    ]
  },
  "dseo": {
    "critical": "Assists the Special Events Officer with planning and executing detachment special events.",
    "responsibilities": [
      "Assist the Special Events Officer with POW/MIA Memorial Run planning, logistics, and coordination with cadre, Wing Command, and participating agencies.",
      "Help prepare and execute the large-scale GLP/FTX event, including Joint Training Day or tri-service coordination when applicable."
    ],
    "note": "The Special Events Officer retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A34 Special Events Officer (SEO), PDF pp. 16"
    ]
  },
  "pfod": {
    "critical": "Assists the Physical Fitness Officer with planning and executing PT, fitness assessments, and supplemental fitness activities.",
    "responsibilities": [
      "Assist the PFO in preparing workouts, organizing fitness assessments, and bringing the required equipment.",
      "Help compile fitness results and identify improvement areas for the PFO’s coordination with the Assessment and Improvement Director.",
      "Support official and supplemental cadet fitness activities, tri-service fitness events, and flight Warrior Point opportunities.",
      "Help demonstrate proper exercise form, warm-ups, and recovery practices under the PFO’s direction."
    ],
    "note": "The Physical Fitness Officer retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A52 Physical Fitness Officer (PFO), PDF pp. 18"
    ]
  },
  "da9": {
    "critical": "Assists the Assessment and Improvement Director with readiness assessments, improvement projects, and counseling administration.",
    "responsibilities": [
      "Assist the director with tracking Innovation and Wellness projects, deadlines, resource needs, and progress reports.",
      "Help organize observations and inspection findings on wing discipline, efficiency, economy, and readiness for the director’s review.",
      "Assist with collecting, organizing, and retrieving counseling paperwork under the director’s supervision.",
      "Help prepare summaries of counseling patterns and trends for the director to report to Wing Command."
    ],
    "note": "The Assessment and Improvement Director retains responsibility for the position’s duties. The deputy assists with the work under the supervisor’s direction.",
    "sources": [
      "Det 250 local guidance from Capt Scott Russell: GMC deputies support their supervisors; responsibility remains with the supervisor.",
      "Fall 2026 OPLAN, Section B, A9 Assessment and Improvement Director (A9/DT), PDF pp. 20"
    ]
  }
};
