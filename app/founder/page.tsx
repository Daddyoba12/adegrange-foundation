import Image from "next/image"

export default function FounderPage() {
  return (
    <div className="min-h-screen py-32 px-6">

      <div className="max-w-6xl mx-auto space-y-28">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Portrait */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/founder.jpg"
              alt="Professor Adenike Grange"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Identity Block */}
          <div className="space-y-8">

            <div>
              <p className="uppercase tracking-[0.3em] text-xs opacity-60 mb-6">
                Founder & President
              </p>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Professor Adenike Grange
              </h1>

              <p className="mt-4 text-lg opacity-70">
                MBChB; DCH; FMCPAED; FWACP; FAAP
              </p>

              <div className="w-24 h-[2px] bg-black/30 mt-8"></div>
            </div>

            <p className="text-xl leading-relaxed opacity-80">
              Distinguished paediatrician, medical educator, and former Minister of Health of the Federal Republic of Nigeria — with over four decades of leadership in clinical medicine, academic reform, and national health governance.
            </p>

          </div>
        </section>

        {/* EXECUTIVE STATEMENT */}
        <section className="max-w-4xl space-y-8">
          <h2 className="text-3xl font-semibold">
            Legacy of Leadership
          </h2>

          <p className="text-lg leading-relaxed">
            Born into the distinguished lineage of Pharmacist Robert Adebowale of Commercial Medicine Stores, Lagos, Professor Grange’s foundation in healthcare and service was established early in life. She received her education in Lagos and England before graduating from the University of St Andrews, Scotland in 1964.
          </p>

          <p className="text-lg leading-relaxed">
            Over three decades, she advanced through postgraduate training and global professional development while mentoring generations of medical students, residents, nurses, and allied healthcare professionals.
          </p>
        </section>

        {/* ACADEMIC & GLOBAL ENGAGEMENT */}
        <section className="grid lg:grid-cols-2 gap-20">

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              Academic & Institutional Leadership
            </h2>

            <p className="leading-relaxed">
              In 1995, she attained the position of Professor of Paediatrics at the College of Medicine, University of Lagos. Her institutional roles included Head of Department of Paediatrics, Director of the Institute of Child Health and Primary Health Care, and Dean of the School of Clinical Sciences.
            </p>

            <p className="leading-relaxed">
              She authored over sixty peer-reviewed publications and served as consultant to the World Health Organization (WHO), UNICEF, and USAID.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              Global Health Engagement
            </h2>

            <p className="leading-relaxed">
              Professor Grange actively participated in the Union of National Paediatric Societies and Associations (UNAPSA) and the International Paediatric Association (IPA), fostering collaboration among healthcare leaders across more than thirty countries.
            </p>

            <p className="leading-relaxed">
              From 2002 to 2004, she represented Civil Society on the Board of the Global Alliance for Vaccines and Immunisation (GAVI), contributing to global immunisation strategy and policy discourse.
            </p>
          </div>
        </section>

        {/* NATIONAL LEADERSHIP */}
        <section className="max-w-5xl space-y-10">

          <h2 className="text-3xl font-semibold">
            Ministerial & National Health Reform
          </h2>

          <p className="leading-relaxed text-lg">
            In 2007, Professor Grange made history as Nigeria’s first female Minister of Health. During her tenure, she championed structural reforms including the creation of the Department of Family Health, strengthened proposals for Primary Health Care funding, mobilization of retired nurse-midwives to return to service, and foundational work toward establishing the Nigeria Centre for Disease Control.
          </p>

          <p className="leading-relaxed text-lg">
            Her reform-oriented approach emphasized health systems strengthening and improved collaboration between Federal and State Ministries of Health to address constitutional gaps in healthcare delivery.
          </p>

        </section>

        {/* CONTINUING IMPACT */}
        <section className="max-w-5xl space-y-10">

          <h2 className="text-3xl font-semibold">
            Continuing Vision & Institutional Stewardship
          </h2>

          <p className="leading-relaxed text-lg">
            Following public service, she served as Provost and Chief Medical Director of the Otunba Tunwase Paediatric Centre in Ijebu-Ode, achieving measurable institutional growth before its transition to university management.
          </p>

          <p className="leading-relaxed text-lg">
            She remains a strong advocate for Universal Health Coverage and currently serves as Chairperson of the Board of Trustees of the Nigeria Universal Health Coverage Actions Network (NUHCAN).
          </p>

          <p className="leading-relaxed text-lg">
            As Founder of AdeGrange Child Foundation, she continues her lifelong mission of empowering women, children, and youth — ensuring sustainable improvement in child survival, development, and protection.
          </p>

        </section>

      </div>

    </div>
  )
}