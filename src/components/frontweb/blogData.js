export const WHATSAPP_NUMBER = "919824431526";
export const PHONE_DISPLAY = "+91 98244 31526";
export const PHONE_LINK = "tel:+919824431526";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi BHsquare, I was reading the Solar Journal and have a question about rooftop solar.",
)}`;

export const CATEGORIES = [
  "All",
  "Government Subsidy",
  "Solar Tech",
  "Savings & ROI",
  "Maintenance",
];

export const FEATURED_ID = 1;

export const BLOG_POSTS = [
  {
    id: 1,
    slug: "pm-surya-ghar-gujarat-complete-guide-2026",
    title:
      "PM Surya Ghar in Gujarat: The Complete 2026 Homeowner's Guide",
    category: "Government Subsidy",
    date: "Nov 12, 2026",
    readTime: "8 min read",
    author: "BHsquare Engineering Desk",
    authorRole: "Design, subsidy & DISCOM compliance",
    initials: "BE",
    image:
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1600&q=82",
    imageAlt:
      "Aerial view of a rooftop solar installation at golden hour",
    excerpt:
      "How the ₹78,000 central subsidy works, who qualifies in Gujarat, and the documents that keep your claim moving from portal to bank account.",
    intro:
      "For most homeowners in Gujarat, the rooftop solar decision begins with one question: how much of the system will the government actually pay for? Here is the straight answer, plus the paperwork most people only discover after the panels are already on the roof.",
    takeaways: [
      "A 3 kW or larger residential system can receive up to ₹78,000 in central financial assistance.",
      "The subsidy is credited to the homeowner's bank account after the net meter is commissioned.",
      "Your electricity connection, roof ownership and DISCOM feasibility approval must be in order before installation.",
    ],
    sections: [
      {
        heading: "What PM Surya Ghar actually pays for",
        paragraphs: [
          "The scheme provides direct central financial assistance to residential rooftop solar systems. It is not a discount handed over by the installer — the money is released by the government to the homeowner's bank account once the system is installed, inspected and connected to the grid.",
          "The central support is structured in slabs rather than as a flat percentage of your bill.",
        ],
        bullets: [
          "1 kW system — ₹30,000 central assistance",
          "2 kW system — ₹60,000 central assistance",
          "3 kW and above — ₹78,000 maximum central assistance",
        ],
      },
      {
        heading: "Who qualifies in Gujarat",
        paragraphs: [
          "The residential scheme is built around an owned or legally permitted rooftop, an active residential electricity connection and a DISCOM that can support net metering at your address. A society flat or a rented home may still be possible, but the approval route is different and usually requires the owner or housing society to be the applicant.",
          "Commercial and industrial rooftops do not fall under the residential subsidy. If you are planning a larger property with mixed usage, the right answer often comes from the DISCOM's feasibility team rather than a generic online calculator.",
        ],
      },
      {
        heading: "The route from application to first bill",
        paragraphs: [
          "The sequence matters. Applying late, installing early or choosing an unregistered vendor can each add weeks to the process.",
        ],
        bullets: [
          "Register the application on the national portal with the homeowner's own details.",
          "Wait for DISCOM technical feasibility approval for the sanctioned load and roof.",
          "Sign with a registered installer and complete the approved system size.",
          "Apply for inspection, then get the bi-directional net meter installed.",
          "Confirm bank details and receive the subsidy in the homeowner's account.",
        ],
      },
      {
        heading: "Where applications usually get stuck",
        paragraphs: [
          "The most common delay is a mismatch between the name on the electricity bill, the property document and the bank account. The second most common is structural: a roof that needs waterproofing or a mounting layout that changes after the site survey.",
          "A professional installer will audit these details before quoting. A cheap quote that skips them is not cheap for long.",
        ],
      },
    ],
    quote: {
      text: "The subsidy is only one line in the payback math. The quality of the installation is what protects the next twenty years.",
      by: "BHsquare Engineering Desk",
    },
    tags: ["PM Surya Ghar", "Gujarat", "Subsidy", "Net Metering"],
  },
  {
    id: 2,
    slug: "on-grid-vs-hybrid-solar-home",
    title: "On-Grid vs. Hybrid Solar: Which System Fits Your Home?",
    category: "Solar Tech",
    date: "Oct 28, 2026",
    readTime: "6 min read",
    author: "Harsh Patel",
    authorRole: "Lead solar architect",
    initials: "HP",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Solar panels in an open field under a blue sky",
    excerpt:
      "Battery backup or lowest payback? A practical way to compare net-metering savings with the independence a hybrid system provides.",
    intro:
      "The on-grid versus hybrid decision is usually presented as a technology choice. In practice, it is a decision about how much you are willing to pay for certainty when the grid goes down.",
    takeaways: [
      "On-grid systems are simpler, cheaper and typically deliver the fastest payback.",
      "Hybrid systems add battery backup, but also add cost, weight and a new maintenance surface.",
      "Choose hybrid only when the frequency and length of outages justify the premium.",
    ],
    sections: [
      {
        heading: "Start with the grid you actually have",
        paragraphs: [
          "If your area has short, infrequent outages and your main goal is a lower monthly bill, an on-grid system is usually the rational choice. It uses the grid as a virtual battery: extra daytime units are exported, and those credits offset the electricity you use at night.",
          "If outages are frequent, long or disruptive — think medical equipment, a home office, or a locality with unstable supply — the conversation changes. A battery may be worth more to you than a slightly faster payback.",
        ],
      },
      {
        heading: "The economics of on-grid",
        paragraphs: [
          "An on-grid system has no battery to replace, no extra conversion losses and a simpler bill of materials. For most residential rooftops in South Gujarat, that translates into the lowest cost per installed kilowatt and the shortest break-even period.",
          "Its weak point is equally simple: when the grid fails, the inverter shuts down for safety. You keep your panels, but you do not keep your lights on.",
        ],
      },
      {
        heading: "Where hybrid earns its premium",
        paragraphs: [
          "A hybrid inverter can run selected loads from a battery during an outage. The key word is selected. Most homes do not need to back up an entire house; they need the lights, fans, router, refrigerator and perhaps a few dedicated sockets.",
          "Sizing the battery around that critical load is far more cost-effective than buying capacity for every appliance. It also keeps the system lighter, cooler and easier to service.",
        ],
      },
      {
        heading: "A simple way to decide",
        paragraphs: [
          "Write down the last three months of outages. If you cannot remember a meaningful one, put the battery budget into better panels or a cleaner installation. If outages regularly interrupt work, sleep or medical needs, a modest hybrid system is not a luxury — it is infrastructure.",
        ],
        bullets: [
          "Bill reduction first, no backup needs — on-grid",
          "Frequent short outages, essential loads only — small hybrid",
          "Long outages or off-grid location — properly sized hybrid",
        ],
      },
    ],
    quote: {
      text: "A battery is not a status symbol. It is a cost you should be able to explain in outages avoided.",
      by: "Harsh Patel, Lead Solar Architect",
    },
    tags: ["On-grid", "Hybrid", "Battery", "Net Metering"],
  },
  {
    id: 3,
    slug: "how-net-metering-cuts-electricity-bills",
    title: "How Net Metering Turns Your Rooftop Into a Bill-Killer",
    category: "Savings & ROI",
    date: "Oct 10, 2026",
    readTime: "7 min read",
    author: "BHsquare Advisory Desk",
    authorRole: "Energy economics & customer advisory",
    initials: "BA",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Rows of solar panels stretching towards the horizon",
    excerpt:
      "What actually happens to the units you export at 1 PM, and how those credits quietly pay for the air-conditioning you run at 10 PM.",
    intro:
      "Solar produces most of its energy when your home uses the least. Net metering is the accounting mechanism that bridges those two facts — but it only works well when the system is sized for your connection, not just your roof.",
    takeaways: [
      "A bi-directional meter records both the units you import and the units you export.",
      "Exported units become credits that offset future consumption under DISCOM rules.",
      "Oversizing beyond your sanctioned load can leave surplus energy poorly compensated.",
    ],
    sections: [
      {
        heading: "What net metering changes",
        paragraphs: [
          "Without net metering, every exported unit is effectively lost. With a bi-directional meter, the grid becomes a bank: your panels deposit units during the day and your home withdraws them later.",
          "The meter does not care that the sun has set. It only records the net position between what you took and what you gave back.",
        ],
      },
      {
        heading: "How the credit appears on your bill",
        paragraphs: [
          "Your monthly bill separates consumption, export and any carried-forward credit. The exact settlement period and compensation rate are set by the state regulator and your DISCOM, so the number on the bill can differ from a simple units-exported calculation.",
          "The useful habit is to read the meter reading and the credit line together. A system can be generating perfectly and still look disappointing if the connection is not exporting.",
        ],
      },
      {
        heading: "Size for the connection, not just the roof",
        paragraphs: [
          "A roof may physically hold 5 kW while the sanctioned load supports less. Installing more than the approved capacity can create approval problems and weaken the economics of the surplus.",
          "The better approach is to model your last twelve months of consumption, then size for the load you can actually bank. A slightly smaller system with clean approvals usually beats an oversized system with an unresolved export.",
        ],
      },
      {
        heading: "Three habits that protect your credits",
        paragraphs: [
          "Net metering rewards consistency. These small checks keep the accounting honest.",
        ],
        bullets: [
          "Check the inverter app against the meter reading once a month.",
          "Shift heavy loads like laundry or water heating into daylight hours when possible.",
          "Report a sudden export drop to your installer instead of waiting for the quarterly bill.",
        ],
      },
    ],
    tags: ["Net Metering", "Electricity Bill", "ROI", "DISCOM"],
  },
  {
    id: 4,
    slug: "monsoon-dust-solar-panel-care",
    title: "Monsoon & Dust Care: Simple Habits for Peak Solar Output",
    category: "Maintenance",
    date: "Sep 19, 2026",
    readTime: "4 min read",
    author: "BHsquare O&M Crew",
    authorRole: "Operations & maintenance",
    initials: "OM",
    image:
      "https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Close-up of solar panels with trees in the background",
    excerpt:
      "Keep Tier-1 panels working at full efficiency through Gujarat's dust, pollen and monsoon season with a low-effort routine.",
    intro:
      "Solar panels have no moving parts, which makes them remarkably low-maintenance. In South Gujarat, however, dust, pollen and monsoon debris can quietly trim generation by 10–15% if the glass is left alone for months.",
    takeaways: [
      "Clean panels early in the morning or after sunset — never with cold water at midday.",
      "A soft microfiber mop and plain water handle almost every residential cleaning.",
      "A sudden drop in the inverter's daily curve is a signal to inspect, not to wait.",
    ],
    sections: [
      {
        heading: "A cleaning rhythm that works",
        paragraphs: [
          "There is no need to scrub panels every week. In most residential areas, a rinse every two to four weeks during the dusty season and a more thorough clean after the monsoon is enough.",
          "Use plain water and a soft microfiber mop. Avoid abrasive brushes, metal scrapers and strong detergents. The glass coating is durable, but it is not indestructible.",
        ],
      },
      {
        heading: "The monsoon checklist",
        paragraphs: [
          "Before the first heavy rain, walk the mounting structure and look for loose clamps, cracked cable ties or water pooling near the inverter. After the rain, check for leaf litter, bird droppings and any new shading from branches.",
          "Waterproofing matters more than most homeowners expect. A clean installation protects the roof as carefully as it protects the panels.",
        ],
      },
      {
        heading: "Inverter and wiring checks",
        paragraphs: [
          "The inverter is the most informative part of the system. Check its daily generation curve rather than only the instantaneous reading. A flat line at midday, repeated error codes or a warm cable joint deserve a professional inspection.",
          "Never open the inverter enclosure or tighten DC connections yourself. The voltages on a rooftop array can be lethal even after the AC switch is off.",
        ],
      },
      {
        heading: "When to call us",
        paragraphs: [
          "Call for a service visit if output drops sharply for several sunny days, if you see discolouration around a junction box, or if the inverter reports a ground fault. These are not cleaning problems, and they should not be diagnosed over a phone call.",
        ],
      },
    ],
    tags: ["Maintenance", "Cleaning", "Monsoon", "Inverter"],
  },
  {
    id: 5,
    slug: "solar-loans-gujarat-emi-payback",
    title: "Solar Loans in Gujarat: EMI, Subsidy and the Real Payback Math",
    category: "Savings & ROI",
    date: "Aug 30, 2026",
    readTime: "6 min read",
    author: "BHsquare Advisory Desk",
    authorRole: "Energy economics & customer advisory",
    initials: "BA",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Aerial view of a large solar array beside green fields",
    excerpt:
      "A solar loan can preserve your cash flow — if you compare the total cost, the subsidy timing and the fine print, not just the monthly EMI.",
    intro:
      "Cash or loan? For many homeowners, the more useful question is not whether to finance a rooftop system, but how to compare two offers that look identical on the monthly payment line.",
    takeaways: [
      "Compare total interest, processing fees and insurance — not only the EMI.",
      "Plan for the gap between paying the installer and receiving the subsidy.",
      "Ask whether prepayment is allowed without a penalty before you sign.",
    ],
    sections: [
      {
        heading: "How solar loans usually work",
        paragraphs: [
          "Most residential solar loans are secured against the system or offered as a personal loan variant. The lender releases funds in stages as the installation progresses, and the repayment schedule begins either immediately or after commissioning.",
          "A staged release protects you as much as it protects the lender. It keeps the final payment tied to completed work, inspection and net-meter commissioning.",
        ],
      },
      {
        heading: "The subsidy gap",
        paragraphs: [
          "The central subsidy is released after the system is commissioned and the bank details are verified. That creates a temporary gap between what you have paid and what you will receive back.",
          "Ask the lender whether the EMI can be structured around that gap, and keep the subsidy confirmation ready. A clear paper trail makes the bridge shorter.",
        ],
      },
      {
        heading: "Reading the payback math honestly",
        paragraphs: [
          "A credible payback estimate uses your actual consumption, a realistic generation figure for your city and the tariff you pay. It should treat the subsidy as delayed cash flow, not an instant discount.",
          "If an offer shows a five-year payback while another shows eight for the same roof, the difference is usually hidden in assumptions: generation, escalation, battery costs or missed maintenance.",
        ],
        bullets: [
          "Ask for the annual generation assumption in writing.",
          "Add maintenance and inverter replacement to the long-term cost.",
          "Compare the total repayable amount, not just the EMI.",
        ],
      },
      {
        heading: "Questions to ask your lender",
        paragraphs: [
          "The best loan is the one whose worst-case clause you can live with. Read the prepayment terms, the late-payment treatment and the insurance requirement before comparing interest rates.",
        ],
        bullets: [
          "Is the interest rate fixed or floating?",
          "Are processing fees and GST included in the quote?",
          "Can I prepay without a penalty?",
          "What happens if the subsidy is delayed?",
        ],
      },
    ],
    tags: ["Solar Loan", "EMI", "Payback", "Finance"],
  },
];

export const RECOMMENDED_POSTS = [
  {
    id: 6,
    slug: "west-facing-roof-solar-panel-layout",
    title: "West-Facing Roof? Here's Where Your Panels Should Go",
    category: "Rooftop Design",
    date: "Nov 05, 2026",
    readTime: "4 min read",
    author: "BHsquare Design Studio",
    authorRole: "Rooftop layout & structural design",
    initials: "DS",
    image:
      "https://images.unsplash.com/photo-1595437193398-f24279553f4f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Rooftop solar panels with a small wind turbine against a blue sky",
    excerpt:
      "Direction is only one variable. Shading, tilt, walkways and the DISCOM connection decide how much of your roof is actually usable.",
    intro:
      "A west-facing roof is not a disqualification for solar. It is a design constraint — one that a good layout can work with and a lazy one will ignore.",
    takeaways: [
      "West-facing arrays produce later in the day, which can match evening consumption well.",
      "Shading and roof access usually matter more than a few degrees of tilt.",
      "Keep service walkways and inverter access clear from day one.",
    ],
    sections: [
      {
        heading: "Direction is only one variable",
        paragraphs: [
          "South-facing panels are often treated as the default, but a west-facing roof can be a strong performer because it generates during the late afternoon, when many homes begin to peak. The trade-off is a slightly lower total yield than an ideal south-facing layout.",
          "That trade-off is frequently smaller than the loss caused by a nearby water tank, a stairwell or a tree that shades only one corner of the array.",
        ],
      },
      {
        heading: "What we check before fixing a layout",
        paragraphs: [
          "A useful layout starts with a shadow study across the year, not a sketch on a brochure. We map the roof's usable rectangle, the minimum walkway, the cable route and the point where the inverter can be serviced safely.",
        ],
        bullets: [
          "Shadow path from neighbouring buildings and trees",
          "Parapet height and wind loading at the roof edge",
          "Cable distance to the inverter and earthing point",
          "Access for cleaning and future service",
        ],
      },
      {
        heading: "A practical rule of thumb",
        paragraphs: [
          "If the west-facing area is your only option, use it — but do not squeeze panels into shaded corners to hit a round number. A slightly smaller, unshaded array will usually beat a larger one that spends its afternoons in shadow.",
        ],
      },
    ],
    tags: ["Rooftop Design", "Layout", "Shading", "West-facing"],
  },
  {
    id: 7,
    slug: "questions-before-signing-solar-contract",
    title: "7 Questions to Ask Before You Sign a Solar Contract",
    category: "Buyer's Guide",
    date: "Oct 22, 2026",
    readTime: "5 min read",
    author: "BHsquare Advisory Desk",
    authorRole: "Energy economics & customer advisory",
    initials: "BA",
    image:
      "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "An installer lifting a solar panel onto a tiled roof",
    excerpt:
      "A fair quote is specific about equipment, warranties, approvals and the person who answers the phone after commissioning.",
    intro:
      "The most expensive solar contract is rarely the one with the highest price. It is the one that leaves the important details unspoken until something goes wrong.",
    takeaways: [
      "A good quote names the panel, inverter, mounting and protection equipment.",
      "Approvals and net metering should be part of the scope, not a separate favour.",
      "Service response time matters as much as the warranty length.",
    ],
    sections: [
      {
        heading: "The scope should be specific",
        paragraphs: [
          "Ask for the make and model of every major component, the mounting structure specification, the cable and protection equipment, and whether waterproofing is included. If a quote only says '5 kW system', it is not a quote you can compare.",
        ],
      },
      {
        heading: "Warranty and service",
        paragraphs: [
          "A 25-year panel warranty is a manufacturer promise. The installer's promise is the one that determines how quickly you get help. Ask who handles a service call in year four, and what the response time is.",
        ],
      },
      {
        heading: "Seven questions worth asking",
        paragraphs: [
          "If the answers are vague, get them in writing before you pay an advance.",
        ],
        bullets: [
          "What exact panel and inverter models are included?",
          "Are DISCOM approvals and net metering in the scope?",
          "Is roof waterproofing covered, and for how long?",
          "What is the workmanship warranty period?",
          "Who services the system after installation?",
          "What is excluded from the quoted price?",
          "Can I see a commissioned site in my area?",
        ],
      },
    ],
    tags: ["Buyer's Guide", "Contract", "Warranty", "Installation"],
  },
  {
    id: 8,
    slug: "gujarat-solar-application-to-net-meter-timeline",
    title: "From Application to Net Meter: Gujarat's Solar Timeline",
    category: "Process",
    date: "Sep 30, 2026",
    readTime: "6 min read",
    author: "BHsquare Project Desk",
    authorRole: "Project execution & commissioning",
    initials: "PD",
    image:
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Technicians installing solar panels on a roof",
    excerpt:
      "A realistic week-by-week view of feasibility approval, installation, inspection and the day your bi-directional meter goes live.",
    intro:
      "A solar project is not delayed by the panels. It is delayed by approvals, paperwork and the small hand-offs between the homeowner, the installer and the DISCOM.",
    takeaways: [
      "Feasibility approval sets the real start date for installation.",
      "Inspection and net-meter installation are separate steps.",
      "Clear documents and a responsive installer prevent most delays.",
    ],
    sections: [
      {
        heading: "A realistic week-by-week view",
        paragraphs: [
          "Every circle and every roof is different, but the shape of the process is consistent. The durations below are typical planning windows, not guarantees.",
        ],
        bullets: [
          "Week 1 — portal registration and document submission",
          "Weeks 2–3 — DISCOM feasibility and technical approval",
          "Weeks 3–4 — installation and internal electrical checks",
          "Week 4–5 — inspection application and site visit",
          "Week 5–6 — net meter installation and commissioning",
          "After commissioning — subsidy verification and bank credit",
        ],
      },
      {
        heading: "What causes delays",
        paragraphs: [
          "Name mismatches, missing roof documents, a vendor who is not registered for the scheme, or a last-minute change in system size are the usual culprits. Each one triggers a fresh round of verification.",
          "Weather can delay the installation itself, but it is rarely the reason a project takes an extra month. The calendar is usually lost in the paperwork.",
        ],
      },
      {
        heading: "How to keep it moving",
        paragraphs: [
          "Keep digital copies of your electricity bill, property document and bank details ready. Ask for a written project schedule with the approval steps named. Then check in at the milestones instead of waiting for a surprise.",
          "A good installer will show you the application status, the inspection slot and the expected meter date. If those answers feel vague, the timeline probably is too.",
        ],
      },
    ],
    tags: ["Process", "Net Meter", "DISCOM", "Timeline"],
  },
];

export const ALL_POSTS = [...BLOG_POSTS, ...RECOMMENDED_POSTS];

export const getPostsByCategory = (posts, category) =>
  category === "All" ? posts : posts.filter((post) => post.category === category);

export const searchPosts = (posts, query) => {
  const term = query.trim().toLowerCase();
  if (!term) return posts;
  return posts.filter((post) =>
    [post.title, post.excerpt, post.category, post.author, ...(post.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
};
