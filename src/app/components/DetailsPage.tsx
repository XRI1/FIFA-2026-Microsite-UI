import { Link } from 'react-router';
import lgLogo from '../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png';
import { FlaticonIcon } from "./FlaticonIcon";

export function DetailsPage() {
  return (
    <div className="premium-page min-h-screen">
      {/* Header */}
      <div className="fifa-broadcast-header text-white px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0">
            <FlaticonIcon name="arrow-left" className="w-5 h-5" />
          </Link>
          <img src={lgLogo} alt="LG" className="h-7 w-auto bg-white px-2 py-1 rounded-md" />
          <h1 className="font-black text-lg tracking-wide">Campaign Info</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 space-y-12">

        {/* DETAILS SECTION */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">DETAILS SECTION</h2>
            <p className="text-gray-500 text-sm md:text-base">
              About the campaign, official products, terms & partner info  the credibility footer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* About the Campaign */}
            <div className="premium-panel-soft rounded-2xl border border-lg-red/15 p-5 md:p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-lg-red/10 border border-lg-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FlaticonIcon name="goal" className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-black text-lg">About the Campaign</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'LG Super Fan is a fan engagement platform tied to the 2026 Football Tournament',
                  'Runs mid-June to late July 2026 across Bangladesh',
                  'Fans pick a national team, complete digital missions, and earn points weekly',
                  'Campaign hosted on dedicated microsite, promoted via LG social & retail channels',
                  "Part of LG's broader 'Life's Good' brand strategy for 2026",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-lg-red mt-1.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Prizes & Products */}
            <div className="premium-panel-soft rounded-2xl border border-lg-red/15 p-5 md:p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-lg-red/10 border border-lg-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FlaticonIcon name="medal" className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-black text-lg">Official Prizes & Products</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Weekly winners announced on 'Winners Hall' page every Monday",
                  'Prizes: LG Smart TV 32", LG Wireless Earbuds, LG Portable Speaker, LG SoundBar',
                  'All products are authentic LG Bangladesh authorized products',
                  "Prize delivery within 7 working days to winner's registered address",
                  'LG reserves right to substitute prizes of equal or higher value',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-lg-red mt-1.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms & Eligibility */}
            <div className="premium-panel-soft rounded-2xl border border-lg-red/15 p-5 md:p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-lg-red/10 border border-lg-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FlaticonIcon name="scale" className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-black text-lg">Terms & Eligibility</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Open to Bangladesh residents aged 18 and above',
                  'One account per person  verified by mobile number',
                  'Point manipulation or bot activity results in permanent disqualification',
                  "LG Bangladesh's decision on all matters is final and binding",
                  'Full terms available at lg.com/bd/superfan-terms',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-lg-red mt-1.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Fair Play Policy */}
        <section>
          <div className="premium-panel fifa-match-panel rounded-3xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-lg-red rounded-xl flex items-center justify-center flex-shrink-0">
                <FlaticonIcon name="scale" className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Fair Play Policy (T&C)</h2>
            </div>
            <ol className="space-y-5">
              {[
                'By participating in the LG Super Fan League, users agree to abide by the official campaign rules, timeline restrictions, and prize verification processes detailed below.',
                'Participation is open to legal residents of Bangladesh, who are 18 years or older at the time of entry. Employees of LG, its advertising agencies, and immediate family members are not eligible to win the grand prizes.',
                'Each participant is allowed only one registered account. The use of automated scripts, bots, multiple accounts, or any form of manipulation to gain an unfair advantage will result in immediate disqualification and forfeiture of all accumulated points.',
                'Points are awarded based on the correct submission of answers within designated time frames. While the leaderboard updates dynamically, the final standings will undergo a thorough data audit at the end of the campaign to verify legitimate point accumulation.',
                'Bonus points for LG product purchases are strictly subject to verification. Participants must upload a clear copy of the official retail invoice. Only authentic products purchased from authorized LG brand shops or licensed retail partners during the campaign period are eligible. Parallel imports or gray market items will be rejected.',
                'LG reserves the absolute right to take any final action regarding winner selection, campaign submissions, point adjustments, and overall eligibility at any point during or after the campaign period. All decisions made by LG concerning the campaign mechanics, disputed points, and prize allocations are final, binding, and not subject to appeal.',
                "Prizes will be fulfilled strictly according to the distribution and delivery process designated by LG. At LG's sole discretion, winners may be required to personally visit an authorized brand showroom, corporate headquarters, or a designated collection hub to verify their identity and physically collect their prize. Any travel or logistical expenses incurred during collection are the sole responsibility of the winner.",
              ].map((clause, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-lg-red text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">{clause}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Back link */}
        <div className="text-center pb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-lg-red font-bold hover:underline">
            <FlaticonIcon name="arrow-left" className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
