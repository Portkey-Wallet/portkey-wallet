import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateState } from 'hooks/router';

function TermsOfService({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation();

  const navigate = useNavigateState();
  const { isPrompt } = useCommonState();
  const closeClick = useCallback(() => {
    if (onBack) onBack();
    else if (isPrompt) navigate(-1);
  }, [isPrompt, navigate, onBack]);

  const wordElement = useMemo(
    () => (
      <div className="terms-of-service">
        <div className="header">
          <div className="title">
            <span>{t('Portkey Terms of Service')}</span>
            <span>
              {t('Last Updated:')} {t('November 9, 2022.')}
            </span>
          </div>
          <div className="close-btn">
            {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
            <CustomSvg type="Close3" style={{ width: 16, height: 16 }} onClick={closeClick} />
          </div>
        </div>
        <div className="content">
          <span className="word-14">{t('Dear Users,')}</span>
          <span className="word-12">
            {t(
              'Thank you for choosing Portkey. This Portkey Terms of Service ("Agreement") is made between you ("you" or "User") and Portkey ("we" or "Portkey") and is legally binding between you and Portkey.',
            )}
          </span>
          <span className="word-12">
            {t(
              'Portkey hereby reminds you that you must carefully read the full content of this Agreement and other documents mentioned in this Agreement before using Portkey (Portkey extension or Portkey App). Particularly, you must carefully read the section "Disclaimer and Limitation of Liability" and other sections which are displayed in bold. You must make sure that you fully understand the whole Agreement and evaluate the risks of using Portkey on your own.',
            )}
          </span>

          <span className="word-16">{t('I. Confirmation and Acceptance of this Agreement')}</span>

          <span className="word-12">
            {t(
              '1. You understand that this Agreement and other relevant documents apply to Portkey and the Decentralized Applications ("DApps") which are developed and owned independently by Portkey team on Portkey(and excluding DApps developed by third parties).',
            )}
          </span>

          <span className="word-12">
            {t(
              '2. After you download Portkey and start to create or import a wallet, you are deemed as having read and accepted this Agreement, which shall cause this Agreement to become effective and legally binding on both you and Portkey immediately.',
            )}
          </span>

          <span className="word-12">
            {t(
              '3. Portkey may, at its sole discretion, modify or replace this Agreement at any time. The modified Agreement will automatically take effect once it is posted on Portkey and you will not be notified. If you do not agree with the modifications, you should cease to use Portkey immediately. Use of Portkey by you after any modification to this Agreement constitutes your acceptance of this Agreement as modified.',
            )}
          </span>
          <span className="word-12">
            {t(
              '4. If you are under 18 years old or you are a person of no capacity for civil acts or a person of limited capacity for civil acts, please use Portkey under the guidance of your parents or guardians.',
            )}
          </span>

          <span className="word-16">{t('II. Definition')}</span>

          <span className="word-14 word-bold">{t('1. Portkey')}</span>
          <span className="word-12">
            {t(
              'means the blockchain wallet developed by Portkey team based on blockchain systems which Portkey support or may support in the future and other supporting tools which are developed for the convenience of the Users when using blockchain systems.',
            )}
          </span>

          <span className="word-14 word-bold">{t('2. User')}</span>
          <span className="word-12">
            {t('a) a User must be a natural person who possesses full capacity for civil acts;')}
          </span>
          <span className="word-12">
            {t(
              'b) if you are under 18 years old, please use Portkey under the guidance of your parents or guardians. If any person of no capacity for civil acts conducts any transactions on Portkey or any person of limited capacity for civil acts conducts any transaction which is not commensurate his/her civil rights or act capacity, the parents or guardians of the User shall be liable for the consequences of such transactions.',
            )}
          </span>

          <span className="word-14 word-bold">{t('3. Create or Import Wallet')}</span>
          <span className="word-12">
            {t('means you use Portkey to create or import wallet after you accept this Agreement.')}
          </span>

          <span className="word-14 word-bold">{t('4. Wallet Password')}</span>
          <span className="word-12">
            {t(
              'means the password you set when you create the wallet. The Wallet Password will be used to encrypt and protect your Private Key. Portkey, as a decentralized application, will not store your Wallet Password on our servers, nor will your Wallet Password be stored in your own mobile devices. If you lose or forget your Wallet Password, you will have to reset the Wallet Password with your Private Key or Mnemonic Words.',
            )}
          </span>

          <span className="word-14 word-bold">{t('5. Alert')}</span>
          <span className="word-12">
            {t(
              'means the messages displayed on Portkey’s operation interface which provides suggestions for Users on subsequent operations.',
            )}
          </span>

          <span className="word-14 word-bold">{t('6. Specific Users')}</span>
          <span className="word-12">
            {t(
              'means Users who should cooperate with Portkey and disclose Personal Information in order to comply with the laws, regulations and policies of his/her country of nationality and/or country of residence.',
            )}
          </span>

          <span className="word-14 word-bold">{t('7. Private Key')}</span>
          <span className="word-12">
            {t('consists of 256 random bits. Private Key is the core for Users to hold and use the Tokens.')}
          </span>

          <span className="word-14 word-bold">{t('8. Public Key')}</span>
          <span className="word-12">
            {t(
              'is derived from the Private Key based on cryptography and is used to generate wallet addresses. A wallet address is a public address for reception of Tokens.',
            )}
          </span>

          <span className="word-14 word-bold">{t('9. Mnemonic Words')}</span>
          <span className="word-12">
            {t(
              'consists of 12 (or 15/18/21/24) words which are randomly generated, and it is based on BIP39, the industry standard of blockchain. It is a human readable format of words to back up your Private Key for recovery.',
            )}
          </span>

          <span className="word-14 word-bold">{t('10. Keystore')}</span>
          <span className="word-12">
            {t(
              'means Private Key or Mnemonic Words in the format of a file which is encrypted and protected by the User’s Wallet Password. Keystore is stored only in your mobile device and will not be synchronized to Portkey’ servers.',
            )}
          </span>

          <span className="word-14 word-bold">{t('11. Tokens')}</span>
          <span className="word-12">{t('means the tokens which are supported by Portkey currently.')}</span>

          <span className="word-14 word-bold">{t('12. Personal Information')}</span>
          <span className="word-12">
            {t(
              'means information recorded in electronic or any other form which may identify a natural person when used alone or in combination with other information, including but not limited to name, date of birth, identity number, personal biological identification information, address, telephone number, bank card number, e-mail address, wallet address, mobile device information, operation record, transaction record, but excluding Wallet Password, Private Key, Mnemonic Words and Keystore.',
            )}
          </span>

          <span className="word-16">{t('III. Services')}</span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '1. Create or import wallet. You may use Portkey to create a new wallet or import wallets generated by other wallet applications. You may only import wallets that are supported by Portkey.',
              ),
            }}></span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '2. Transfer and receive Tokens. You may manage your digital Tokens by using the transfer and reception functionalities of Portkey. Transfer of Tokens means the payer transfers the Token to the blockchain address of the payee. The actual transfer of Tokens happens on the blockchain system (instead of on Portkey).',
              ),
            }}></span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '3. Manage Tokens. You may use Portkey to add, manage or delete the Tokens supported by Portkey.',
              ),
            }}></span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '4. Browse DApps. Users may use Portkey to visit and use the services provided by DApps (including DApps developed by Portkey team and DApps developed by third parties).',
              ),
            }}></span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '5. Transaction records. We will copy all or part of your transaction records from the blockchain system. However, Users shall refer to the blockchain system for the latest transaction records.',
              ),
            }}></span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '6. Suspension of services. You understand that we are not able to reverse or cancel the transaction because transactions based on blockchain technologies are irrevocable. However, under certain circumstances, we may suspend or limit the functions of Portkey used by a particular User.',
              ),
            }}></span>

          <span className="word-12">{t('7. Other services that Portkey would like to provide.')}</span>

          <span className="word-14 word-bold">{t('Users who use Portkey must understand that:')}</span>
          <span className="word-12">
            {t(
              '1. In order to keep the decentralization feature of blockchain and to protect the security of your digital Tokens, Portkey offers decentralized service which is largely different from the banking and financial institutions. Users shall understand that Portkey DOES NOT provide the following services:',
            )}
          </span>
          <span className="word-12">
            {t(
              'a) store Users’ Wallet Password (the password Users set when creating or importing wallets), Private Key, Mnemonic Words or Keystore;',
            )}
          </span>
          <span className="word-12">
            {t('b) restore Users’ Wallet Password, Private Key, Mnemonic Words or Keystore;')}
          </span>
          <span className="word-12">{t('c) freeze the wallet;')}</span>
          <span className="word-12">{t('d) report the loss of wallet;')}</span>
          <span className="word-12">{t('e) restore the wallet;')}</span>
          <span className="word-12">{t('f) rollback transactions.')}</span>

          <span className="word-12">
            {t(
              '2. Users shall take care of their devices, back up the Portkey extension or Portkey App, and back up the Wallet Password, Mnemonic Words, Private Key and Keystore by themselves. If your mobile device is lost, your Portkey or your wallet is deleted and not backed up, your wallet is stolen or you forget your Wallet Password, Private Key, Mnemonic Words or Keystore, Portkey is not able to recover the wallet or restore Wallet Password, Private Key, Mnemonic Words or Keystore. Nor can Portkey cancel transactions for the mishandling of Users (such as typing in wrong addresses for transactions).',
            )}
          </span>

          <span className="word-12">
            {t(
              '3. Portkey does not support all existing Tokens. Do not use Portkey to handle any non-supported Tokens.',
            )}
          </span>

          <span className="word-12">
            {t(
              '4. Portkey is only a tool for Users to manage their Tokens and is not an exchange or a trading platform. For the purpose of this Agreement, the word "transactions" only means transferring and receiving Tokens, which is substantially different from transactions on the exchanges and trading platforms.',
            )}
          </span>

          <span className="word-12">
            {t(
              '5. The DApps integrated into Portkey include those developed independently by Portkey team and those developed by third parties. Portkey only acts as a blockchain browser for those third-party-developed DApps. Users shall, at their sole discretion, decide whether there would be any risks to accept the services provided by or to conduct transactions on the third-party-developed DApps.',
            )}
          </span>

          <span className="word-16">{t('IV. Your Rights and Obligations')}</span>

          <span className="word-14 word-bold">{t('1. Create or Import Wallet')}</span>
          <span className="word-12">
            {t(
              'a) Create or import wallet: you are entitled to use Portkey on your devices to create and/or import wallet, set Wallet Password and use your wallet on Portkey to transfer and receive Tokens on blockchain.',
            )}
          </span>
          <span className="word-12">
            {t(
              'b) Identification verification: Specific Users will be asked to complete identification verification before using Portkey to comply with related laws and regulations, according to the notification of Portkey. Specific Users may be asked to provide Personal Information including but not limited to name, identity number, cell phone number, bank card information, etc., without which the Specific Users will not be able to use certain services and the Specific Users alone shall be responsible for the loss caused by their delay in completing the verification.',
            )}
          </span>
          <span className="word-12">
            {t(
              'c) Portkey team may develop different versions of Portkey for different terminal devices. You shall download and install applicable version. If you download and install Portkey or other application with the same name as "Portkey" from any unauthorized third party, Portkey cannot guarantee the normal operation or security of such application. Any loss caused by using such application shall be borne by you.',
            )}
          </span>
          <span className="word-12">
            {t(
              'd) A previous version of Portkey may stop to operate after a new version is released. Portkey cannot guarantee the security, continuous operation or customer services for the previous version. Users shall download and use the latest version.',
            )}
          </span>

          <span className="word-14 word-bold">{t('2. Use of Portkey')}</span>
          <span className="word-12">
            {t(
              'a) Users shall take care of their devices, Wallet Password, Private Key, Mnemonic Words and Keystore by themselves. Portkey does not store or hold the above information for Users. You shall be responsible for any risks, liabilities, losses and expenses which result from frauds, you losing your device, disclosing (whether actively or passively) or forgetting Wallet Password, Private Key, Mnemonic Words or Keystore, or your wallet being attacked.',
            )}
          </span>
          <span className="word-12">
            {t(
              'b) Follow the Alert. You understand and agree to follow the Alert pushed by Portkey. You shall be responsible for any risks, liabilities, losses and expenses which result from your failure to comply with the Alert.',
            )}
          </span>
          <span className="word-12">
            {t(
              'c) You understand that Portkey undertakes no responsibility to conduct due diligence on the services or transactions provided by third-party-developed DApps. You shall make investment decisions rationally and assume the risks by yourself.',
            )}
          </span>
          <span className="word-12">
            {t(
              'd) Complete the identity verification. If Portkey reasonably deems your operation or transactions to be abnormal, or considers your identification to be doubtful, or Portkey considers it necessary to verify your identification documents or other necessary documents, you shall cooperate with Portkey and provide your valid identification documents or other necessary documents and complete the identification verification in time.',
            )}
          </span>
          <span className="word-12">{t('e) Transfer of Tokens')}</span>
          <span className="word-12">
            {t(
              'i. You understand that you may be subject to daily limits on the amount and times of transfers according to your location, regulatory requirements, transferring purposes, risk control by Portkey, or identification verification.',
            )}
          </span>
          <span className="word-12">
            {t(
              'ii. You understand that blockchain operations are "irrevocable". When you use Portkey to transfer Tokens, you shall be responsible for the consequences of your mishandling of the transfer (including but not limited to wrong address, problems of the node servers selected by you).',
            )}
          </span>
          <span className="word-12">
            {t('iii. You understand that the following reasons may result in "transfer failed".')}
          </span>

          <span className="word-12">{t('§  insufficient balance in wallet;')}</span>
          <span className="word-12">{t('§  insufficient fees for transaction;')}</span>
          <span className="word-12">{t('§  blockchain’s failure to execute the code of smart contracts;')}</span>
          <span className="word-12">
            {t(
              '§  the transfer amount exceeds the transfer limits imposed by authorities, Portkey or laws or regulations;',
            )}
          </span>
          <span className="word-12">{t('§  technical failure of the network or equipment;')}</span>
          <span className="word-12">
            {t('§  abandoned transactions result from blockchain network congestion or failure;')}
          </span>
          <span className="word-12">
            {t(
              "§  the wallet address of yours or your counterparty's is identified as special addresses, such as high-risk address, exchange address, ICO address, Token address etc.",
            )}
          </span>
          <span className="word-12">
            {t(
              'iv. You understand that Portkey is only a tool for transfer of Tokens. Portkey shall be deemed to have fulfilled its obligations once you have finished the transfer and shall not be held liable for any other disputes.',
            )}
          </span>
          <span className="word-12">
            {t(
              'f) Compliance. You understand that you shall abide by laws, regulations and policies of your country of nationality and/or country of residence when you use Portkey or the DApps on Portkey.',
            )}
          </span>
          <span className="word-12">
            {t(
              'g) Notifications. Portkey may send notifications to you by web announcements, e-mails, text messages, phone calls, Notification Centre information, popup tips or client-end notices (e.g., information about your transfer or suggestions on certain operations) which you shall be aware of timely.',
            )}
          </span>
          <span className="word-12 word-bold">{t('h) Fees and taxes.')}</span>
          <span className="word-12">
            {t('i. You need to pay transaction fees charged by the blockchain network(s) when you transfer Tokens.')}
          </span>
          <span className="word-12">
            {t(
              'ii. You understand that under some specific circumstances, your transfer of Tokens may fail due to an unstable network, but you may still be charged transaction fees by the blockchain network(s).',
            )}
          </span>
          <span className="word-12">
            {t(
              'iii. You shall bear all the applicable taxes and other expenses occurred due to your transactions on Portkey.',
            )}
          </span>

          <span className="word-16">{t('V. Risks')}</span>
          <span className="word-12">
            {t(
              '1. You understand and acknowledge that the blockchain technology is a field of innovation where the laws and regulations are not fully established. You may be faced with material risks including instability of technology or failure of Tokens redemption. You also understand that Tokens have much higher volatility comparing to other financial assets. You shall make investment decisions and hold or dispose of the Tokens in a reasonable way and corresponding to your financial status and risk preferences. You also acknowledge that the market information is captured from exchanges by Portkey and may not represent the latest or the best quotation of each Token.',
            )}
          </span>
          <span className="word-12">
            {t(
              '2. If you or your counterparty fails to comply with this Agreement or fails to follow the instructions, tips or rules on the website or on the page of the transaction or payment, Portkey does not guarantee successful transfer of the Tokens and Portkey shall not be held liable for any of the consequences of such failure. If you or your counterparty has already received the payment in Portkey or third-party wallet, you understand that transactions on blockchain are irreversible and irrevocable. You and your counterparty shall assume the liabilities and consequences of your transactions.',
            )}
          </span>
          <span className="word-12">
            {t(
              '3. When you use third-party-developed DApps integrated in Portkey, Portkey strongly suggest you read this Agreement and Portkey’s Alert carefully, get familiar with the counterparty and the product information and evaluate the risks before you make transactions on such DApps. You understand that such transactions and corresponding contractual relationship are between you and your counterparty. Portkey shall not be held liable for any risks, responsibilities, losses or expenses occurred due to such transactions.',
            )}
          </span>
          <span className="word-12">
            {t(
              '4. It is your sole responsibility to make sure that your counterparty is a person with full capacity for civil acts and decide whether you shall transact with him/her.',
            )}
          </span>
          <span className="word-12">
            {t(
              '5. You shall check the official blockchain system or other blockchain tools when you receive Alert such as "transaction failed" in order to avoid repetitive transfer. If you fail to follow this instruction, you shall bear the losses and expenses occurred due to such repetitive transfer.',
            )}
          </span>
          <span className="word-12">
            {t(
              '6. You understand that after you create or import wallet on Portkey, your Keystore, Private Key and Mnemonic Words are only stored on your device and will not be stored in Portkey or on the servers of Portkey. You may use other devices to use Portkey after you follow the instructions on Portkey to backup your wallet. If you lose your device before you could write down or backup your Wallet Password, Private Key, Mnemonic Words or Keystore, you may lose your Tokens and Portkey is unable to restore them. If your Wallet Password, Private Key, Mnemonic Words or Keystore is disclosed or the device which stores or holds your Wallet Password, Private Key, Mnemonic Words or Keystore is hacked or attacked, you may lose your Tokens and Portkey is unable to restore them. You shall bear the foregoing losses on your own.',
            )}
          </span>
          <span className="word-12">
            {t(
              '7. We suggest you backup your Wallet Password, Private Key, Mnemonic Words and Keystore when you create or import wallet by writing them down on papers or backup them in password management apps. Please do not use electronic methods such as screenshots, e-mails, text messages, note-taking apps on cell phones to backup any of the above information.',
            )}
          </span>
          <span className="word-12">
            {t(
              '8. In order to avoid potential security risks, we suggest you use Portkey in a secured network environment. Please do not use a jailbreak or Rooted mobile device.',
            )}
          </span>
          <span className="word-12">
            {t(
              '9. Please be alert to frauds when you use Portkey. If you find any suspicious conducts, we encourage you to inform us immediately.',
            )}
          </span>

          <span className="word-16">{t('VI. Change, Suspension, Termination of Portkey Services')}</span>

          <span className="word-12">
            {t(
              '1. You acknowledge and accept that Portkey may, at its sole discretion, provide only a part of services for the time being, suspend certain services or provide new services in the future. When we change our services, your continuous use of Portkey is deemed as your acceptance of this Agreement and revisions of this Agreement.',
            )}
          </span>

          <span className="word-12">
            {t('2. You understand that Portkey may suspend services under the following circumstances:')}
          </span>
          <span className="word-12">
            {t(
              'a) due to the maintenance, upgrading, failure of equipment and blockchain system and the interruption of communications etc., which lead to the suspension of the operation of Portkey;',
            )}
          </span>
          <span className="word-12">
            {t(
              "b) due to force majeure events including but not limited to typhoons, earthquakes, tsunamis, floods, power outages, wars, terrorist attacks, computer viruses, Trojan Horse, hacker attacks, system instability, government behaviors, and other reasons, Portkey is unable to provide services or in Portkey's reasonable opinion, continuous provision of services would result in significant risks;",
            )}
          </span>
          <span className="word-12">
            {t('c) due to other events which Portkey cannot control or reasonably predicate.')}
          </span>

          <span className="word-12">
            {t(
              '3. Portkey reserves the right to unilaterally suspend or terminate all or part of the functions of Portkey under the following circumstances:',
            )}
          </span>
          <span className="word-12">{t('a) death of Users;')}</span>
          <span className="word-12">{t('b) if you steal others’ wallets information or mobile devices;')}</span>
          <span className="word-12">{t('c) if you refuse to allow mandatory update of Portkey;')}</span>
          <span className="word-12">{t('d) if you use Portkey to commit illegal or criminal activities;')}</span>
          <span className="word-12">{t('e) if you hinder the normal use of Portkey by other Users;')}</span>
          <span className="word-12">{t('f) if you pretend to be staff or management personnel of Portkey team;')}</span>
          <span className="word-12">
            {t(
              'g) if you threaten the normal operation of Portkey computer system by attack, invasion, alternation or any other means;',
            )}
          </span>
          <span className="word-12">{t('h) if you use Portkey to send spam;')}</span>
          <span className="word-12">
            {t('i) if you spread rumors which endanger the goodwill of Portkey team and Portkey;')}
          </span>
          <span className="word-12">
            {t(
              'j) if you conduct any illegal activities, breach this Agreement etc. or other circumstances under which Portkey reasonably considers necessary to suspend services.',
            )}
          </span>

          <span className="word-12">
            {t(
              '4. You are entitled to export your wallets within a reasonable amount of time if Portkey changes, suspends or terminates its services.',
            )}
          </span>

          <span className="word-16">{t('VII. Your Representations and Warranties')}</span>

          <span className="word-12">
            {t(
              '1. You shall comply with all applicable laws, regulations and policies of your country of nationality and/or country of residence. You shall not use Portkey for any unlawful purposes or by any unlawful means.',
            )}
          </span>

          <span className="word-12">
            {t(
              '2. You shall not use Portkey to commit any illegal or unlawful activities, including but not limited to:',
            )}
          </span>
          <span className="word-12">
            {t('a) any illegal conducts, such as money laundering, illegal fund raising etc.;')}
          </span>
          <span className="word-12">
            {t(
              'b) accessing Portkey services, collecting or processing the content provided by Portkey, intervening or attempting to intervene any Users, by the employment of any automated programs, software, network engines, web crawlers, web analytics tools, data mining tools or similar tools etc.;',
            )}
          </span>
          <span className="word-12">
            {t('c) providing gambling information or inducing others to engage in gambling;')}
          </span>
          <span className="word-12">{t('d) invading into others’ Portkey to steal Tokens;')}</span>
          <span className="word-12">
            {t('e) engaging in any inaccurate or false transactions with the counterparty;')}
          </span>
          <span className="word-12">
            {t('f) committing any activities which harms or attempts to harm Portkey service system and data;')}
          </span>
          <span className="word-12">
            {t('g) other activities which Portkey has reason to believe are inappropriate.')}
          </span>

          <span className="word-12">
            {t(
              '3. You understand and accept that you shall be responsible for any violation of law (including but not limited to the regulations of the Customs and Tax) or for breach of this Agreement by you and shall indemnify Portkey against the losses, the third-party claims or administrative penalties against Portkey incurred by such violation or breach, including reasonable attorney’s fees.',
            )}
          </span>

          <span className="word-12">
            {t(
              '4. You confirm that you will pay the service fees charged by Portkey in time (if applicable). Portkey reserves the right to suspend the services when the User fails to pay service fees (if applicable).',
            )}
          </span>

          <span className="word-16">{t('VIII. Disclaimer and Limitation of Liability')}</span>

          <span className="word-12">
            {t('1. Portkey only undertakes obligations expressly set forth in this Agreement.')}
          </span>

          <span className="word-12">
            {t(
              '2. YOU ACKNOWLEDGE AND ACCEPT THAT, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAWS OF YOUR COUNTRY OF NATIONALITY AND/OR COUNTRY OF RESIDENCE, Portkey IS PROVIDED ON AN "AS IS", "AS AVAILABLE" AND "WITH ALL FAULTS" BASIS. Portkey shall not be held liable for malfunction of Portkey which results from the following reasons:',
            )}
          </span>
          <span className="word-12">{t('a) system maintenance or upgrading of Portkey;')}</span>
          <span className="word-12">
            {t('b) force majeure, such as typhoon, earthquake, flood, lightning or terrorist attack etc.;')}
          </span>
          <span className="word-12">
            {t(
              'c) malfunction of your device hardware and software, and failure of telecommunication lines and power supply lines;',
            )}
          </span>
          <span className="word-12">
            {t('d) your improper, unauthorized or unrecognized use of Portkey services;')}
          </span>
          <span className="word-12">
            {t(
              'e) computer viruses, Trojan Horse, malicious program attacks, network congestion, system instability, system or equipment failure, telecommunication failure, power failure, banking issues, government acts etc.;',
            )}
          </span>
          <span className="word-12">{t('f) any other reasons not imputed to Portkey.')}</span>

          <span className="word-12 word-bold">
            {t('3. Portkey shall not be held liable under the following circumstances:')}
          </span>
          <span className="word-12 word-bold">
            {t(
              'a) Users lose their devices, delete Portkey and wallets without back-up, forget Wallet Passwords, Private Keys, Mnemonic Words, Keystores without back-up, which result in the loss of their Tokens;',
            )}
          </span>
          <span className="word-12 word-bold">
            {t(
              'b) Users disclose their Wallet Passwords, Private Keys, Mnemonic Words, Keystores, or lend or transfer their Portkey to others, or authorize others to use their mobile devices or Portkey, or download Portkey extension/ application through unofficial channels, or use Portkey by other insecure means, which result in the loss of their Tokens;',
            )}
          </span>
          <span className="word-12 word-bold">
            {t(
              'c) Users mishandle Portkey (including but not limited to wrong address, failure of the node servers selected by you), which result in the loss of Tokens;',
            )}
          </span>
          <span className="word-12 word-bold">
            {t(
              'd) Users are unfamiliar with the knowledge of blockchain and their mishandling of Portkey results in loss of their Tokens;',
            )}
          </span>
          <span className="word-12 word-bold">
            {t(
              'e) Portkey is unable to copy accurate transaction records due to system delay or blockchain instability etc.;',
            )}
          </span>
          <span className="word-12 word-bold">
            {t(
              'f) Users shall undertake the risks and consequences of their transactions on the third-party-developed DApps.',
            )}
          </span>

          <span className="word-12">
            {t(
              '4. You understand that Portkey is only a management tool for Tokens which is incapable to control the quality, security and legitimacy of products and services provided by the third-party-developed DApps, or the authenticity and accuracy of their information and their capabilities to fulfill the obligations under the agreements with you. You, at your sole discretion, decide whether to transact on the third-party-developed DApps. It is the third-party-developed DApps, instead of Portkey, that transact with you. We kindly remind you to carefully review the authenticity, legitimacy, and effectiveness of related information provided by the third-party-developed DApps before you decide to use the DApps. In addition, you shall also assume all the risks arising from the transactions between you and any third-party exchanges.',
            )}
          </span>

          <span className="word-12">
            {t(
              '5. You acknowledge that Portkey may provide services to you and your counterparties simultaneously and you agree to waive any actual or potential conflicts of interest and will not claim against Portkey on such base or burden Portkey with more responsibilities or duty of care.',
            )}
          </span>

          <span className="word-12">{t('6. Portkey does not warrant that:')}</span>
          <span className="word-12">{t('a) services provided by Portkey would satisfy all your needs;')}</span>
          <span className="word-12">
            {t(
              'b) all techniques, products, services, information or other materials from Portkey would meet your expectations;',
            )}
          </span>
          <span className="word-12">
            {t(
              'c) all the transaction information in digital tokens markets captured from the third party exchanges are prompt, accurate, complete, and reliable;',
            )}
          </span>
          <span className="word-12">
            {t(
              'd) your counterparties on Portkey will perform their obligations in the transaction agreements with you timely.',
            )}
          </span>

          <span className="word-12">
            {t('7. In any case, the total liability for Portkey under this Agreement shall not exceed the greater of:')}
          </span>
          <span className="word-12">{t('a) USD value of 0.05 Ether; or')}</span>
          <span className="word-12">{t('b) $80 USD.')}</span>

          <span className="word-12">
            {t(
              '8. You are aware that Portkey is only a tool for Users to manage their Tokens and to display transaction information. Portkey does not provide legal, tax or investment advice. You shall seek advice from professional legal, tax, and investment advisors. In addition, Portkey shall not be liable for any investment loss, data loss etc. during your use of our service.',
            )}
          </span>

          <span className="word-12">
            {t(
              '9. You understand that we may change our entry standards, limit the range and ways to provide services for specific Users, etc. at any time in accordance with laws, regulations and policies of your country of nationality and/or country of residence.',
            )}
          </span>

          <span className="word-16">{t('IX. Entire Agreement')}</span>

          <span
            className="word-12"
            dangerouslySetInnerHTML={{
              __html: t(
                '1. This Agreement incorporates Portkey Terms of Service and other rules which might be modified and updated on Portkey extension, App or website.',
              ),
            }}></span>

          <span className="word-12">
            {t(
              '2. If any provision of this Agreement is found by a court with competent jurisdiction to be invalid, the other provisions of this Agreement remain in full force and effect.',
            )}
          </span>

          <span className="word-16">{t('X. Intellectual Property Rights Protection')}</span>
          <span className="word-12">
            {t(
              '1. Portkey is an application developed and owned by Portkey team. The intellectual property rights of any contents displayed in Portkey (including this Agreement, announcements, articles, videos, audios, images, archives, information, materials, trademarks or logos) are owned by Portkey or the third party licensors. Users can only use Portkey and its contents for the purpose of holding and managing their Tokens. In particular, without prior written consent from Portkey team or the third party licensors, no one shall use, modify, decompile, reproduce, publicly disseminate, alter, distribute, issue or publicly publish the abovementioned applications and contents.',
            )}
          </span>

          <span className="word-16">{t('XI. Governing Law and Dispute Resolution')}</span>
          <span className="word-12">
            {t(
              '1. The validity, interpretation, alternation, enforcement, dispute resolution of this Agreement and its revised versions shall be governed and construed in accordance with laws, regulations and policies of your country of nationality and/or country of residence. Where there is no applicable law, this Agreement shall be interpreted by applicable commercial and/or industrial practices.',
            )}
          </span>
          <span className="word-12">
            {t(
              '2. If any dispute or claim in connection with this Agreement arises between you and Portkey, the parties shall first attempt to resolve the dispute or claim through amicable negotiations in good faith. If the parties cannot reach an agreement, either party may sue the other party at the competent court where Portkey is located.',
            )}
          </span>

          <span className="word-16">{t('XII. Miscellaneous')}</span>
          <span className="word-12">
            {t(
              '1. During your use of Portkey services, if you come across any problems, you can contact us through the submission of your feedbacks on Portkey.',
            )}
          </span>
          <span className="word-12">
            {t(
              '2. This Agreement is accessible for all Users on Portkey. We encourage you to read this Agreement each time you log onto Portkey.',
            )}
          </span>
          <span className="word-12">{t('3. This Agreement shall become effective on November 9, 2022.')}</span>

          <span className="word-14 word-bold">
            {t(
              'As for any issues not covered in this Agreement, you shall comply with the announcements and relevant rules as updated by Portkey from time to time.',
            )}
          </span>
          <span className="word-14 word-bold word-right">{t('Portkey Team')}</span>
        </div>
      </div>
    ),
    [closeClick, t],
  );

  return isPrompt ? <div className="terms-of-service-page">{wordElement}</div> : wordElement;
}

export default TermsOfService;
