import AElf from 'aelf-sdk';

export const EBRIDGE_DISCLAIMER_ARRAY: { type: 'title' | 'text'; content: string }[] = [
  {
    type: 'text',
    content:
      'Please consider the following risk factors (many of which are specific and inherent to cryptographic tokens) before using any part of our Wallet/website/platform and before purchasing and/or trading ELF cryptographic tokens or any other cryptographic token which we (or any third-party service provider accessed through Portkey) may offer through our Wallet/website/platform from time to time (“ tokens”). The value of the tokens as well as your ability to access and transfer the tokens could be materially and adversely affected if any of these risk factors materialize.',
  },
  {
    type: 'text',
    content:
      'Please also note that this Risk Disclaimer is not exhaustive. You should carry out further research (and seek professional advice) to carefully determine whether purchasing and/or trading tokens is suitable for your particular financial situation and risk tolerance.',
  },
  {
    type: 'text',
    content:
      'Subject to any provision to the contrary set out in this disclaimer or our terms of Services, Portkey shall not be liable for any loss incurred by you resulting from your access to our platform or from your purchase, transfer or use of tokens.',
  },

  {
    type: 'text',
    content:
      'Tokens are high-risk assets and you should never use funds that you cannot afford to lose to purchase tokens. ',
  },
  {
    type: 'title',
    content: '1.1 Price volatility ',
  },
  {
    type: 'text',
    content:
      'The price of tokens can be subject to dramatic fluctuations and high volatility due to the rapid shifts in offer and demand resulting from events such as but not limited to: (a) good or bad publicity, (b) changes in the financial technology industry, (c) technological advancement, (d) market trends, (e) general economic and/or political conditions, (f) degree of adoption, (g) degree of institutional support, (h) regulatory measures, (i) degree of government support, (l) market dynamics, (m) trading activities, (n) hacking, and (o) events affecting large service providers, including exchanges.',
  },
  {
    type: 'text',
    content:
      'AS A RESULT OF PRICE VOLATILITY, YOUR TOKENS MAY LOSE ALL VALUE AND BECOME WORTHLESS. PORTKEY SHALL NOT BE RESPONSIBLE FOR ANY LOSS INCURRED BY YOU AS A RESULT OF THE INHERENT PRICE-VOLATILITY OF TOKENS.',
  },
  {
    type: 'title',
    content: '1.2 Protocols ',
  },

  {
    type: 'text',
    content:
      'Tokens are recorded on distributed ledgers (typically shared across networks of users) which are governed by, subject to, and distinguished on the basis of certain set of rules and/or smart contracts known as protocols.',
  },
  {
    type: 'text',
    content: '• Malfunction, breakdown and/or abandonment of protocols',
  },
  {
    type: 'text',
    content:
      'Any malfunction, breakdown, and/or abandonment of the protocols (and of any consensus mechanism, where applicable) on which the tokens are based could severely affect the price of the tokens as well as your ability to dispose of them (particularly where the protocol relies on substantial participation and wide networks to operate properly).',
  },
  {
    type: 'text',
    content: '• Validator attacks',
  },
  {
    type: 'text',
    content:
      'Some protocols integrate consensus-based mechanisms for the validation of transfers (“Consensus Protocols”). Consensus Protocols are, therefore, susceptible to attacks at the stage of validation, where token transactions are approved by the network. This may affect the accuracy of transactions and in your tokens being misappropriated (for example, through what is typically referred to as double spending attacks).',
  },
  {
    type: 'text',
    content: '• Hacking and security weaknesses',
  },
  {
    type: 'text',
    content:
      'Tokens may be subject to expropriation and/or theft. Bad actors (including hackers, groups and organizations) may attempt to interfere with the protocols or the tokens in a variety of ways, including, but not limited to, malware attacks, denial of service attacks, consensus-based attacks, sybil attacks, smurfing and spoofing.',
  },
  {
    type: 'text',
    content:
      'Furthermore, some protocols are based on open-source software and, as a result, subject to the risk of weakness being introduced to the protocols (either willingly or accidentally) at the development stage. Any such weakness may be exploited by bad actors for the purposes of misappropriating your tokens, or otherwise affecting the functionality of the protocol and of your ability to dispose of your tokens.',
  },
  {
    type: 'text',
    content:
      'PORTKEY DOES NOT HAVE CONTROL OVER THE PROTOCOLS. AS SUCH, PORTKEY SHALL NOT BE RESPONSIBLE FOR ANY LOSS ARISING OUT OF OR IN CONNECTION WITH THE PROTOCOLS.',
  },
  {
    type: 'title',
    content: '1.3 Laws and regulations',
  },
  {
    type: 'text',
    content:
      'The legal and/or regulatory framework surrounding tokens and distributed ledger technology is uncertain, not harmonized, and unsettled in many jurisdictions.',
  },
  {
    type: 'text',
    content:
      'It is difficult to predict what framework will become applicable to tokens in the near future and how the implementation of dedicated legal and/or regulatory frameworks will affect the price of tokens. A newly introduced legal and regulatory framework may interfere with or otherwise limit your ability to hold or dispose of your tokens, which in turn could result in a financial loss on your part.',
  },
  {
    type: 'text',
    content:
      'PORTKEY IS NOT RESPONSIBLE FOR ANY LOSS WHICH YOU MAY SUFFER AS A RESULT OF ANY NEWLY INTRODUCED LEGAL AND/OR REGULATORY FRAMEWORK.',
  },
  {
    type: 'title',
    content: '1.4 Taxation',
  },
  {
    type: 'text',
    content:
      'The tax characterization of tokens is complex and largely uncertain. The uncertainty in the tax treatment of tokens may expose you to unforeseen future tax consequences associated with purchasing, owning, selling or otherwise using tokens. You should seek tax advice to understand what tax obligations apply to you when purchasing, holding, transferring, and utilizing tokens. Failure to comply with your tax obligations could result in severe fines and even jail time.',
  },
  {
    type: 'text',
    content:
      'PORTKEY IS NOT RESPONSIBLE FOR ANY LOSS OR OTHER FORM OF LIABILITY ARISING OUT OF OR IN CONNECTION WITH YOUR FAILURE TO COMPLY WITH ANY TAX LIABILITY THAT IS OR WILL BE APPLICABLE TO YOU.',
  },
  {
    type: 'title',
    content: '1.5 Unanticipated risks',
  },
  {
    type: 'text',
    content:
      'In addition to the risks included in this Agreement, there are other risks associated with your purchase, holding, trading, and use of tokens, some of which Portkey cannot anticipate. Such risks may further materialize as unanticipated variations or combinations of the risks discussed in this section.',
  },
  {
    type: 'text',
    content:
      'THIS RISK DISCLAIMER IS NOT EXHAUSTIVE AND SHALL NOT BE TAKEN TO ENCOMPASS ALL RISKS INVOLVED IN THE PURCHASE, HOLDING, TRADING AND USE OF TOKENS. PORTKEY SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY LOSS SUFFERED BY YOU AS A RESULT OF UNANTICIPATED RISKS.',
  },
];

export const EBRIDGE_DISCLAIMER_TEXT = EBRIDGE_DISCLAIMER_ARRAY.map(ele => ele.content).join('');
export const EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID = AElf.utils.sha256(EBRIDGE_DISCLAIMER_TEXT);
