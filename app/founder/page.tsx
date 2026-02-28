import Image from "next/image"

export default function FounderPage() {
  return (
    <div className="min-h-screen py-24 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professor Adenike Grange
          </h1>

          <p className="text-pink-600 font-semibold text-lg">
            Founder & President, AdeGrange Child Foundation
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Image Section */}
          <div className="relative w-full max-w-md mx-auto md:mx-0">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/founder.jpg"
                alt="Professor Adenike Grange"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Biography Section */}
          <div className="space-y-6 leading-relaxed">

            <p>
              Professor Adenike Grange is a distinguished paediatrician,
              public health leader, and former Minister of Health of the
              Federal Republic of Nigeria. With over four decades of
              dedicated service in paediatrics and health systems
              strengthening, she has shaped medical education and public
              health policy both nationally and globally.
            </p>

            <p>
              A graduate of St. Andrews University, Scotland, Professor
              Grange rose through academic leadership to become Professor
              of Paediatrics at the College of Medicine, University of
              Lagos, where she served as Head of Department, Director of
              the Institute of Child Health and Primary Health Care, and
              Dean of the School of Clinical Sciences.
            </p>

            <p>
              Her global impact includes consultancy roles with WHO,
              UNICEF, and USAID, and representation on the Board of the
              Global Alliance for Vaccines and Immunisation (GAVI).
              She has authored over sixty peer-reviewed publications in
              paediatrics and public health.
            </p>

            <p>
              As Nigeria’s first female Minister of Health (2007–2008),
              she championed critical reforms including the establishment
              of the Nigeria Centre for Disease Control, strengthening
              primary health care funding, and advancing maternal and
              child health systems nationwide.
            </p>

            <p>
              Today, as Founder of the AdeGrange Child Foundation,
              Professor Grange continues her lifelong mission of empowering
              women, children, and youth, ensuring sustainable improvements
              in child survival, development, and protection across Africa.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}