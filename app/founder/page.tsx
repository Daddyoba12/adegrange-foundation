import Image from "next/image"

export default function FounderPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 founder-page">

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">

        {/* ================= HERO ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">

          {/* Portrait */}
          <div className="relative w-full max-w-sm mx-auto lg:max-w-none aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/founder.jpg"
              alt="Professor Adenike Grange"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Identity block */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <p className="uppercase tracking-[0.25em] text-xs font-semibold text-pink-600 mb-4">
                Founder &amp; President
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight founder-heading">
                Professor Adenike Grange
              </h1>
              <p className="mt-3 text-sm sm:text-base font-medium founder-muted">
                MBChB; DCH; FMCPAED; FWACP; FAAP
              </p>
              <div className="w-16 h-0.5 bg-pink-600 mt-6"></div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed founder-body">
              Distinguished paediatrician, medical educator, and former Minister of
              Health of the Federal Republic of Nigeria — with over four decades of
              leadership in clinical medicine, academic reform, and national health
              governance.
            </p>
          </div>
        </section>

        {/* ================= LEGACY ================= */}
        <section className="max-w-4xl space-y-5 sm:space-y-7">
          <h2 className="text-2xl sm:text-3xl font-semibold founder-heading">
            Legacy of Leadership
          </h2>
          <p className="text-base sm:text-lg leading-relaxed founder-body">
            Born into the distinguished lineage of Pharmacist Robert Adebowale of
            Commercial Medicine Stores, Lagos, Professor Grange's foundation in
            healthcare and service was established early in life. She received her
            education in Lagos and England before graduating from the University of
            St Andrews, Scotland in 1964.
          </p>
          <p className="text-base sm:text-lg leading-relaxed founder-body">
            Over three decades, she advanced through postgraduate training and global
            professional development while mentoring generations of medical students,
            residents, nurses, and allied healthcare professionals.
          </p>
        </section>

        {/* ================= ACADEMIC & GLOBAL ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-20">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold founder-heading">
              Academic &amp; Institutional Leadership
            </h2>
            <p className="text-sm sm:text-base leading-relaxed founder-body">
              In 1995, she attained the position of Professor of Paediatrics at the
              College of Medicine, University of Lagos. Her institutional roles
              included Head of Department of Paediatrics, Director of the Institute
              of Child Health and Primary Health Care, and Dean of the School of
              Clinical Sciences.
            </p>
            <p className="text-sm sm:text-base leading-relaxed founder-body">
              She authored over sixty peer-reviewed publications and served as
              consultant to the World Health Organization (WHO), UNICEF, and USAID.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold founder-heading">
              Global Health Engagement
            </h2>
            <p className="text-sm sm:text-base leading-relaxed founder-body">
              Professor Grange actively participated in the Union of National
              Paediatric Societies and Associations (UNAPSA) and the International
              Paediatric Association (IPA), fostering collaboration among healthcare
              leaders across more than thirty countries.
            </p>
            <p className="text-sm sm:text-base leading-relaxed founder-body">
              From 2002 to 2004, she represented Civil Society on the Board of the
              Global Alliance for Vaccines and Immunisation (GAVI), contributing to
              global immunisation strategy and policy discourse.
            </p>
          </div>
        </section>

        {/* ================= NATIONAL LEADERSHIP ================= */}
        <section className="max-w-5xl space-y-5 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-semibold founder-heading">
            Ministerial &amp; National Health Reform
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed founder-body">
            In 2007, Professor Grange made history as Nigeria's first female
            Minister of Health. During her tenure, she championed structural
            reforms including the creation of the Department of Family Health,
            strengthened proposals for Primary Health Care funding, mobilisation
            of retired nurse-midwives to return to service, and foundational work
            toward establishing the Nigeria Centre for Disease Control.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed founder-body">
            Her reform-oriented approach emphasised health systems strengthening
            and improved collaboration between Federal and State Ministries of
            Health to address constitutional gaps in healthcare delivery.
          </p>
        </section>

        {/* ================= CONTINUING IMPACT ================= */}
        <section className="max-w-5xl space-y-5 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-semibold founder-heading">
            Continuing Vision &amp; Institutional Stewardship
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed founder-body">
            Following public service, she served as Provost and Chief Medical
            Director of the Otunba Tunwase Paediatric Centre in Ijebu-Ode,
            achieving measurable institutional growth before its transition to
            university management.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed founder-body">
            She remains a strong advocate for Universal Health Coverage and
            currently serves as Chairperson of the Board of Trustees of the
            Nigeria Universal Health Coverage Actions Network (NUHCAN).
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed founder-body">
            As Founder of AdeGrange Child Foundation, she continues her lifelong
            mission of empowering women, children, and youth — ensuring sustainable
            improvement in child survival, development, and protection.
          </p>
        </section>

        {/* ================= CLOSING QUOTE ================= */}
        <section className="border-t founder-border pt-10 sm:pt-14">
          <blockquote className="max-w-3xl mx-auto text-center">
            <span className="text-4xl text-pink-600 leading-none">&ldquo;</span>
            <p className="text-lg sm:text-xl md:text-2xl italic font-medium founder-quote leading-relaxed mt-2">
              The health of a nation begins with the health of its mothers and children.
            </p>
            <span className="text-4xl text-pink-600 leading-none">&rdquo;</span>
            <footer className="mt-4 text-sm founder-muted">
              &mdash; Professor Adenike Grange
            </footer>
          </blockquote>
        </section>

      </div>
    </div>
  )
}
