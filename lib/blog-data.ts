export type BlogCategory = "Health & Tips" | "Program Stories" | "Thought Leadership"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: BlogCategory
  author: string
  authorRole: string
  date: string
  readTime: number // minutes
  image: string
  featured?: boolean
  tags: string[]
}

export const blogPosts: BlogPost[] = [

  // ── FEATURED ─────────────────────────────────────────────────────────────
  {
    slug: "nigeria-maternal-mortality-crisis",
    title: "Nigeria's Maternal Mortality Crisis: Why One Woman Dies Every Hour",
    excerpt:
      "Nigeria accounts for nearly 20% of all maternal deaths worldwide. Behind that statistic are individual women, families, and communities that deserve better. Here is what is driving the crisis — and what can change it.",
    content: `
Nigeria has one of the highest maternal mortality ratios in the world, estimated at 512 deaths per 100,000 live births. In practical terms, a Nigerian woman faces a 1-in-22 lifetime risk of dying from pregnancy or childbirth. In the United Kingdom, that risk is 1 in 4,700. The gap is not inevitable — it is the product of decades of underinvestment, structural inequality, and neglect of women's health.

## The Scale of the Problem

Every year, approximately 58,000 Nigerian women die from complications of pregnancy and childbirth. That is more than 150 every day — more than six every hour. The leading direct causes are haemorrhage (excessive bleeding), sepsis (infection), eclampsia (pregnancy-related seizures), obstructed labour, and unsafe abortion.

These deaths are overwhelmingly concentrated among the poorest women, in the North West and North East geopolitical zones, and in rural communities far from functioning health facilities. But urban poverty is no protection: women in informal settlements in Lagos and Port Harcourt face their own set of barriers — overcrowded facilities, informal fees, and a shortage of skilled birth attendants.

## Why Women Are Still Dying

The causes of maternal mortality in Nigeria operate at multiple levels.

**Distance and transport** remain formidable barriers. In rural Kebbi, Zamfara, or Borno State, the nearest primary health centre may be more than 10 kilometres away, often without reliable roads. By the time a woman with a postpartum haemorrhage reaches care, she may already be in haemorrhagic shock.

**Facility readiness is deeply uneven.** A 2022 survey by Nigeria's Federal Ministry of Health found that fewer than 30% of primary health centres in some northern states had functioning delivery rooms, essential medicines for obstetric emergencies, or blood transfusion services.

**The human resource crisis is severe.** Nigeria has one of the most acute shortages of midwives and skilled birth attendants in the world. Many trained health workers have emigrated — a brain drain accelerated by poor pay, unsafe working conditions, and limited professional development opportunities.

**Cultural and social factors** matter too. In some communities, decisions about where a woman delivers are made by her husband or mother-in-law rather than by the woman herself. Traditional birth attendants, though often trusted and accessible, frequently lack the skills to manage life-threatening emergencies.

## What Works: Lessons From Within Nigeria

There are reasons for guarded optimism. States that have invested seriously in free maternal health care, emergency obstetric services, and community health workers have seen measurable reductions in deaths. Anambra State's sustained investment in primary healthcare and Ogun State's results-based financing for health facilities are often cited as models within Nigeria.

Community-based interventions — peer support groups, community health workers trained in danger sign recognition, and male engagement programmes — have also demonstrated impact at low cost.

## The Role of Civil Society

Organisations like AdeGrange Child Foundation work in this space because the government alone cannot reach every community. Our programmes train local women to recognise danger signs, support facility delivery, and advocate for their own care. Every woman we reach represents one step away from the statistic — and toward the future Nigeria's mothers deserve.
    `,
    category: "Health & Tips",
    author: "Prof. Adenike Grange",
    authorRole: "Founder, AdeGrange Child Foundation",
    date: "2024-11-10",
    readTime: 7,
    image:
      "/images/blob/eatingwell.jpg",
    featured: true,
    tags: ["Maternal Health", "Nigeria", "Public Health", "Women"],
  },

  // ── HEALTH & TIPS ─────────────────────────────────────────────────────────
  {
    slug: "malaria-children-west-africa",
    title: "Malaria and Children Under Five in West Africa: What Every Parent Must Know",
    excerpt:
      "Malaria kills a child in sub-Saharan Africa every two minutes. In West Africa — where Nigeria, Ghana, and Côte d'Ivoire bear the heaviest burden — it remains the leading cause of death in children under five. Here is what parents can do.",
    content: `
West Africa carries a disproportionate share of the world's malaria burden. Nigeria alone accounts for roughly 27% of all global malaria deaths — more than any other country. In the region as a whole, the disease kills hundreds of thousands of children under five every year, and leaves millions more with lasting effects on brain development and school performance.

Understanding malaria is the first step toward preventing it.

## How Malaria Kills Children So Quickly

In adults with some acquired immunity, malaria often presents as a severe but survivable fever. In young children — especially those under two who have not yet built immunity — it can progress to life-threatening complications within hours.

**Cerebral malaria**, where the parasite crosses into the brain, causes seizures, coma, and death or permanent neurological damage in many cases. **Severe anaemia**, caused by the destruction of red blood cells, is another major killer. Children with severe malaria anaemia may need emergency blood transfusions that are simply not available in many communities.

The speed of deterioration is what makes malaria so dangerous. A child who wakes with a mild fever can be critically ill by evening.

## Warning Signs That Demand Immediate Action

Seek care immediately if your child has:

- Fever above 38°C that does not improve within 24 hours
- Rapid breathing or difficulty breathing
- Seizures or convulsions
- Inability to drink, feed, or stay awake
- Yellowing of the eyes or skin
- Unusual paleness of the lips, gums, or inner eyelids

Do not wait to see if symptoms resolve on their own. In young children, waiting is dangerous.

## Prevention: The Basics That Save Lives

**Insecticide-treated bed nets (ITNs)** are the single most cost-effective malaria prevention tool available. Used correctly — tucked under the mattress every night — they can reduce child malaria deaths by more than 50%. Nigeria's national malaria programme distributes free nets through health facilities and community campaigns. If you have not received one, ask at your nearest health centre.

**Indoor residual spraying (IRS)** involves treating the inside walls of homes with long-lasting insecticides. Several state governments in Nigeria run IRS campaigns; check with your local government health department.

**Intermittent preventive treatment (IPTp)** is recommended for pregnant women — taking sulphadoxine-pyrimethamine at antenatal visits significantly reduces malaria in pregnancy, which also protects the developing baby.

**Clearing stagnant water** around your home removes mosquito breeding sites. Old tyres, uncovered water containers, and blocked gutters are common culprits.

## Treatment: Acting Fast and Finishing the Course

The first-line treatment for uncomplicated malaria in Nigeria is artemisinin-based combination therapy (ACT), available free or subsidised at government health facilities and PHCs. It is essential to complete the full course even if symptoms improve quickly — stopping early allows parasites to survive and become resistant.

Never use leftover or unverified medication, and avoid chloroquine alone, which parasites in West Africa are now widely resistant to.

Malaria is preventable and treatable. The tragedy is when it kills because prevention was not in place or treatment came too late.
    `,
    category: "Health & Tips",
    author: "AdeGrange Health Team",
    authorRole: "Community Health Specialists",
    date: "2024-09-18",
    readTime: 6,
    image:
      "/images/blob/Malaria in Africa.jpg",
    tags: ["Malaria", "Child Health", "West Africa", "Nigeria", "Prevention"],
  },

  {
    slug: "nutrition-pregnancy-nigeria",
    title: "Eating Well During Pregnancy in Nigeria: A Practical Guide for Mothers",
    excerpt:
      "Proper nutrition during pregnancy shapes a child's health for life. This guide covers the key foods available in Nigerian markets that support healthy pregnancy — and the common gaps that put mothers and babies at risk.",
    content: `
Good nutrition during pregnancy is one of the most powerful investments a family can make. What a mother eats during those nine months shapes the development of her baby's brain, immune system, and organs — setting a foundation that influences health outcomes for decades.

In Nigeria, nutritional deficiencies during pregnancy are common and frequently go unaddressed. Iron deficiency anaemia affects an estimated 56% of pregnant Nigerian women. Iodine deficiency remains a public health concern in many states. And while household food insecurity is a major driver of poor maternal nutrition, knowledge gaps play a role too — many women do not know which locally available foods meet their increased nutritional needs.

## The Key Nutrients and Where to Find Them

**Iron** is critical during pregnancy to support the expanded blood volume that carries oxygen to the baby. Without enough iron, mothers become anaemic — exhausted, short of breath, and at much higher risk of haemorrhage during delivery. Iron-rich Nigerian foods include:

- **Liver** (beef or chicken) — one of the richest sources of iron available
- **Dark leafy vegetables**: ugwu (fluted pumpkin leaves), bitter leaf, waterleaf, and spinach
- **Beans and cowpeas** (black-eyed peas, ewa, or oloyin beans) — affordable and widely available
- **Ofada rice** and other local wholegrain cereals

Eating these foods with a source of **vitamin C** — such as tomatoes, garden eggs, or orange juice — dramatically improves iron absorption.

**Folic acid** is essential in the first 12 weeks of pregnancy to prevent neural tube defects like spina bifida. If possible, start taking a daily folic acid supplement before conception or as soon as pregnancy is confirmed. Foods rich in folate include peas, beans, liver, and dark leafy greens.

**Calcium** supports the development of the baby's bones and teeth, and protects the mother's own bone density. Good sources include:
- **Fish eaten with bones** — like sardines or dried crayfish
- **Milk and yoghurt** where accessible
- **Dark leafy vegetables**

**Protein** is needed for the baby's growth and the repair of maternal tissues. In Nigerian diets, protein commonly comes from beans, eggs, fish (both fresh and dried), meat, and groundnuts. Aim to include a protein source at every meal.

## Foods to Be Cautious With

While Nigerian cuisine is nutritious, a few precautions are worth noting during pregnancy:

- **Raw or undercooked meat and fish** carry risks of listeria and toxoplasmosis — ensure all meat is thoroughly cooked
- **Excess salt** in highly processed or smoked foods can worsen pregnancy-related hypertension
- **Herbal preparations** widely sold in markets should be approached with caution — some have not been tested for safety in pregnancy and a few are known to stimulate contractions

## The Antenatal Visit: Your Most Important Resource

Every antenatal visit is an opportunity to have your nutrition and weight gain assessed. Iron and folic acid supplements are provided free at government antenatal clinics. Ask your midwife or doctor about your diet — and if you are struggling with food security, ask about community support programmes in your area.

You cannot pour from an empty cup. Nourishing yourself during pregnancy is not indulgent — it is essential.
    `,
    category: "Health & Tips",
    author: "AdeGrange Health Team",
    authorRole: "Community Health Specialists",
    date: "2024-07-04",
    readTime: 6,
    image:
      "/images/blob/eatingwell.jpg",
    tags: ["Nutrition", "Pregnancy", "Nigeria", "Women", "Maternal Health"],
  },

  // ── PROGRAM STORIES ───────────────────────────────────────────────────────
  {
    slug: "girls-health-matter-lagos-2019",
    title: "Girls Health Matter: How 40 Lagos Teenagers Became Their Own Health Advocates",
    excerpt:
      "In a Lagos classroom in the summer of 2019, 40 teenage girls did something many had never done before — they talked openly about their bodies. What followed changed more than just their health knowledge.",
    content: `
Afolake was 15 years old when she joined the Girls Health Matter programme in the summer of 2019. She had been missing school one week every month for almost a year — not because she was ill, but because she had no access to sanitary pads and no one to talk to about what she was experiencing.

By the end of the week-long programme, she had not only the knowledge to manage her menstrual health but the words to explain to her younger sister why she should never feel ashamed of her body. She also had a bag of sanitary products donated by the programme's community partners.

Afolake's story is not unusual. It is Nigeria.

## Adolescent Girls in Lagos: The Health Knowledge Gap

Nigeria is home to more than 20 million adolescent girls. In Lagos — Africa's largest city — rapid urbanisation has created communities where girls are physically close to health facilities but culturally distant from the care they need. Reproductive health topics are often considered taboo in school and at home. Many girls navigate puberty, menstruation, and the pressures of adolescence in near-total isolation.

The consequences are measurable. Teenage pregnancy rates in Lagos remain significant. Menstrual absenteeism — missing school due to period-related challenges — affects learning outcomes. And girls who do not understand their own bodies are more vulnerable to exploitation.

## The Programme Design

Girls Health Matter was carefully designed around the specific context of Nigerian adolescent girls. The five-day intensive programme, held in a trusted community space in Lagos, brought together 40 girls aged 13 to 17.

Sessions were facilitated exclusively by female health professionals and peer educators — a deliberate choice to create safety. Topics covered included:

- Menstrual health, hygiene management, and the normalisation of periods
- Understanding puberty and bodily changes
- Nutrition for adolescent girls, including iron-rich foods common in Nigerian diets
- Mental health, stress, and the pressures facing Nigerian girls
- Safe relationships and assertiveness — saying no without losing relationships

An anonymous question box collected the questions girls were too embarrassed to ask aloud. The answers, read and addressed by facilitators at the end of each day, generated some of the most powerful discussions of the programme.

## The Impact

Post-programme evaluations showed that 94% of participants increased their knowledge of reproductive health. Six months later, follow-up conversations revealed something more meaningful: the girls had become informal health educators in their own communities.

*"I told my mother what I learned about anaemia and she started adding more ugu to our soup,"* one participant shared. *"She didn't know that's why she was always tired."*

Another girl had set up a small peer group at her school where girls could ask questions they couldn't raise in class. She was 16.

## What We Learned

Girls Health Matter confirmed something we believe deeply at AdeGrange: when you invest in a girl, she does not keep that investment to herself. She multiplies it. The challenge is creating the conditions in which she feels safe enough to receive it in the first place.

We are working to expand the programme to additional Lagos communities and to partner with schools to integrate menstrual health education into the curriculum.
    `,
    category: "Program Stories",
    author: "AdeGrange Programme Team",
    authorRole: "Programmes & Impact",
    date: "2024-08-22",
    readTime: 7,
    image:
      "/images/blob/girlsHealthmatter.jpg",
    tags: ["Girls Health", "Adolescent Health", "Lagos", "Nigeria", "Women"],
  },

  {
    slug: "peer-dialogue-programme-west-africa",
    title: "Talking Changes Lives: The Power of Peer-to-Peer Health Dialogue in Nigerian Communities",
    excerpt:
      "When health information comes from a trusted neighbour rather than a clinic poster, it lands differently. Our peer-to-peer dialogue programme in Lagos showed just how far that difference can reach.",
    content: `
In the summer of 2017, AdeGrange Child Foundation ran an experiment. Instead of bringing health professionals into a Lagos community to deliver information, we trained local women to have conversations with their neighbours about maternal and child health.

The results reshaped how we think about community health education.

## The Logic of Peer Education

Nigeria's primary healthcare system reaches fewer than 50% of its intended population. The gap is filled — imperfectly, but persistently — by informal networks: market women, church groups, mosque congregations, neighbourhood associations, and the relationships between mothers on the same street.

Information that travels through these networks is trusted in ways that institutional messaging rarely is. A woman is more likely to change her behaviour based on what her childhood friend says than based on a government leaflet or a health worker she met once.

Peer-to-peer health education builds on this reality rather than fighting it.

## Training the Trainers in Lagos

We selected 20 women from three Lagos communities — Mushin, Ajegunle, and Surulere — to serve as peer health educators. The selection criteria were simple: they were respected in their communities, had time to engage, and were willing to learn and share.

Training covered:

- The danger signs of pregnancy and early childhood illness
- When and where to seek care (including the nearest functioning PHCs)
- The importance of antenatal attendance and facility delivery
- Breastfeeding support and complementary feeding for infants
- Child immunisation schedules under Nigeria's National Programme on Immunisation
- How to facilitate a conversation, not lecture

Training was delivered in Yoruba and Pidgin English to ensure accessibility. Role plays, storytelling, and visual aids were used throughout.

## What Happened Next

Over three months, the 20 peer educators reached more than 300 women in their communities through one-on-one conversations, small group meetings, and community events. Topics were not prescribed — educators responded to what their neighbours actually wanted to know.

The conversations surfaced concerns that formal surveys rarely capture: the shame women felt about difficult pregnancies, the pressure from mothers-in-law to deliver at home, the cost of transport to the nearest maternity ward, the fear of what a positive HIV test would mean for a marriage.

Follow-up data collected six months later showed a 34% increase in antenatal attendance among women who had regular contact with a peer educator, compared to a comparison community. Immunisation uptake also rose. But perhaps more importantly, women reported feeling less alone.

## Replicating What Works

The peer dialogue model has since been integrated into all of AdeGrange's community programmes. The key lesson is not complicated: health information is only as powerful as the relationships through which it travels. In Nigeria, those relationships are already there. Our job is to equip the women at the centre of them.
    `,
    category: "Program Stories",
    author: "AdeGrange Programme Team",
    authorRole: "Programmes & Impact",
    date: "2024-06-15",
    readTime: 6,
    image:
      "/images/blob/peertopeer.jpg",
    tags: ["Community Health", "Nigeria", "Women", "Lagos", "Programme Impact"],
  },

  // ── THOUGHT LEADERSHIP ────────────────────────────────────────────────────
  {
    slug: "nigeria-primary-healthcare-reform",
    title: "Nigeria's Primary Healthcare System: What Reform Must Look Like",
    excerpt:
      "Nigeria's primary healthcare centres are the first line of defence for 200 million people — yet most are under-staffed, under-supplied, and under-trusted. Meaningful reform is not optional. It is the difference between life and death for millions of women and children.",
    content: `
In 1987, Nigeria launched the Primary Health Care Under One Roof policy — an ambitious framework designed to bring basic healthcare to every ward and village in the country. Thirty-seven years later, the aspiration has not been matched by the reality. An estimated 30,000 primary health centres (PHCs) exist on paper across Nigeria's 774 local government areas. In practice, surveys consistently find that fewer than one in five meets the minimum standards for staffing, essential medicines, and functional equipment.

For the women and children who depend on these facilities, the consequences are deadly.

## What the Data Tells Us

A 2023 assessment by the National Primary Health Care Development Agency (NPHCDA) found that across many states:

- Fewer than 40% of PHCs had a functioning delivery room
- Only 26% had oxytocin — the essential drug for preventing and treating postpartum haemorrhage
- Health worker absenteeism rates exceeded 40% in multiple states
- Fewer than 35% had reliable electricity or a functioning solar backup system

These are not statistics about extreme poverty or conflict zones alone. They describe facilities in Ogun, Oyo, and Delta States — states with relatively developed economies and proximity to urban centres.

## The Root Causes

Under-performance of PHCs in Nigeria has multiple, interlocking causes.

**Governance fragmentation** is a central problem. PHCs fall under local government authorities, state health ministries, and federal agencies — with funding and accountability responsibilities that often overlap and create gaps. When things go wrong, there is no single accountable party.

**Chronic underfunding** persists despite repeated commitments. Nigeria's health sector consistently receives well below the 15% of the national budget recommended by the Abuja Declaration — a commitment Nigeria itself signed in 2001. In years of fiscal pressure, health budgets are among the first to be cut.

**The human resource crisis** cannot be overstated. Nigeria produces thousands of doctors, nurses, and midwives every year — and loses a significant proportion of them to emigration within years of graduation. The United Kingdom now has more Nigerian-trained doctors working in its National Health Service than Nigeria has in some of its states.

**Community trust** has eroded in many places. Women who have had bad experiences at PHCs — rude staff, empty drug shelves, illegal fees for nominally free services — stop attending. And once trust is lost, it is hard to rebuild.

## What Meaningful Reform Requires

Reform of Nigeria's PHC system is not a technical problem — it is a political one. The technical solutions are largely known. What is needed is sustained political will, consistent funding, and genuine accountability to the communities these facilities are supposed to serve.

Specifically, reform must address:

- **Direct funding to facility level**, bypassing the governance gaps that allow money to disappear between federal allocation and local delivery
- **Performance-based contracts** for health workers, with transparent accountability mechanisms
- **Community health committees** with real oversight powers over local facilities, not advisory roles that are easily ignored
- **Emergency obstetric care** as a non-negotiable standard for all facilities that offer delivery services

Civil society organisations, community advocates, and the women most affected by PHC failures must be at the centre of accountability efforts — not at the margins of policy consultations.

Nigeria cannot achieve its health development goals on the back of a broken primary healthcare system. The cost of inaction is already being paid, every day, by Nigerian women and children who deserve better.
    `,
    category: "Thought Leadership",
    author: "Prof. Adenike Grange",
    authorRole: "Founder, AdeGrange Child Foundation",
    date: "2024-10-05",
    readTime: 8,
    image:
      "/images/blob/primaryhealth.jpg",
    tags: ["Nigeria", "Healthcare Reform", "Policy", "Public Health", "PHC"],
  },

  {
    slug: "girl-child-education-west-africa",
    title: "The Girl Child Education Gap in West Africa: Health, Power, and the Fight for Every Classroom Seat",
    excerpt:
      "In West Africa, a girl's access to education is one of the strongest predictors of her children's survival. Yet millions of girls remain out of school. The reasons are complex — and so must be the solutions.",
    content: `
There is perhaps no intervention in development that delivers broader health and social returns than educating girls. Educated women are more likely to seek antenatal care, deliver in health facilities, space their pregnancies, immunise their children, and recognise danger signs in illness. They earn more, invest more in their families, and are better positioned to resist early marriage.

In West Africa — where girls' educational outcomes remain among the lowest in the world — closing the gender gap in education is not just an equity issue. It is a public health imperative.

## The Scale of the Challenge

UNICEF estimates that more than 9 million girls of primary school age are out of school in West and Central Africa — more than in any other region in the world. In Nigeria, more than 3 million girls are currently not in school. In Niger — West Africa's northern neighbour — only 35% of girls complete primary education.

The consequences ripple through every health indicator. In communities with low female literacy, maternal mortality rates are consistently higher. Adolescent pregnancy rates — which carry serious health risks for both mother and child — are closely correlated with whether girls stay in secondary school.

## Why Girls in West Africa Leave School

The reasons girls leave school in West Africa are neither simple nor uniform. They vary by geography, religion, economic status, and community norms — which is why blanket policy solutions often fail.

**Economic barriers** are among the most direct. School fees, the cost of uniforms, and the opportunity cost of keeping a daughter in school rather than contributing to household labour or income are real constraints for poor families — especially when the perceived returns to girls' education are low.

**Early and forced marriage** removes millions of girls from school across the Sahel and northern Nigeria, where child marriage rates remain among the highest in the world. Once married, girls are rarely able to return to education.

**Safety and distance** matter more for girls than for boys. Walking several kilometres to school on unsafe roads is a risk families are often unwilling to take with daughters. In communities without secondary schools, girls frequently stop at primary level because boarding away from home is not considered appropriate for girls.

**Menstrual health** is an underappreciated barrier. In schools without private toilets, running water, or access to sanitary products, menstruation causes absenteeism that accumulates into dropout. This is directly addressable — and yet rarely addressed.

**Quality matters too.** In contexts where teachers routinely miss school, where girls face harassment from male peers or teachers, and where curriculum is disconnected from girls' lives, enrolment alone is not enough.

## What Works

The evidence base on girls' education interventions in West Africa has grown substantially in the past decade. Approaches with strong evidence include:

- **Conditional and unconditional cash transfers** to families that keep daughters in school
- **School-based sanitation upgrades** — private toilets, handwashing stations, and the provision of sanitary products
- **Community engagement** to shift norms around girls' education, particularly involving religious leaders and traditional rulers
- **Mentorship and girls' clubs** that provide safe spaces within schools
- **Addressing teacher conduct** through stronger accountability mechanisms and female teacher recruitment in girl-heavy schools

At AdeGrange Child Foundation, we have seen directly how health education in schools creates safer environments for girls. When a girl understands her body, has a trusted adult she can speak to at school, and attends a facility that does not shame her for menstruating, she is more likely to stay.

The classroom is one of the most powerful health interventions we have. The fight to keep every girl in one is worth everything.
    `,
    category: "Thought Leadership",
    author: "Prof. Adenike Grange",
    authorRole: "Founder, AdeGrange Child Foundation",
    date: "2024-05-12",
    readTime: 8,
    image:
      "/images/blob/Girlseducation.jpg",
    tags: ["Education", "Girls", "West Africa", "Nigeria", "Women", "Policy"],
  },
]

export const categories: BlogCategory[] = [
  "Health & Tips",
  "Program Stories",
  "Thought Leadership",
]

// ── Monthly hero images — West Africa / Nigeria focused ───────────────────────
// One image per month (index 0 = January … 11 = December).
// The featured hero on /blog rotates through these automatically each month.
export const monthlyHeroImages: string[] = [
  // Jan – children at a community health outreach in West Africa
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200",
  // Feb – mother and newborn, maternity care
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200",
  // Mar – female healthcare worker in Africa
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200",
  // Apr – girls in school, West Africa
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200",
  // May – community health workers gathering
  "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1200",
  // Jun – children learning together
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200",
  // Jul – mother feeding child, nutrition focus
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200",
  // Aug – rural health clinic visit
  "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200",
  // Sep – women's community group discussion
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200",
  // Oct – children playing, community life
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200",
  // Nov – healthcare data / public health planning
  "https://images.unsplash.com/photo-1631217869277-4bac4fcac8fa?q=80&w=1200",
  // Dec – end of year reflection, community celebration
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200",
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        (p.category === post.category ||
          p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, count)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
