// frontend/src/lib/dummyData.js
// ALL dummy data lives here. Never hardcode data in components.

export const DUMMY_REPORT = {
  id: 'rpt_001',
  createdAt: '2026-06-01',
  startup: {
    name: 'NestMate',
    idea: 'AI-powered roommate matching for college students in India',
    market: 'College students aged 18-24 in Tier 1 and Tier 2 Indian cities',
    model: 'Freemium SaaS — free matching, premium for verified profiles',
    stage: 'Idea',
  },
  overallRisk: 72,   // 0-100, higher = more risky
  personas: [
    {
      id: 'vc',
      name: 'Venture Capitalist',
      icon: '💼',
      risks: [
        { title: 'Market size is capped', severity: 'HIGH',
          description: 'Indian college accommodation market is fragmented and hyperlocal. CAC will be high per institution. Trulia and Zillow both failed at hyperlocal matching before pivoting.',
          mitigation: 'Start with a single campus. Prove retention before expanding.' },
        { title: 'No network effect at launch', severity: 'HIGH',
          description: 'Matching apps require density on both sides simultaneously. Most fail the cold-start problem.',
          mitigation: 'Launch one side first — landlords. Build supply before demand.' },
      ]
    },
    {
      id: 'competitor',
      name: 'Competitor CEO',
      icon: '🎯',
      risks: [
        { title: 'NoBroker can clone this in 2 weeks', severity: 'CRITICAL',
          description: 'NoBroker has 10M+ users, brand trust, and an existing roommate section. They can add AI matching as a feature at zero marginal cost.',
          mitigation: 'Go hyperlocal faster than they can prioritize. Own one campus so deeply they cannot catch up.' },
      ]
    },
    {
      id: 'customer',
      name: 'Potential Customer',
      icon: '🧑‍🎓',
      risks: [
        { title: 'WhatsApp groups already solve this', severity: 'HIGH',
          description: 'Every college has a WhatsApp group for accommodation. It is free, trusted, and already used. Your solution needs to be 10x better, not marginally better.',
          mitigation: 'Add the verification layer WhatsApp cannot — ID-verified profiles with university email authentication.' },
      ]
    },
  ],
  challengerPath: {
    successRate: '8%',
    whatWorked: [
      'Started with one campus and achieved 40%+ student penetration before expanding',
      'Partnered with college admin for official endorsement — instant trust signal',
      'Monetized the landlord side, kept student side permanently free',
    ]
  }
};

export const DUMMY_USER = {
  id: 'usr_001',
  name: 'Alankrit',
  email: 'alankrit@example.com',
  plan: 'free',
  reportsUsed: 1,
  reportsLimit: 1,
};

export const DUMMY_REPORTS_LIST = [
  { id: 'rpt_001', startupName: 'NestMate', overallRisk: 72, createdAt: '2026-06-01', status: 'complete' },
  { id: 'rpt_002', startupName: 'MediTrack', overallRisk: 58, createdAt: '2026-05-28', status: 'complete' },
];
