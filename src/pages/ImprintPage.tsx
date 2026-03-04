export function ImprintPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-20 pt-32 lg:px-0">
        {/* Header */}
        <header className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Imprint
          </h1>
          <p className="text-lg text-slate-600">
            Legal information and disclaimers in accordance with § 5 DDG
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          {/* Publisher */}
          <Section title="Publisher">
            <p className="font-medium">
              Technical University of Munich (Technische Universität München)
            </p>
            <address className="mt-2 not-italic text-slate-600">
              Arcisstrasse 21
              <br />
              80333 Munich, Germany
            </address>
            <div className="mt-4 space-y-1 text-slate-600">
              <p>
                <span className="font-medium text-slate-700">Phone:</span>{' '}
                +49-(0)89-289-01
              </p>
              <p>
                <span className="font-medium text-slate-700">Fax:</span>{' '}
                +49-(0)89-289-22000
              </p>
              <p>
                <span className="font-medium text-slate-700">Email:</span>{' '}
                <a
                  href="mailto:poststelle@tum.de"
                  className="text-[#0a4da2] hover:underline"
                >
                  poststelle(at)tum.de
                </a>
              </p>
            </div>
          </Section>

          {/* Authorized Representative */}
          <Section title="Authorized Representative">
            <p className="text-slate-600">
              The Technical University of Munich is a public corporation
              (Körperschaft des öffentlichen Rechts) and a state institution
              (staatliche Einrichtung) pursuant to Art. 4(1) BayHIG. It is
              legally represented by its President,{' '}
              <span className="font-medium text-slate-700">
                Prof. Dr. Thomas F. Hofmann
              </span>
              .
            </p>
          </Section>

          {/* Regulatory Authority */}
          <Section title="Regulatory Authority">
            <p className="text-slate-600">
              Bayerisches Staatsministerium für Wissenschaft und Kunst (Bavarian
              State Ministry of Science and the Arts)
            </p>
          </Section>

          {/* VAT Identification Number */}
          <Section title="VAT Identification Number">
            <p className="text-slate-600">
              DE811193231 (in accordance with § 27a UStG)
            </p>
          </Section>

          {/* Responsible for Content */}
          <Section title="Responsible for Content">
            <p className="text-slate-600">
              Responsible for the content of this platform in accordance with §
              18(2) MStV:
            </p>
            <div className="mt-4">
              <p className="font-medium text-slate-700">
                Prof. Dr. Stephan Krusche
              </p>
              <p className="mt-1 text-slate-600">
                Applied Education Technologies (AET)
              </p>
              <p className="text-slate-600">
                TUM School of Computation, Information and Technology
              </p>
              <p className="text-slate-600">Department of Computer Science</p>
              <address className="mt-2 not-italic text-slate-600">
                Boltzmannstrasse 3
                <br />
                85748 Garching bei München, Germany
              </address>
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <p className="text-slate-600">
              For questions or concerns regarding the Memo platform, please
              contact:
            </p>
            <p className="mt-2">
              <span className="font-medium text-slate-700">Email:</span>{' '}
              <a
                href="mailto:ls1.admin@in.tum.de"
                className="text-[#0a4da2] hover:underline"
              >
                ls1.admin@in.tum.de
              </a>
            </p>
          </Section>

          {/* Terms of Use */}
          <Section title="Terms of Use">
            <p className="text-slate-600">
              Texts, images, graphics, as well as the design of these internet
              pages may be subject to copyright. The following are not protected
              by copyright according to § 5 of the German Copyright Act
              (Urheberrechtsgesetz – UrhG):
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              <li>
                Laws, ordinances, official decrees and announcements, as well as
                decisions and officially written guidelines for decisions.
              </li>
              <li>
                Other official works that have been published in the official
                interest for general knowledge, with the restriction that the
                provisions on prohibition of modification and indication of
                source in § 62(1) to (3) and § 63(1) and (2) UrhG apply
                accordingly.
              </li>
            </ul>
            <p className="mt-4 text-slate-600">
              As a private individual, you may use copyrighted material for
              private and other personal use within the scope of § 53 UrhG. Any
              duplication or use of objects such as images, diagrams, sounds, or
              texts in other electronic or printed publications is not permitted
              without our agreement.
            </p>
          </Section>

          {/* Liability Disclaimer */}
          <Section title="Liability Disclaimer">
            <p className="text-slate-600">
              The information provided on this platform has been collected and
              verified to the best of our knowledge and belief. However, no
              warranty is given that the information provided is up to date,
              correct, complete, or available. No contractual relationship with
              users of this platform is established through its use.
            </p>
            <p className="mt-4 text-slate-600">
              We accept no liability for any loss or damage caused by using this
              platform. The exclusion of liability does not apply where the
              provisions of § 839 BGB (German Civil Code – liability in case of
              breach of official duty) are applicable.
            </p>
            <p className="mt-4 text-slate-600">
              We accept no liability for any loss or damage caused by malware
              when accessing or downloading data, or the installation or use of
              software from this platform.
            </p>
            <p className="mt-4 text-slate-600">
              Where necessary in individual cases: the exclusion of liability
              does not apply to information governed by Directive 2006/123/EC of
              the European Parliament and of the Council (EU Services
              Directive). This information is guaranteed to be accurate and up
              to date.
            </p>
          </Section>

          {/* Links */}
          <Section title="External Links">
            <p className="text-slate-600">
              Our own content is to be distinguished from cross-references
              ("links") to websites of other providers. These links only provide
              access for using third-party content in accordance with § 8 of the
              German Telemedia Act (TMG).
            </p>
            <p className="mt-4 text-slate-600">
              Prior to providing links to other websites, we review third-party
              content for potential civil or criminal liability. However, a
              continuous review of third-party content for changes is not
              possible, and therefore we cannot accept any responsibility. For
              illegal, incorrect, or incomplete content, including any damage
              arising from the use or non-use of third-party information,
              liability rests solely with the provider of the website.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
